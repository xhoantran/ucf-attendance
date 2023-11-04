from rest_framework import permissions
from .models import User


class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            return request.user.role == User.UserRoleChoices.TEACHER
        except AttributeError:
            return False


class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            return request.user.role == User.UserRoleChoices.STUDENT
        except AttributeError:
            return False
