from django.contrib import admin
from .models import Salary, MonthlySalary, BankDetails

# Register your models here.
admin.site.register(Salary)
admin.site.register(MonthlySalary)
admin.site.register(BankDetails)