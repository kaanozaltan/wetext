import requests
import json

from django.db.models import Q
from django.conf import settings

from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import MessageSerializer, MessageListSerializer
from .models import Message


def handle_request(serializer):
    notification = {
        "message": serializer.data.get("content"),
        "from": serializer.data.get("sender_id"),
        "receiver": serializer.data.get("receiver_id")
    }
    headers = {
        "Content-Type": 'application/json',
    }
    try:
        requests.post(settings.SOCKET_SERVER, json.dumps(notification), headers=headers)
    except Exception as e:
        pass
    return True


class MessageView(ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.select_related('sender', 'receiver')
    permission_classes = (IsAuthenticated, )

    def create(self, request, *args, **kwargs):
        if str(request.user.id) != str(request.data.get("sender_id", None)):
            raise Exception("Only sender can create a message")

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        handle_request(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessageListAPIView(ListAPIView):
    queryset = Message.objects.select_related("sender", "receiver")
    serializer_class = MessageListSerializer

    def get_queryset(self):
        data = self.request.query_params.dict()
        receiver_id = data.get("user_id", None)
        sender_id = self.request.user.id

        return self.queryset.filter(
            Q(sender_id=receiver_id, receiver_id=sender_id) |
            Q(sender_id=sender_id, receiver_id=receiver_id)
        ).distinct()
