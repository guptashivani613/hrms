from rest_framework import serializers
from .models import Salary, MonthlySalary, Employee, User, BankDetails
from accounts.models import Manager

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = '__all__'

class BankDetailsSerializer(serializers.ModelSerializer):
    employee_email = serializers.EmailField(source='employee.email', read_only=True)
    class Meta:
        model = BankDetails
        fields = '__all__'

    def validate_ifsc_code(self, value):
        import re
        if not re.match(r'^[A-Z]{4}0[A-Z0-9]{6}$', value):
            raise serializers.ValidationError("Invalid IFSC code format.")
        return value

    def validate_account_number(self, value):
        if len(value) < 9 or len(value) > 18:
            raise serializers.ValidationError("Account number must be between 9 and 18 digits.")
        return value


class SalarySerializer(serializers.ModelSerializer):
    employee_email = serializers.EmailField(source='employee.email', read_only=True)
    bank_details = BankDetailsSerializer(read_only=True)
    class Meta:
        model = Salary
        fields = '__all__'

    def validate(self, data):
        # Ensure bank details belong to the employee
        bank_details = data.get("bank_details")
        employee = data.get("employee")

        if bank_details and bank_details.employee != employee:
            raise serializers.ValidationError({
                "bank_details": "Bank details do not match the employee."
            })
        return data


class MonthlySalarySerializer(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField()
    manager = serializers.SerializerMethodField() 
    salary = SalarySerializer(read_only=True)
    user = UserSerializer(read_only=True)   

    def get_employee(self, obj):
        if hasattr(obj.user, 'employee') and obj.user.employee:
            return EmployeeSerializer(obj.user.employee).data
        return None

    def get_manager(self, obj):
        if hasattr(obj.user, 'manager') and obj.user.manager:
            return ManagerSerializer(obj.user.manager).data
        return None

    class Meta:
        model = MonthlySalary
        fields = [
            'id',
            'user',
            'salary',
            'from_date',
            'to_date',
            'total_salary',
            'paid_amount',
            'balance_amount',
            'paid_status',
            'payment_due_date',
            'employee',
            'manager',
        ]

class GetEmpSalaryDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = '__all__'

class MonthlySalaryInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlySalary
        fields = [
            "user",
            "salary",
            "from_date",
            "to_date",
            "total_salary",
            "paid_amount",
            "balance_amount",
            "paid_status",
            "paid_date",
            "payment_due_date"
        ]
