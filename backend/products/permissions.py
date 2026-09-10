from rest_framework.permissions import BasePermission

class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        return(
            request.user.is_authenticated and request.user.role in ['ADMIN', 'MANAGER'])

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return(
            request.user.is_authenticated and request.user.role == 'ADMIN')

class IsAnyRole(BasePermission):
    def has_permission(self, request, view):
        return(
            request.user.is_authenticated and request.user.role in ['ADMIN', 'MANAGER', 'EMPLOYEE'])