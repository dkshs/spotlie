import itertools
from uuid import UUID

from ninja import Schema

from backend.musics.schemas import MusicSchemaOut
from backend.users.schemas import UserPlaylistSchema, UserSchemaOut


class PlaylistMusicOrderSchema(MusicSchemaOut):
    order_id: int = []


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
        musics = []
        orders_id = [*set(itertools.chain([order.id for order in orders]))]
        orders_id.sort()
        for order_id in orders_id:
            order = orders.get(id=order_id)
            music = order.music
            music.order_id = order.id
            musics.append(music)
        return musics


class PlaylistSchemaIn(Schema):
    name: str
    description: str = None
    musics: list[UUID] = []
    is_public: bool = False


class PlaylistSchemaUpdateIn(Schema):
    name: str = None
    description: str = None
    is_public: bool = None
    update_image: bool = False
