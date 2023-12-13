import orjson
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpRequest
from ninja import NinjaAPI
from ninja.parser import Parser

from backend.artists.api import router as artists_router
from backend.users.api import router as users_router


class ORJSONParser(Parser):
    def parse_body(self, request: HttpRequest):
        return orjson.loads(request.body)


api = NinjaAPI(
    parser=ORJSONParser(),
    docs_decorator=staff_member_required,
    title="SpotLie API",
    description="SpotLie API Endpoints Documentation.",
    version="1.0.0",
)

api.add_router("/", users_router)
api.add_router("/", artists_router)
