from rest_framework import serializers
from .models import Admin, Employee, User
from rest_framework import serializers
from .models import User, HR, Manager, EmergencyContact, Education, Experience

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

    def create(self, validated_data):
        user = validated_data.get('user')
        if Employee.objects.filter(user=user).exists():
            raise serializers.ValidationError("An Employee profile for this user already exists.")
        return super().create(validated_data)

class EmployeeLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class UserOTPSendSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=128)
    last_name = serializers.CharField(max_length=128)
    password = serializers.CharField(max_length=128)
    type = serializers.ChoiceField(choices=User.Types.choices)

    def validate_email(self, value):
        return value

class UserOTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    password = serializers.CharField(max_length=128)

    def validate(self, data):
        email = data['email']
        otp = data['otp']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'email': 'Email not found.'})

        if user.otp != otp:
            raise serializers.ValidationError({'otp': 'Invalid OTP.'})

        if user.otp_verified:
            raise serializers.ValidationError({'otp': 'OTP has already been verified.'})

        data['user'] = user
        return data

    def save(self):
        user = self.validated_data['user']
        user.otp_verified = True
        password = self.validated_data.get('password')
        if password:
            user.set_password(password)  # Hash and save the password
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'type', 'password', 'otp_verified']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        user.otp_verified = False 
        user.generate_otp()
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email','first_name', 'last_name', 'username', 'type', 'otp_verified']
class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'

class HRSerializer(serializers.ModelSerializer):
    class Meta:
        model = HR
        fields = '__all__'

class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = '__all__'

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ["id", "title", "degree", "start_date", "end_date"]

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'user', 'company_name', 'role', 'start_date', 'end_date']