import uuid
from datetime import datetime

from django.contrib.contenttypes.models import ContentType
from ninja import FilterSchema, Query, Router, UploadedFile

from backend.musics.models import Music
from backend.utils.schemas import ErrorSchema
from config.api.auth import token_is_valid
from config.api.utils import ApiProcessError, api_error

from ..models import MusicOrder, Playlist
from ..schemas import PlaylistSchemaIn, PlaylistSchemaOut, PlaylistSchemaUpdateIn

router = Router()


class GetPlaylistsFilter(FilterSchema):
    object_id: uuid.UUID | None = None
    name__icontains: str | None = None


@router.get("/", response={200: list[PlaylistSchemaOut], 500: ErrorSchema})
def get_playlists(
    request, limit: int = None, offset: int = 0, orderBy: str = None, filters: GetPlaylistsFilter = Query(...)
):
    try:
        playlists = filters.filter(Playlist.objects.all())
        if orderBy:
            playlists = playlists.order_by(*orderBy.split(","))
        return 200, playlists[offset : offset + limit] if limit else playlists[offset:]  # noqa: E203
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get("/{id}", response={200: PlaylistSchemaOut, 404: ErrorSchema, 500: ErrorSchema})
def get_playlist(request, id: uuid.UUID):
    try:
        return 200, Playlist.objects.get(id=id)
    except Playlist.DoesNotExist:
        return api_error(404, "Playlist not found", "Playlist not found")
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.post("/", response={201: PlaylistSchemaOut, 400: ErrorSchema, 401: ErrorSchema, 500: ErrorSchema})
def create_playlist(request, playlist: PlaylistSchemaIn, image: UploadedFile = None):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        payload_dict = playlist.dict()
        musics = payload_dict.pop("musics", [])
        payload_dict["object_id"] = is_authenticated.user.id
        owner_type = "artist" if is_authenticated.user.is_artist() else "user"
        payload_dict["content_type"] = ContentType.objects.get(app_label=f"{owner_type}s", model=owner_type)
        playlist = Playlist.objects.create(
            **payload_dict,
            image=image,
        )
        for i, music in enumerate(musics, 1):
            MusicOrder.objects.create(playlist=playlist, order=i, music_id=music)
        return 201, playlist
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.patch("/{id}", response={200: PlaylistSchemaOut, 400: ErrorSchema, 401: ErrorSchema, 404: ErrorSchema})
def update_playlist(request, id: uuid.UUID, playlist: PlaylistSchemaUpdateIn = None, image: UploadedFile = None):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        playlist_dict = playlist.dict(exclude_unset=True) if playlist else {}
        if playlist_dict == {} and image is None:
            raise ApiProcessError(400, "Bad request", "Data not provided")
        playlist = Playlist.objects.get(id=id)
        if playlist.object_id != is_authenticated.user.id:
            raise ApiProcessError(403, "Forbidden", "You are not the owner of this playlist")
        update_image = playlist_dict.pop("update_image", False)
        for key, value in playlist_dict.items():
            setattr(playlist, key, value)
        if update_image:
            playlist.image = image
        playlist.save()
        return 200, playlist
    except Playlist.DoesNotExist:
        return api_error(404, "Playlist not found", "Playlist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.delete("/{id}", response={204: None, 401: ErrorSchema, 403: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema})
def delete_playlist(request, id: uuid.UUID):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        playlist = Playlist.objects.get(id=id)
        if playlist.object_id != is_authenticated.user.id:
            raise ApiProcessError(403, "Forbidden", "You are not the owner of this playlist")
        playlist.delete()
        return 204, None
    except Playlist.DoesNotExist:
        return api_error(404, "Playlist not found", "Playlist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.patch(
    "/{id}/add_musics",
    response={200: PlaylistSchemaOut, 400: ErrorSchema, 401: ErrorSchema, 403: ErrorSchema, 404: ErrorSchema},
)
def add_musics_to_playlist(request, id: uuid.UUID, musics: list[uuid.UUID]):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        playlist = Playlist.objects.get(id=id)
        if playlist.object_id != is_authenticated.user.id:
            raise ApiProcessError(403, "Forbidden", "You are not the owner of this playlist")
        order = playlist.get_musics_order().count() + 1
        for i, music in enumerate(musics, order):
            if music_obj := Music.objects.filter(id=music).first():
                MusicOrder.objects.create(playlist=playlist, order=i, music_id=music, added_at=datetime.now())
            else:
                raise ApiProcessError(400, "Music not found", "Music not found")
        playlist.save()
        return 200, playlist
    except Playlist.DoesNotExist:
        return api_error(404, "Playlist not found", "Playlist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.patch(
    "/{id}/remove_musics",
    response={
        200: PlaylistSchemaOut,
        400: ErrorSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
    },
)
def remove_musics_from_playlist(request, id: uuid.UUID, musics: list[uuid.UUID] | list[int]):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        playlist = Playlist.objects.get(id=id)
        if playlist.object_id != is_authenticated.user.id:
            raise ApiProcessError(403, "Forbidden", "You are not the owner of this playlist")
        musicOrders = MusicOrder.objects.filter(playlist=playlist)
        if not musicOrders.exists() or musicOrders.count() == 0:
            raise ApiProcessError(400, "Bad request", "Playlist is empty")
        music_deleted = False
        for musicOrder in musicOrders:
            if musicOrder.music_id in musics or musicOrder.id in musics:
                musicOrder.delete()
                music_deleted = True
            elif music_deleted:
                musicOrder.order -= 1
                musicOrder.save()
        return 200, playlist
    except Playlist.DoesNotExist:
        return api_error(404, "Playlist not found", "Playlist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
