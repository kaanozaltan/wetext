from rest_framework import serializers

from .models import Message
from chat_api.users.models import User
from chat_api.users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField()
    sender = serializers.SerializerMethodField()
    receiver_id = serializers.IntegerField()
    receiver = serializers.SerializerMethodField()


    class Meta:
        model = Message
        fields = ('sender', 'sender_id', 'receiver', 'receiver_id', 'content', 'created_at',)

    def get_sender(self, obj):
        user = User.objects.get(id=obj.sender_id)
        return UserSerializer(user).data

    def get_receiver(self, obj):
        user = User.objects.get(id=obj.receiver_id)
        return UserSerializer(user).data


class MessageListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"
