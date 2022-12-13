from django.db.models import Q


from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import MessageSerializer
from .models import Message


class MessageView(ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated, )
    queryset = Message.objects.select_related('sender', 'receiver')

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
        try:
            request.data._mutable = True
        except:
            pass

        if str(request.user.id) != str(request.data.get("sender_id", None)):
            raise Exception("Only sender can create a message")

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
