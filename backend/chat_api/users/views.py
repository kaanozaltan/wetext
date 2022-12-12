from django.contrib.auth import authenticate

from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status


from .models import Jwt, User
from .serializers import LoginSerializer, RegisterSerializer, RefreshSerializer, UserSerializer
from .authentication import Authentication
from .permissions import IsAuthenticatedCustom
from . import utils


class LoginView(CreateAPIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny, )

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if not user:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_404_NOT_FOUND)

        Jwt.objects.filter(user_id=user.id).delete()
        access = utils.get_access_token({"user_id": user.id})
        refresh = utils.get_refresh_token()

        Jwt.objects.create(
            user_id=user.id,
            access=access,
            refresh=refresh
        )

        return Response({"access": access, "refresh": refresh}, status=status.HTTP_200_OK)


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny, )

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_data = serializer.validated_data

        User.objects.create_user(
            username=user_data["username"],
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            password=user_data["password"],
        )

        return Response(data="User successfully created.", status=status.HTTP_201_CREATED)


class RefreshView(CreateAPIView):
    serializer_class = RefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            active_jwt = Jwt.objects.get(
                refresh=serializer.validated_data["refresh"]
            )
        except Jwt.DoesNotExist:
            return Response({"error": "refresh token not found"}, status=status.HTTP_404_NOT_FOUND)
        if not Authentication.verify_token(serializer.validated_data["refresh"]):
            return Response({"error": "Token is invalid or has expired"}, status=status.HTTP_400_BAD_REQUEST)

        access = utils.get_access_token({"user_id": active_jwt.user.id})
        refresh = utils.get_refresh_token()

        active_jwt.access = access.decode()
        active_jwt.refresh = refresh.decode()
        active_jwt.save()

        return Response({"access": access, "refresh": refresh})


class LogoutView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        Jwt.objects.filter(user_id=user_id).delete()

        return Response("Logged out successfully", status=200)


class MeView(APIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticatedCustom, )

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)



