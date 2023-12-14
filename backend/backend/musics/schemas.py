from datetime import datetime
from uuid import UUID
from backend.artists.schemas import ArtistSchemaOut

from ninja import Schema


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
    artist_id: UUID
    release_date: datetime | None


class MusicSchemaUpdateIn(Schema):
    title: str = None
    artist_id: UUID = None
    release_date: datetime | None = None
