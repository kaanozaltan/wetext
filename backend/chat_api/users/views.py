from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from .models import Jwt, User
from .serializers import LoginSerializer, RegisterSerializer, RefreshSerializer
from .authentication import Authentication
from . import utils


class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )

        if not user:
            return Response({"error": "Invalid username or password"}, status="400")

        Jwt.objects.filter(user_id=user.id).delete()

        access = utils.get_access_token({"user_id": user.id})
        refresh = utils.get_refresh_token()

        Jwt.objects.create(
            user_id=user.id, access=access, refresh=refresh
        )

        return Response({"access": access, "refresh": refresh})


class RegisterView(APIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data.pop("username")

        User.objects._create_user(
            username=username, **serializer.validated_data)

        return Response({"success": "User created."}, status=201)


class RefreshView(APIView):
    serializer_class = RefreshSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            active_jwt = Jwt.objects.get(
                refresh=serializer.validated_data["refresh"])
        except Jwt.DoesNotExist:
            return Response({"error": "refresh token not found"}, status="400")
        if not Authentication.verify_token(serializer.validated_data["refresh"]):
            return Response({"error": "Token is invalid or has expired"})

        access = utils.get_access_token({"user_id": active_jwt.user.id})
        refresh = utils.get_refresh_token()

        active_jwt.access = access.decode()
        active_jwt.refresh = refresh.decode()
        active_jwt.save()

        return Response({"access": access, "refresh": refresh})


class LogoutView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        user_id = request.user.id
        Jwt.objects.filter(user_id=user_id).delete()

        return Response("Logged out successfully", status=200)
