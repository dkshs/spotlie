from uuid import UUID

from ninja import Schema

from backend.musics.schemas import MusicSchemaOut
from backend.playlists.schemas import PlaylistSchemaOut
from backend.users.schemas import UserSchemaOut


class MusicContextSchemaOut(Schema):
    current_music: MusicSchemaOut | None = None
    current_playlist: PlaylistSchemaOut | None = None
    musics: list[MusicSchemaOut] = []
    music_state: str = "paused"
    owner: UserSchemaOut


class FieldsToUpdate(Schema):
    current_music_id: bool = False
    current_playlist_id: bool = False
    musics_ids: bool = False
    music_state: bool = False


class MusicContextSchemaIn(Schema):
    current_music_id: UUID | None = None
    current_playlist_id: UUID | None = None
    musics_ids: list[UUID] = []
    music_state: str = "paused"
    fields_to_update: FieldsToUpdate | None = None
