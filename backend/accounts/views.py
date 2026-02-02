
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import ListModelMixin
from rest_framework import generics, permissions
from django.db.utils import IntegrityError
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Admin, Employee, User, HR, Manager, EmergencyContact, Education, Experience
from .serializers import EmployeeSerializer, AdminSerializer, UserOTPVerifySerializer, UserOTPVerifySerializer, UserOTPSendSerializer, HRSerializer, ManagerSerializer, UserSerializer, EmergencyContactSerializer, EducationSerializer, ExperienceSerializer
from .permissions import IsHR, IsAdmin, IsHRorSelf

class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsHRorSelf]
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    parser_classes = (JSONParser, MultiPartParser, FormParser) 
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['firstname', 'lastname','department', 'designation', 'gender']
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

class HRViewSet(viewsets.ModelViewSet):
    queryset = HR.objects.all()
    serializer_class = HRSerializer
    parser_classes = (JSONParser, MultiPartParser, FormParser) 

class ManagerViewSet(viewsets.ModelViewSet):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer

class CountEmployee(viewsets.ViewSet):
    permission_classes = [AllowAny]  
    def list(self, request):
        # abc = request.user
        # breakpoint()
        total = Employee.objects.count()
        active = Employee.objects.filter(active=True).count()
        inactive = Employee.objects.filter(active=False).count()
        
        return Response({
            'total_employees': total,
            'active_employees': active,
            'inactive_employees': inactive,
        })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='send-otp')
    def send_otp(self, request):
        serializer = UserOTPSendSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user_type = serializer.validated_data['type']
            first_name = serializer.validated_data.get('first_name')
            last_name = serializer.validated_data.get('last_name')

            if not first_name or not last_name:
                return Response(
                    {'error': 'First name and last name are required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )


            user = User.objects.filter(email=email).first()
            if user:
                return Response(
                    {'error': 'A user with this email is already registered.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Handle EMPLOYEE type without OTP
            if user_type == User.Types.EMPLOYEE:
                try:
                    user = User.objects.create(
                        email=email,
                        type=user_type,
                        first_name=first_name,
                        last_name=last_name,
                        username=email.split('@')[0],
                        otp_verified=True  # Auto-verify for EMPLOYEE type
                    )
                    user.set_password(serializer.validated_data.get('password'))
                    user.save()
                    return Response(
                         {
                        'message': 'User registered successfully.',
                        'user': {
                            'email': user.email,
                            'type': user.type,
                            'otp_verified': user.otp_verified,
                            'first_name': user.first_name,
                            'last_name': user.last_name
                        }
                    },
                    status=status.HTTP_201_CREATED
                )
                except IntegrityError:
                    return Response(
                        {'error': 'A user with this username already exists. Please try again.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Check if the user exists; create if not
            try:
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        'type': user_type,
                        'username': email.split('@')[0], 
                        'first_name': first_name,
                        'last_name': last_name,
                        'otp_verified': False
                    }
                )

                # Generate OTP and save the user
                user.generate_otp()
                user.save()

                # Send OTP to the email
                send_mail(
                    'Your OTP for Admin Registration',
                    f'Your OTP is {user.otp}',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )

                # Prepare response data
                user_data = {
                    'email': user.email,
                    'type': user.type,
                    'first_name': first_name,
                    'last_name': last_name,
                    'otp_verified': user.otp_verified
                }

                return Response(
                    {
                        'message': 'OTP sent to email.',
                        'otp': user.otp,
                        'user': user_data
                    },
                    status=status.HTTP_200_OK
                )

            except IntegrityError as e:
                return Response(
                    {'error': 'A user with this username already exists. Please try again.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['post'], url_path='verify-otp')
    def verify_otp(self, request):
        serializer = UserOTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            # OTP is verified, save the password if provided
            user = serializer.save()
            password = serializer.validated_data.get('password')
            if password:
                user.set_password(password)  # Hash and save the password
            user.save()

            return Response({'message': 'OTP verified and password set successfully.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            raise AuthenticationFailed("Email and password are required.")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid email or password.")

        if not check_password(password, user.password):
            raise AuthenticationFailed("Invalid email or password.")

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token) 

        return Response({
            'access_token': access_token,
            'refresh_token': str(refresh),
            'user_id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'type': getattr(user, 'type', 'N/A'),
        }, status=200)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise NotFound("User with this email does not exist.")

        # Generate OTP and save it
        user.generate_otp()

        # Send OTP via email
        send_mail(
            subject="Password Reset OTP",
            message=f"Your OTP for password reset is {user.otp}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        return Response({"message": "OTP sent to your email."}, status=200)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        if not email or not otp or not new_password:
            raise ValidationError("Email, OTP, and new password are required.")

        # Validate OTP
        try:
            user = User.objects.get(email=email, otp=otp)
        except User.DoesNotExist:
            raise ValidationError("Invalid OTP or email.")

        # Reset password
        user.set_password(new_password)
        user.otp = None  # Clear OTP after use
        user.save()

        return Response({"message": "Password has been reset successfully."}, status=200)


class AllUsersViewSet(viewsets.ViewSet, ListModelMixin):
    def list(self, request):
        employees = Employee.objects.all()
        admins = Admin.objects.all()
        hrs = HR.objects.all()
        managers = Manager.objects.all()

        employee_data = EmployeeSerializer(employees, many=True).data
        admin_data = AdminSerializer(admins, many=True).data
        hr_data = HRSerializer(hrs, many=True).data
        manager_data = ManagerSerializer(managers, many=True).data

        combined_data = employee_data + admin_data + hr_data + manager_data

        return Response(combined_data)

class EmergencyContactListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Retrieve, update, or delete a specific emergency contact
class EmergencyContactRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)

class EducationListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = EducationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Education.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Retrieve, Update, and Delete Education Records
class EducationRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EducationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Education.objects.filter(user=self.request.user)

class ExperienceViewSet(ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Experience.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        """
        Overriding the create method to handle bulk creation of experiences
        from a list of experience objects.
        """
        # List of experiences from the payload
        experience_data = request.data

        # Make sure it's an array of experiences
        if isinstance(experience_data, list):
            # Filter experiences that belong to the authenticated user
            for experience in experience_data:
                experience['user'] = request.user.id  # Set the authenticated user ID

            # Create the experiences
            serializer = self.get_serializer(data=experience_data, many=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Invalid payload. Expected an array of experiences."}, 
                            status=status.HTTP_400_BAD_REQUEST)