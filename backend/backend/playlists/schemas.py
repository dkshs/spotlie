from datetime import datetime
from uuid import UUID

from ninja import Schema

from backend.musics.schemas import MusicSchemaOut
from backend.users.schemas import UserSchemaOut


class PlaylistSchemaOut(Schema):
    id: UUID
    name: str
    description: str | None
    image: str | None
    musics: list[MusicSchemaOut]
    owner: UserSchemaOut
    is_public: bool
    created_at: datetime
    updated_at: datetime


class PlaylistSchemaIn(Schema):
    name: str
    description: str = None
    owner_id: UUID
    owner_is_artist: bool = False
    musics: list[UUID] = None
    is_public: bool = False


class PlaylistSchemaUpdateIn(Schema):
    name: str = None
    description: str = None
    is_public: bool = None
