from ninja import NinjaAPI
from django.contrib.admin.views.decorators import staff_member_required
from music.api import router as music_router
from users.api import router as users_router

import orjson
from ninja.parser import Parser
from django.http import HttpRequest


class ORJSONParser(Parser):
    def parse_body(self, request: HttpRequest):
        return orjson.loads(request.body)


api = NinjaAPI(parser=ORJSONParser(), docs_decorator=staff_member_required)

api.add_router("/", music_router)
api.add_router("/", users_router)
