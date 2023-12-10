from django.contrib.admin.views.decorators import staff_member_required
from ninja import NinjaAPI

import orjson
from ninja.parser import Parser
from django.http import HttpRequest


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
