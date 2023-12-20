from ninja import Schema

from backend.musics.schemas import MusicSchemaOut
from backend.users.schemas import UserSchemaOut


class ArtistSchemaOut(UserSchemaOut):
    about: str | None
    musics: list[MusicSchemaOut]
    twitter_link: str | None
    instagram_link: str | None
    cover: str | None
    is_verified: bool

    @staticmethod
    def resolve_cover(obj):
        return obj.get_cover_url()


class ArtistSchemaUpdateIn(Schema):
    about: str = None
    twitter_link: str = None
    instagram_link: str = None
    is_verified: bool = None
