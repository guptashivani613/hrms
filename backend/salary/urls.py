from rest_framework import routers
from salary.views import SalaryViewSet, MonthlySalaryViewSet, GetEmpSalaryDetails, BankDetailsViewSet, GetBankDetailsViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register('salary', SalaryViewSet, basename='salary')
router.register('monthly-salary', MonthlySalaryViewSet, basename='monthlySalary')
router.register('bank-details', BankDetailsViewSet, basename='bank-details')
router.register('get-bank-details', GetBankDetailsViewSet, basename='get-bank-details')

urlpatterns = [
    path('', include(router.urls)),
    path('employee/salary-details/',GetEmpSalaryDetails.as_view(), name='salary-detail' )
]
