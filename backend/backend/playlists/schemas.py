from uuid import UUID

from ninja import Schema

from backend.musics.schemas import MusicSchemaOut
from backend.users.schemas import UserPlaylistSchema, UserSchemaOut


class PlaylistSchemaOut(UserPlaylistSchema):
    musics: list[MusicSchemaOut]
    owner: UserSchemaOut
    owner_is_artist: bool = False

    @staticmethod
    def resolve_owner_is_artist(obj):
        if obj.owner.is_artist():
            return True
        else:
            return False


class PlaylistSchemaIn(Schema):
    name: str
    description: str = None
    musics: list[UUID] = None
    is_public: bool = False


class PlaylistSchemaUpdateIn(Schema):
    name: str = None
    description: str = None
    is_public: bool = None
    update_image: bool = False
