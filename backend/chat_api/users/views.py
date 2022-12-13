from django.contrib.auth import authenticate, logout

from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.authtoken.models import Token


from .models import User
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer


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

        token = Token.objects.get_or_create(user=user)[0].key

        return Response({"token": token}, status=status.HTTP_200_OK)


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny, )

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_data = serializer.validated_data
        User.objects.create_user(
            username=user_data["username"],
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            password=user_data["password"],
        )

        return Response(data="User successfully created.", status=status.HTTP_201_CREATED)


class LogoutView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        logout(request)
        return Response("Logged out successfully", status=status.HTTP_200_OK)


class MeView(APIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class UserListAPIView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    queryset = User.objects.all()
