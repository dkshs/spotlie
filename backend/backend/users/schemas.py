from datetime import datetime
from uuid import UUID

from ninja import Schema


class UserPlaylistSchema(Schema):
    id: UUID
    name: str
    description: str | None
    image: str | None
    is_public: bool
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def resolve_image(obj):
        return obj.get_image_url()


class UserSchemaOut(Schema):
    id: UUID
    first_name: str | None
    last_name: str | None
    full_name: str
    username: str
    image: str | None
    playlists: list[UserPlaylistSchema]
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def resolve_playlists(obj):
        return obj.get_playlists()

    @staticmethod
    def resolve_full_name(obj):
        return obj.get_full_name()
