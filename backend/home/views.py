from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.views import APIView
from datetime import datetime
from rest_framework import status
from django.db.models import Count, Q
from django.utils.timezone import now
from django.utils.timezone import localtime
from datetime import datetime
from .utils import news
from .models import Insurance, Bonus, Holiday, LeaveBalance,Leave, Announcement, Attendance
from django.contrib.auth import get_user_model
from .serializers import LeaveBalanceSerializer,LeaveSerializer, InsuranceSerializer, BonusSerializer, HolidaySerializer, EmployeeSerializer, HRSerializer, AnnouncementSerializer, UserDetailSerializer, AttendanceSerializer
from accounts.models import Employee, HR
from accounts.permissions import IsHR

class LeaveBalanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = LeaveBalance.objects.all()
    serializer_class = LeaveBalanceSerializer

    def get_queryset(self):
        user = self.request.user
        if user.type == 'HR':
            return LeaveBalance.objects.all()
        return LeaveBalance.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = self.request.user
        if not user:
            return Response({"error": "Only HR can create leave balances."}, status=403)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        user = self.request.user
        if not user:
            return Response({"error": "Only HR can update leave balances."}, status=403)
        return super().update(request, *args, **kwargs)

class LeaveViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsHR]
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

    def get_queryset(self):
        if self.request.user.type == self.request.user.Types.HR:
            return Leave.objects.all() # HR can see all leave applications
        return Leave.objects.filter(user=self.request.user) # Employees see only their own applications

    def create(self, request, *args, **kwargs):
        user = request.user
        leave_type = request.data.get('leave_type')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        # Calculate leave duration
        try:
            leave_days = (datetime.strptime(end_date, '%Y-%m-%d') - datetime.strptime(start_date, '%Y-%m-%d')).days + 1
        except Exception as e:
            return Response({"error": "Invalid dates provided."}, status=400)

        leave_balance = LeaveBalance.objects.filter(user=user, leave_type=leave_type).first()
        if not leave_balance:
            return Response({"error": f"No leave balance found for leave type: {leave_type}"}, status=400)

        if leave_balance.remaining_leaves() < leave_days:
            return Response({"error": "Insufficient leave balance."}, status=400)

        leave_balance.used_leaves += leave_days
        leave_balance.save()

        return super().create(request, *args, **kwargs)

class NewsViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response(news, status=200)

class InsuranceViewSet(viewsets.ModelViewSet):
    queryset = Insurance.objects.all()
    serializer_class = InsuranceSerializer

class BonusViewSet(viewsets.ModelViewSet):
    serializer_class = BonusSerializer

    def get_queryset(self):
        return Bonus.objects.filter(user=self.request.user)

class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated] 

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:  # Allow read-only actions (GET, HEAD, OPTIONS)
            return [IsAuthenticated()]  # Allow all authenticated users to read
        return [IsAuthenticated(), IsHR()]  # Only HR can perform write actions (POST, PUT, DELETE)

    def get_queryset(self):
        return Announcement.objects.all()  # You could customize this if you need role-based visibility

    def perform_create(self, serializer):
        announcement = serializer.save() 
class HolidayViewSet(viewsets.ModelViewSet):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer

class GetLoggedInEmployeeDetail(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        user = request.user
        try:
            employee = user.employee
            serializer = EmployeeSerializer(employee, context={'request': request})
            return Response(serializer.data, status=200)
        except Employee.DoesNotExist:
            user_serializer = UserDetailSerializer(user)
            return Response(user_serializer.data, status=200)

class GetLoggedInHRDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            # Try to fetch the HR object linked to the user
            hr = user.hr
            serializer = HRSerializer(hr, context={'request': request})  
            return Response(serializer.data, status=200)
        except HR.DoesNotExist: 
            # If HR does not exist, return the User data
            user_serializer = UserDetailSerializer(user)
            return Response(user_serializer.data, status=200)

class GetLoggedInUserDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserDetailSerializer(user)
        return Response(serializer.data, status=200)

User = get_user_model()

class AttendanceView(APIView):
    permission_classes = [IsAuthenticated] 
    
    def post(self, request):
        user = request.user 
        current_date = now().date()

        try:
            attendance = Attendance.objects.get(user=user, date=current_date)
            if attendance.logout_time:
                return Response(
                    {"message": "Attendance already closed for today."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            # Update logout time with timezone-aware current time
            attendance.logout_time = localtime(now())  # Save local time for logout
            attendance.save()
            return Response(
                {"message": "Logout time recorded successfully.", "data": AttendanceSerializer(attendance).data},
                status=status.HTTP_200_OK,
            )
        except Attendance.DoesNotExist:
            # Create new attendance record with local timezone-aware login time
            attendance = Attendance.objects.create(
                user=user,
                login_time=localtime(now()),  # Save local time for login
                date=current_date
            )
            return Response(
                {"message": "Login time recorded successfully.", "data": AttendanceSerializer(attendance).data},
                status=status.HTTP_201_CREATED,
            )

    def get(self, request):
        user = self.request.user
        print("Server time (UTC):", now())
        print("Local time:", localtime(now()))
        
        # Check user type and filter attendance accordingly
        if user.type == 'HR':  # Assuming 'type' is the field for user roles
            attendance = Attendance.objects.all()
        else:
            attendance = Attendance.objects.filter(user=user)  # Regular users can only see their own attendance
        
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
