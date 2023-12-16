import orjson
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpRequest
from ninja import NinjaAPI
from ninja.parser import Parser

from backend.artists.api import router as artists_router
from backend.musics.api import router as musics_router
from backend.playlists.api import router as playlists_router
from backend.users.api import router as users_router


class ApiProcessError(Exception):
    def __init__(self, message: str, status_code: int = 500, full_message: str = None):
        self.message = message
        self.full_message = full_message
        self.status_code = status_code
        super().__init__(message, status_code, full_message)


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
api.add_router("/", musics_router)
api.add_router("/", playlists_router)
