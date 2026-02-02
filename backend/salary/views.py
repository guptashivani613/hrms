from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import action
from datetime import datetime
from rest_framework.mixins import ListModelMixin
from rest_framework.exceptions import NotFound
from .serializers import SalarySerializer, GetEmpSalaryDetailSerializer, MonthlySalarySerializer, MonthlySalaryInputSerializer, BankDetailsSerializer
from accounts.models import Employee
from .models import MonthlySalary, Salary, BankDetails
from accounts.permissions import IsHR, IsEmployee

class BankDetailsViewSet(viewsets.ModelViewSet):
    queryset = BankDetails.objects.all()
    serializer_class = BankDetailsSerializer
    permission_classes = [IsHR]

    def perform_create(self, serializer):
        serializer.save()

class GetBankDetailsViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def user_bank_details(self, request):
        try:
            bank_details = BankDetails.objects.get(employee=request.user)
        except BankDetails.DoesNotExist:
            return Response(
                {"error": "No bank details found for the logged-in user."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BankDetailsSerializer(bank_details)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SalaryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsHR]
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee_id']

    def create(self, request, *args, **kwargs):
        bank_details_id = request.data.get("bank_details_id")
        employee_id = request.data.get("employee_id")
    
        if bank_details_id:
            try:
                bank_details = BankDetails.objects.get(id=bank_details_id)
                # Ensure the bank details belong to the same employee
                if bank_details.employee.id != int(employee_id):
                    return Response(
                        {"error": "Bank details do not match the employee."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except BankDetails.DoesNotExist:
                return Response(
                    {"error": "Bank details with the given ID do not exist."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        data = request.data
        salary = Salary.objects.create(**data)
        response = self.serializer_class(salary).data
        return Response(response)
        
class MonthlySalaryViewSet(viewsets.ModelViewSet):
    queryset = MonthlySalary.objects.all()
    serializer_class = MonthlySalarySerializer
    permission_classes = [IsHR] 
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'paid_status', 'from_date', 'to_date']

    def create(self, request, *args, **kwargs):
            input_serializer = MonthlySalaryInputSerializer(data=request.data)
            input_serializer.is_valid(raise_exception=True)
            monthly_salary = input_serializer.save()
            output_serializer = MonthlySalarySerializer(monthly_salary)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def user_salary(self, request):
        month = request.query_params.get('month')
        if not month:
            return Response(
                {"error": "Please provide in 'month' query parameters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            month_date = datetime.strptime(month, "%Y-%m")
        except ValueError:
            return Response(
                {"error": "Invalid month format. Please use 'YYYY-MM'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        salary = MonthlySalary.objects.filter(
            user=request.user,
            from_date__year=month_date.year,
            from_date__month=month_date.month
        ).first()

        if not salary:
            return Response(
                {"error": f"No salary record found for month '{month}'."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(salary)
        return Response(serializer.data, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'])
    def payslip(self, request):
        email = request.query_params.get('email')
        month = request.query_params.get('month')

        if not email or not month:
            return Response(
                {"error": "Please provide both 'email' and 'month' query parameters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            month_date = datetime.strptime(month, "%Y-%m")
        except ValueError:
            return Response(
                {"error": "Invalid month format. Please use 'YYYY-MM'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        salary = MonthlySalary.objects.filter(
            user__email=email,
            from_date__year=month_date.year,
            from_date__month=month_date.month
        ).first()

        if not salary:
            return Response(
                {"error": f"No salary record found for email '{email}' in month '{month}'."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(salary)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GetEmpSalaryDetails(APIView):
    permission_classes = [IsEmployee]

    def get(self, request):
        try:
            # Fetch the salary record for the logged-in user
            salary = Salary.objects.filter(employee=request.user).first()
            
            if not salary:
                # Return 200 status with a custom message when no data is found
                return Response({"message": "No salary details available"}, status=200)
            
            # Serialize the salary data
            serializer = GetEmpSalaryDetailSerializer(salary)
            return Response(serializer.data, status=200)
        except Exception as e:
            # Return a generic error response for unexpected issues
            print("Unexpected error:", e)
            return Response({"error": "An unexpected error occurred"}, status=500)


