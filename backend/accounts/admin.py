from django.contrib import admin
from .models import Admin, Employee, User, HR, Manager, EmergencyContact, Education, Experience

# Register your models here.
admin.site.register(Admin) 
admin.site.register(Employee)
admin.site.register(User)
admin.site.register(HR)
admin.site.register(Manager)
admin.site.register(EmergencyContact)
admin.site.register(Education)
admin.site.register(Experience)