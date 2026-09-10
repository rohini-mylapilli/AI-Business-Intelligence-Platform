from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return(
            request.user.is_authenticated and request.user.role == 'ADMIN')

class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        return(
            request.user.is_authenticated and request.user.role in ['ADMIN', 'MANAGER'])

class IsAnyRole(BasePermission):
    def has_permission(self, request, view):
        return(
            request.user.is_authenticated and request.user.role in ['ADMIN', 'MANAGER', 'EMPLOYEE'])

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return(
            request.user.is_authenticated and request.user.role == 'MANAGER')


class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return(
            request.user.is_authenticated and request.user.role == 'EMPLOYEE')