from django.db import models
from accounts.models import Employee, User

class BankDetails(models.Model):
    account_holder_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=20)
    ifsc_code = models.CharField(max_length=11)
    bank_name = models.CharField(max_length=255)
    branch_name = models.CharField(max_length=255, blank=True, null=True)
    employee = models.OneToOneField(User, on_delete=models.CASCADE, related_name='bank_details')

    class Meta:
        db_table = 'bank_details'

    def __str__(self):
        return f"{self.employee.email} - {self.bank_name}"

class Salary(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    ppa = models.FloatField()
    monthly_salary = models.FloatField()
    basic_da = models.FloatField()
    hra = models.FloatField()
    conveyance = models.FloatField()
    pf = models.FloatField()
    esic = models.FloatField()
    professional_tax = models.FloatField()
    net_salary = models.FloatField()
    pan_card_number = models.CharField(max_length=10, blank=True, null=True)
    bank_details = models.OneToOneField(BankDetails, on_delete=models.CASCADE, null=True, blank=True)
    class Meta:
        db_table = 'salary'

    def __str__(self):
        return self.employee.email
    
    def save(self, *args, **kwargs):
        if self.bank_details and self.bank_details.employee != self.employee:
            raise ValueError("Bank details do not match the employee.")
        super().save(*args, **kwargs)


class MonthlySalary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="monthly_salaries")
    salary = models.ForeignKey(Salary, on_delete=models.CASCADE, related_name="monthly_salaries")
    from_date = models.DateField()
    to_date = models.DateField()
    total_salary = models.FloatField() 
    paid_amount = models.FloatField(default=0)
    balance_amount = models.FloatField(default=0) 
    paid_status = models.BooleanField(default=False)  
    paid_date = models.DateField(null=True, blank=True)  
    payment_due_date = models.DateField(null=True, blank=True) 

    class Meta:
        db_table = "monthly_salary"
        verbose_name = "Monthly Salary"
        verbose_name_plural = "Monthly Salaries"

    def __str__(self):
        return f"Monthly Salary for {self.user.email}"

    def save(self, *args, **kwargs):
        self.balance_amount = self.total_salary - self.paid_amount
        self.paid_status = self.balance_amount <= 0 
        super().save(*args, **kwargs)


