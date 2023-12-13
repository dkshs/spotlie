from ninja import Schema
from uuid import UUID
from datetime import datetime


class ArtistSchemaOut(Schema):
    id: UUID
    username: str
    image: str | None
    created_at: datetime
    cover: str | None


class ArtistSchemaIn(Schema):
    external_id: str
    username: str
    email: str
    image: str = None


class ArtistSchemaUpdateIn(Schema):
    username: str = None
    email: str = None
    image: str = None
