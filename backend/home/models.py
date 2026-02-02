from django.db import models
from accounts.models import User
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from datetime import datetime

class Insurance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="insurance_details")
    policy_name = models.CharField(max_length=100)
    policy_number = models.CharField(max_length=50)
    coverage_amount = models.DecimalField(max_digits=10, decimal_places=2)
    expiration_date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.policy_name}"

class Bonus(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bonus_records")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_awarded = models.DateField()
    description = models.TextField()

    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.date_awarded}"


class Holiday(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        db_table = 'holiday'
        ordering = ['date']

    def __str__(self):
        return f"{self.name} - {self.date}"
  
class LeaveBalance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="leave_balances")
    leave_type = models.CharField(max_length=50, choices=[('Monthly', 'Monthly'), ('Sick', 'Sick'), ('Annual', 'Annual')], default='Monthly')
    total_leaves = models.IntegerField(default=0)
    used_leaves = models.IntegerField(default=0)

    def remaining_leaves(self):
        return self.total_leaves - self.used_leaves

    def __str__(self):
        return f"{self.user.username} - {self.leave_type}: {self.remaining_leaves()} remaining"

class Leave(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="leaves")
    leave_type = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending')

    def __str__(self):
        return f"{self.user.username} - {self.leave_type}"

class Announcement(models.Model):
    header = models.CharField(max_length=255)  
    description = models.TextField() 
    date = models.DateField()

    def __str__(self):
        return f"{self.header} ({self.date})"

User = get_user_model()
class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attendances")
    date = models.DateField(default=now)
    login_time = models.DateTimeField(null=True, blank=True)  # Changed to DateTimeField
    logout_time = models.DateTimeField(null=True, blank=True)  # Changed to DateTimeField

    def __str__(self):
        return f"{self.user.email} - {self.date}"

    def duration(self):
        if self.login_time and self.logout_time:
            return (self.logout_time - self.login_time).total_seconds() / 3600  # Duration in hours
        return 0

        