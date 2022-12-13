import requests
import json

from django.db.models import Q
from django.conf import settings

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import MessageSerializer
from .models import Message


def handle_request(serializer):
    notification = {
        "message": serializer.data.get("content"),
        "from": serializer.data.get("sender"),
        "receiver": serializer.data.get("receiver_id")
    }
    headers = {
        "Content-Type": 'application/json',
    }
    try:
        response = requests.post(settings.SOCKET_SERVER, json.dumps(notification), headers=headers)
    except Exception as e:
        pass

    return True


class MessageView(ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.select_related('sender', 'receiver')
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        data = self.request.query_params.dict()
        user_id = data.get('user_id', None)

        if user_id:
            active_user_id = self.request.user.id
            return self.queryset.filter(
                Q(sender_id=user_id, receiver_id=active_user_id) |
                Q(sender_id=active_user_id, receiver_id=user_id)
            ).distinct()

        return self.queryset

    def create(self, request, *args, **kwargs):
        if str(request.user.id) != str(request.data.get("sender_id", None)):
            raise Exception("Only sender can create a message")

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        handle_request(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
