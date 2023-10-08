from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from rest_framework import generics, permissions

from .serializers import UserSerializer

User = get_user_model()


class UserDetail(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.FRONTEND_BASE_URL
    client_class = OAuth2Client


class LoginRedirect(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def redirect(self, request, *args, **kwargs):
        return redirect(settings.FRONTEND_BASE_URL)

    def get(self, request, *args, **kwargs):
        return self.redirect(request, *args, **kwargs)
