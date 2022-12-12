from django.db import models


class Message(models.Model):
    sender = models.ForeignKey(
        "users.User", related_name="message_sender", on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        "users.User", related_name="message_receiver", on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} --> {self.receiver.username}"

    class Meta:
        ordering = ("-created_at",)