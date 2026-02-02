from rest_framework import serializers
from django.utils.timezone import localtime
from .models import Insurance, Bonus, Holiday
from accounts.models import Employee, HR, User
from .models import LeaveBalance, Leave, Announcement, Attendance

class LeaveBalanceSerializer(serializers.ModelSerializer):
    remaining_leaves = serializers.ReadOnlyField()

    class Meta:
        model = LeaveBalance
        fields = '__all__'

class LeaveSerializer(serializers.ModelSerializer):
    remaining_leave = serializers.ReadOnlyField()
    user_email = serializers.EmailField(source = 'user.email', read_only = True)
    class Meta:
        model = Leave
        fields = '__all__'


class InsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insurance
        fields = '__all__'

class BonusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bonus
        fields = '__all__'

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'header', 'description', 'date'] 

class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = '__all__'

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'type', 'first_name', 'last_name']

class EmployeeSerializer(serializers.ModelSerializer):
    profilePic = serializers.SerializerMethodField()
    user = UserDetailSerializer() 
    class Meta:
        model = Employee
        fields = '__all__'

    def get_profilePic(self, obj):
        request = self.context.get('request')
        if obj.profilePic and request:
            return request.build_absolute_uri(obj.profilePic.url)
        return None

class HRSerializer(serializers.ModelSerializer):
    profilePic = serializers.SerializerMethodField()
    user = UserDetailSerializer() 
    class Meta:
        model = HR
        fields = '__all__'

    def get_profilePic(self, obj):
        request = self.context.get('request')
        if obj.profilePic and request:
            return request.build_absolute_uri(obj.profilePic.url)
        return None

class AttendanceSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer() 
    # Format the login time
    login_time_formatted = serializers.SerializerMethodField()
    # Format the logout time
    logout_time_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = ['id', 'user', 'date', 'login_time', 'logout_time', 'login_time_formatted', 'logout_time_formatted']

    def get_login_time_formatted(self, obj):
        # Convert to local time and format as needed
        if obj.login_time:
            local_login_time = localtime(obj.login_time)  # Convert to local time
            return local_login_time.strftime('%I:%M %p')  # Format as 12-hour clock with AM/PM
        return None

    def get_logout_time_formatted(self, obj):
        # Convert to local time and format as needed
        if obj.logout_time:
            local_logout_time = localtime(obj.logout_time)  # Convert to local time
            return local_logout_time.strftime('%I:%M %p')  # Format as 12-hour clock with AM/PM
        return None