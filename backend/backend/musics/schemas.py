from datetime import datetime
from uuid import UUID

from ninja import Schema

from backend.users.schemas import UserSchemaOut


class MusicSchemaOut(Schema):
    id: UUID
    title: str
    artist: UserSchemaOut
    release_date: datetime | None
    image: str | None
    audio: str
    created_at: datetime

    @staticmethod
    def resolve_image(obj):
        return obj.get_image_url()

    @staticmethod
    def resolve_audio(obj):
        return obj.get_audio_url()


class MusicSchemaIn(Schema):
    title: str
    release_date: datetime = None


class MusicSchemaUpdateIn(Schema):
    title: str = None
    release_date: datetime | None = None
