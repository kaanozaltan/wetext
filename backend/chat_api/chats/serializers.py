from rest_framework import serializers

from .models import Message
from chat_api.users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(write_only=True)
    receiver_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Message
        fields = ('sender_id', 'receiver_id', 'content', 'created_at',)
