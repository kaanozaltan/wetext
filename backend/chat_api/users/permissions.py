from django.utils import timezone

from rest_framework.permissions import BasePermission

from .models import User
from .utils import decodeJWT


class IsAuthenticatedCustom(BasePermission):

    def has_permission(self, request, view):
        user = decodeJWT(request.data['token'])
        if not user:
            return False
        request.user = user

        if request.user and request.user.is_authenticated:
            User.objects.filter(id=request.user.id).update(
                is_online=timezone.now())
            return True
        return False