from ninja import NinjaAPI

import orjson
from ninja.parser import Parser
from django.http import HttpRequest


class ORJSONParser(Parser):
    def parse_body(self, request: HttpRequest):
        return orjson.loads(request.body)


api = NinjaAPI(parser=ORJSONParser())
