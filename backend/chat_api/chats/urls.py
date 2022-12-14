from django.urls import path

from .views import MessageView, MessageListAPIView


urlpatterns = [
    path('messages/', MessageListAPIView.as_view()),
    path('message/', MessageView.as_view({'post': 'create'})),
]
