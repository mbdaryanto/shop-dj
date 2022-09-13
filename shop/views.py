from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth import login, models
from rest_framework import permissions, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView


def home(request: HttpRequest):
    return render(request, 'home.html')


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginView, self).post(request, format=None)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ['username']


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def user_profile(request: HttpRequest):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
