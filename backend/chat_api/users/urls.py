from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import LoginView, RegisterView, LogoutView, MeView, UserListAPIView

router = DefaultRouter(trailing_slash=False)

urlpatterns = [
    path('user/login/', LoginView.as_view()),
    path('user/register/', RegisterView.as_view()),
    path('user/logout/', LogoutView.as_view()),
    path('user/me/', MeView.as_view()),
    path('users/', UserListAPIView.as_view()),
]
