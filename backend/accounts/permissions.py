from rest_framework import permissions
from .models import User

class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.type == User.Types.EMPLOYEE

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.type == User.Types.ADMIN

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.type == User.Types.MANAGER

class IsHR(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.type == User.Types.HR

class IsPayrollAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.type == User.Types.PAYROLL_ADMIN
class IsHRorSelf(permissions.BasePermission):

    def has_permission(self, request, view):
        # Allow authenticated users only
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow HR full access
        if hasattr(request.user, 'type') and request.user.type == User.Types.HR:
            return True

        # Allow employees to update their own profile
        if request.method in ['PUT', 'PATCH'] and obj.user == request.user:
            return True

        # Allow employees to create their profile
        if request.method == 'POST':
            return True

        # Deny all other access
        return False
