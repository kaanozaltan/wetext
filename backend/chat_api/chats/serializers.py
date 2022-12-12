from rest_framework import serializers

from .models import Message
from chat_api.users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    receiver = UserSerializer()

    class Meta:
        model = Message
        fields = ('sender', 'receiver', 'content', 'is_read', 'created_at', )