from ninja import NinjaAPI
from django.conf import settings
from ninja.security import HttpBearer
from django.contrib.admin.views.decorators import staff_member_required
from music.api import router as music_router

import orjson
from ninja.parser import Parser
from django.http import HttpRequest


class AuthBearer(HttpBearer):
    def authenticate(self, request, token):
        if token == settings.API_KEY:
            return token


class ORJSONParser(Parser):
    def parse_body(self, request: HttpRequest):
        return orjson.loads(request.body)


api = NinjaAPI(parser=ORJSONParser(), docs_decorator=staff_member_required)

api.add_router("/", music_router, auth=AuthBearer())
