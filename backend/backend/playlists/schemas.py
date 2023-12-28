from uuid import UUID

from ninja import Schema
from backend.musics.schemas import MusicSchemaOut
from backend.users.schemas import UserPlaylistSchema, UserSchemaOut


class PlaylistMusicOrderSchema(MusicSchemaOut):
    order_id: list[int] = []


class PlaylistSchemaOut(UserPlaylistSchema):
    musics: list[PlaylistMusicOrderSchema]
    owner: UserSchemaOut
    owner_is_artist: bool = False

    @staticmethod
    def resolve_owner_is_artist(obj):
        if obj.owner.is_artist():
            return True
        else:
            return False

    @staticmethod
    def resolve_musics(obj):
        orders = obj.get_musics_order()
        musics = obj.get_musics()
        for music in musics:
            music.order_id = [order.id for order in orders.filter(music_id=music.id)]
        return musics


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
