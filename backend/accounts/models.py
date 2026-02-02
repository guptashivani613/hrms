from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.auth.hashers import make_password
import random
from django.db import models

from django.contrib.auth.hashers import make_password
from django.db import models

class User(AbstractUser):
    class Types(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        HR = "HR", "HR"
        MANAGER = "MANAGER", "Manager"
        EMPLOYEE = "EMPLOYEE", "Employee"
        PAYROLL_ADMIN = "PAYROLL_ADMIN", "Payroll Administrator"

    type = models.CharField(max_length=20, choices=Types.choices, default=Types.EMPLOYEE)

    email = models.EmailField(unique=True, max_length=50)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    groups = models.ManyToManyField(
        'auth.Group', related_name='custom_user_set', blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', related_name='custom_user_permissions_set', blank=True
    )

    def __str__(self):
        return self.email

    @property
    def employee(self):
        return getattr(self, 'employee', None)
    
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_verified = models.BooleanField(default=False)
    
    def generate_otp(self):
        self.otp = f"{random.randint(100000, 999999)}"
        self.save()

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

class Admin(models.Model):
    GENDER = [('male', 'Male'), ('female', 'Female'), ('transgender', 'Transgender')]
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(max_length=100)
    contact = models.IntegerField()
    gender = models.CharField(max_length=50, choices=GENDER)
    dob = models.DateField()
    address = models.CharField(max_length=255)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    dateOfHired = models.DateField()
    dateOfJoined = models.DateField()
    profilePic = models.ImageField(upload_to='admin_profile_pics/', default="admin/profile-picture.png")
    active = models.BooleanField(default=True)
    
    # One-to-One relationship with User model
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,  # This ensures the admin is deleted when the user is deleted
        related_name="admin",  # This allows you to access Admin from User instance as user.admin
        null=True,
        blank=True,
        limit_choices_to={'type': User.Types.ADMIN}  # Ensure that the related user is of type Admin
    )
    class Meta:
        db_table = 'admin'

    def __str__(self):
        return self.firstname + ' ' + self.lastname

class Employee(models.Model):
    GENDER = [('male', 'Male'), ('female', 'Female'),('transgender', 'Transgender')]
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(max_length=100)
    contact = models.IntegerField()
    gender = models.CharField(max_length=50, choices=GENDER)
    dob = models.DateField()
    address = models.CharField(max_length=255)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    dateOfHired = models.DateField()
    dateOfJoined = models.DateField()
    profilePic = models.ImageField(
        upload_to="emp_profile_pics/", null = True)
    active = models.BooleanField(default=True)
    
    # One-to-One relationship with User model
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,  # This ensures the employee is deleted when the user is deleted
        related_name="employee",  # This allows you to access Employee from User instance as user.employee
        limit_choices_to={'type':User.Types.EMPLOYEE}
    )

    class Meta:
        db_table = 'employee'

    def __str__(self):
        return self.firstname + ' ' + self.lastname

class HR(models.Model):
    GENDER = [('male', 'Male'), ('female', 'Female'), ('transgender', 'Transgender')]
    
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(max_length=100)
    contact = models.IntegerField()
    gender = models.CharField(max_length=50, choices=GENDER)
    dob = models.DateField()
    address = models.CharField(max_length=255)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    dateOfHired = models.DateField()
    dateOfJoined = models.DateField()
    profilePic = models.ImageField(upload_to='hr_profile_pics/', null = True)
    active = models.BooleanField(default=True)
    
    # One-to-One relationship with User model
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,  # This ensures the HR is deleted when the user is deleted
        related_name="hr",  # This allows you to access HR from User instance as user.hr
        limit_choices_to={'type': User.Types.HR}  # Ensure that the related user is of type HR
    )

    class Meta:
        db_table = 'hr'

    def __str__(self):
        return self.firstname + ' ' + self.lastname

class Manager(models.Model):
    GENDER = [('male', 'Male'), ('female', 'Female'), ('transgender', 'Transgender')]
    
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(max_length=100)
    contact = models.IntegerField()
    gender = models.CharField(max_length=50, choices=GENDER)
    dob = models.DateField()
    address = models.CharField(max_length=255)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    dateOfHired = models.DateField()
    dateOfJoined = models.DateField()
    profilePic = models.ImageField(upload_to='Manager_profile_pics/', null = True)
    active = models.BooleanField(default=True)
    
    # One-to-One relationship with User model
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,  # This ensures the Manager is deleted when the user is deleted
        related_name="manager",  # This allows you to access Manager from User instance as user.manager
        limit_choices_to={'type': User.Types.MANAGER}  # Ensure that the related user is of type Manager
    )

    class Meta:
        db_table = 'manager'

    def __str__(self):
        return self.firstname + ' ' + self.lastname

class EmergencyContact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="emergency_contacts")
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField(max_length=254, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    relationship = models.CharField(max_length=50)
    secondary_name = models.CharField(max_length=100)
    secondary_phone = models.CharField(max_length=15)
    secondary_email = models.EmailField(max_length=254, blank=True, null=True)
    secondary_address = models.TextField(blank=True, null=True)
    secondary_relationship = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.relationship})"

class Education(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="educations"
    )
    title = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)  # Allow for "Present"

    def __str__(self):
        return f"{self.title} - {self.degree}"

class Experience(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="experiences"
    )
    company_name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return self.company_name

