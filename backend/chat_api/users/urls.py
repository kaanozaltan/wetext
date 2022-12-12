from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import LoginView, RegisterView, RefreshView, LogoutView

router = DefaultRouter(trailing_slash=False)

urlpatterns = [
    path('user/login/', LoginView.as_view()),
    path('user/register/', RegisterView.as_view()),
    path('user/refresh/', RefreshView.as_view()),
    path('user/logout/', LogoutView.as_view()),
]
