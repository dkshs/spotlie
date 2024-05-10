# ruff: noqa: BLE001, TRY301, A002
import uuid
from datetime import UTC
from datetime import datetime

from django.contrib.contenttypes.models import ContentType
from ninja import FilterSchema
from ninja import Query
from ninja import Router
from ninja import UploadedFile

from backend.musics.models import Music
from backend.playlists.models import MusicOrder
from backend.playlists.models import Playlist
from backend.playlists.schemas import PlaylistSchemaIn
from backend.playlists.schemas import PlaylistSchemaOut
from backend.playlists.schemas import PlaylistSchemaUpdateIn
from backend.utils.schemas import ErrorSchema
from config.api.auth import token_is_valid
from config.api.utils import ApiProcessError
from config.api.utils import api_error

router = Router()


class GetPlaylistsFilter(FilterSchema):
    object_id: uuid.UUID | None = None
    name__icontains: str | None = None


@router.get("/", response={200: list[PlaylistSchemaOut], 500: ErrorSchema})
def get_playlists(
    request,
    limit: int | None = None,
    offset: int = 0,
    order_by: str | None = None,
    filters: GetPlaylistsFilter = Query(...),  # noqa: B008
):
    try:
        user = token_is_valid(request, return_user=True).user
        playlists = filters.filter(Playlist.objects.all())
        for playlist in playlists:
            if not playlist.is_public:
                if user is None:
                    playlists = playlists.exclude(id=playlist.id)
                    continue
                if user.id != playlist.object_id:
                    playlists = playlists.exclude(id=playlist.id)
        if order_by:
            playlists = playlists.order_by(*order_by.split(","))
        return 200, playlists[offset : offset + limit] if limit else playlists[offset:]
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get(
    "/{id}",
    response={
        200: PlaylistSchemaOut,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
    },
)
def get_playlist(request, id: uuid.UUID):
    try:
        user = token_is_valid(request, return_user=True).user
        playlist = Playlist.objects.get(id=id)
        if not playlist.is_public:
            if user is None:
                raise ApiProcessError(
                    401,
                    "Unauthorized",
                    "You are not logged in!",
                )
            if user.id != playlist.object_id:
                raise ApiProcessError(
                    401,
                    "Unauthorized",
                    "You are not allowed to access this playlist!",
                )
    except Playlist.DoesNotExist:
        return api_error(404, "Playlist not found", "Playlist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 200, playlist


@router.post(
    "/",
    response={
        201: PlaylistSchemaOut,
        400: ErrorSchema,
        401: ErrorSchema,
        500: ErrorSchema,
    },
)
def create_playlist(request, playlist: PlaylistSchemaIn, image: UploadedFile = None):
    try:
        is_authenticated = token_is_valid(request, return_user=True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{is_authenticated.message}",
            )
        payload_dict = playlist.dict()
        musics = payload_dict.pop("musics", [])
        payload_dict["object_id"] = is_authenticated.user.id
        owner_type = "artist" if is_authenticated.user.is_artist() else "user"
        payload_dict["content_type"] = ContentType.objects.get(
            app_label=f"{owner_type}s",
            model=owner_type,
        )
        playlist = Playlist.objects.create(
            **payload_dict,
            image=image,
        )
        for i, music in enumerate(musics, 1):
            MusicOrder.objects.create(playlist=playlist, order=i, music_id=music)
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 201, playlist


@router.patch(
    "/{id}",
    response={
        200: PlaylistSchemaOut,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
    },
)
def update_playlist(
    request,
    id: uuid.UUID,
    playlist: PlaylistSchemaUpdateIn = None,
    image: UploadedFile = None,
):
    try:
        is_authenticated = token_is_valid(request, return_user=True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{is_authenticated.message}",
            )
        playlist_dict = playlist.dict(exclude_unset=True) if playlist else {}
        if playlist_dict == {} and image is None:
            raise ApiProcessError(400, "Bad request", "Data not provided")
        playlist = Playlist.objects.get(id=id)
        if playlist.object_id != is_authenticated.user.id:
            raise ApiProcessError(
                403,
                "Forbidden",
                "You are not the owner of this playlist",
            )
        update_image = playlist_dict.pop("update_image", False)
        for key, value in playlist_dict.items():
            setattr(playlist, key, value)
        if update_image:
            playlist.image = image
        playlist.save()
    except Playlist.DoesNotExist:
        return api_error(404, "Playlist not found", "Playlist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 200, playlist


@router.delete(
    "/{id}",
    response={
        204: None,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
    },
)
def delete_playlist(request, id: uuid.UUID):
    try:
        is_authenticated = token_is_valid(request, return_user=True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{is_authenticated.message}",
            )
        playlist = Playlist.objects.get(id=id)
        if playlist.object_id != is_authenticated.user.id:
            raise ApiProcessError(
                403,
                "Forbidden",
                "You are not the owner of this playlist",
            )
        playlist.delete()
    except Playlist.DoesNotExist:
        return api_error(404, "Playlist not found", "Playlist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 204, None


@router.patch(
    "/{id}/add_musics",
    response={
        200: PlaylistSchemaOut,
        400: ErrorSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
    },
)
def add_musics_to_playlist(request, id: uuid.UUID, musics: list[uuid.UUID]):
    try:
        is_authenticated = token_is_valid(request, return_user=True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{is_authenticated.message}",
            )
        playlist = Playlist.objects.get(id=id)
        if playlist.object_id != is_authenticated.user.id:
            raise ApiProcessError(
                403,
                "Forbidden",
                "You are not the owner of this playlist",
            )
        order = playlist.get_musics_order().count() + 1
        for i, music in enumerate(musics, order):
            if _ := Music.objects.filter(id=music).first():
                MusicOrder.objects.create(
                    playlist=playlist,
                    order=i,
                    music_id=music,
                    added_at=datetime.now(tz=UTC),
                )
            else:
                raise ApiProcessError(400, "Music not found", "Music not found")
        playlist.save()
    except Playlist.DoesNotExist:
        return api_error(404, "Playlist not found", "Playlist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 200, playlist


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
def remove_musics_from_playlist(  # noqa: C901
    request,
    id: uuid.UUID,
    musics: list[uuid.UUID] | list[int],
):
    try:
        is_authenticated = token_is_valid(request, return_user=True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{is_authenticated.message}",
            )
        playlist = Playlist.objects.get(id=id)
        if playlist.object_id != is_authenticated.user.id:
            raise ApiProcessError(
                403,
                "Forbidden",
                "You are not the owner of this playlist",
            )
        music_orders = MusicOrder.objects.filter(playlist=playlist)
        if not music_orders.exists() or music_orders.count() == 0:
            raise ApiProcessError(400, "Bad request", "Playlist is empty")
        music_deleted = False
        for music_order in music_orders:
            if music_order.music_id in musics or music_order.id in musics:
                music_order.delete()
                music_deleted = True
            elif music_deleted:
                music_order.order -= 1
                music_order.save()
    except Playlist.DoesNotExist:
        return api_error(404, "Playlist not found", "Playlist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 200, playlist
