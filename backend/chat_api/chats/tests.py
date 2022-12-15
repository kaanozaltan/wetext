from django.db.models import Q

from rest_framework.test import APITestCase, APIClient

from chat_api.users.models import User
from chat_api.chats.models import Message


class TestMessage(APITestCase):
    def setUp(self):
        self.sender = User.objects.create(
            username="sender",
            first_name="sender",
            last_name="user",
            password="sender123"
        )
        self.receiver = User.objects.create(
            username="receiver",
            first_name="receiver",
            last_name="user",
            password="receiver123"
        )
        self.third_user = User.objects.create(
            username="newuser",
            first_name="new",
            last_name="user",
            password="newuser123"
        )

        self.client = APIClient()

    def test_send_message(self):
        url = f"/api/message/"
        data = {
            "sender_id": self.sender.id,
            "receiver_id": self.receiver.id,
            "content": "Hello"
        }
        self.client.force_authenticate(self.sender)

        response = self.client.post(path=url, data=data)

        message = Message.objects.filter()[0]

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(message.content, data["content"])
        self.assertEqual(message.sender, self.sender)
        self.assertEqual(message.receiver, self.receiver)

    def test_list_messages(self):
        url = f"/api/messages/?user_id={self.receiver.id}"

        Message.objects.bulk_create(
            [
                Message(sender=self.sender, receiver=self.receiver, content="Hello.How are you?"),
                Message(sender=self.receiver, receiver=self.sender, content="I am good. You?"),
                Message(sender=self.receiver, receiver=self.third_user, content="Where are you?")
            ]
        )

        self.client.force_authenticate(self.sender)

        response = self.client.get(path=url)

        messages = Message.objects.filter(
            Q(sender_id=self.sender.id, receiver_id=self.receiver.id) |
            Q(sender_id=self.receiver.id, receiver_id=self.sender.id)
        ).distinct()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), messages.count())
