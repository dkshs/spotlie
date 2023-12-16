from datetime import datetime
from uuid import UUID

from ninja import Schema

from backend.artists.schemas import ArtistSchemaOut


class MusicSchemaOut(Schema):
    id: UUID
    title: str
    artist: ArtistSchemaOut
    release_date: datetime | None
    image: str | None
    audio: str
    created_at: datetime


class MusicSchemaIn(Schema):
    title: str
    release_date: datetime = None


class MusicSchemaUpdateIn(Schema):
    title: str = None
    release_date: datetime | None = None
