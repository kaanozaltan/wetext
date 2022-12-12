import jwt
import random
import string
from datetime import datetime, timedelta

from django.conf import settings

from .models import User


def get_random(length):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


def get_access_token(payload):
    return jwt.encode(
        {"exp": datetime.now() + timedelta(minutes=5), **payload},
        settings.SECRET_KEY,
        algorithm="HS256"
    )


def get_refresh_token():
    return jwt.encode(
        {"exp": datetime.now() + timedelta(days=365), "data": get_random(10)},
        settings.SECRET_KEY,
        algorithm="HS256"
    )


def decodeJWT(token):
    if not token:
        return None

    decoded = jwt.decode(token, key=settings.SECRET_KEY, algorithms=["HS256"])
    if decoded:
        try:
            return User.objects.get(id=decoded["user_id"])
        except Exception:
            return None
