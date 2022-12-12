from rest_framework import serializers

from .models import User


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}


class RefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = ('password',)
