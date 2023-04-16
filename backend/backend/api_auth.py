from django.conf import settings
from ninja.security import HttpBearer


class AuthBearerGlobal(HttpBearer):
    def authenticate(self, request, token):
        if token == settings.API_KEY:
            return token


class AuthBearerEndpoint(HttpBearer):
    def authenticate(self, request, token):
        if token == settings.ENDPOINT_KEY:
            return token
