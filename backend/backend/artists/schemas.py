from datetime import datetime
from uuid import UUID

from ninja import Schema


class ArtistSchemaOut(Schema):
    id: UUID
    username: str
    image: str | None
    created_at: datetime
    cover: str | None


class ArtistSchemaIn(Schema):
    external_id: str


class ArtistSchemaUpdateIn(Schema):
    username: str = None
    email: str = None
    image: str = None
