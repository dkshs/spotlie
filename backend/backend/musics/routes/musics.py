# ruff: noqa: BLE001, TRY301, A002
import uuid

from ninja import FilterSchema
from ninja import Query
from ninja import Router
from ninja import UploadedFile

from backend.musics.models import Music
from backend.musics.schemas import MusicSchemaIn
from backend.musics.schemas import MusicSchemaOut
from backend.musics.schemas import MusicSchemaUpdateIn
from backend.utils.schemas import ErrorSchema
from config.api.auth import token_is_valid
from config.api.utils import ApiProcessError
from config.api.utils import api_error

router = Router()


class MusicFilterSchema(FilterSchema):
    artist_id: uuid.UUID | None = None
    liked_by: uuid.UUID | None = None
    liked_artists: uuid.UUID | None = None


@router.get(
    "/",
    response={200: list[MusicSchemaOut], 401: ErrorSchema, 500: ErrorSchema},
)
def get_musics(
    request,
    limit: int | None = None,
    offset: int = 0,
    order_by: str | None = None,
    filters: MusicFilterSchema = Query(...),  # noqa: B008
):
    try:
        token = token_is_valid(request, return_user=True)
        if (filters.liked_artists or filters.liked_by) and not token.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{token.message}",
            )
        musics = filters.filter(Music.objects.all())
        if order_by:
            musics = musics.order_by(*order_by.split(","))
        return 200, musics[offset : offset + limit] if limit else musics[offset:]
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get(
    "/liked",
    response={
        200: list[MusicSchemaOut],
        401: ErrorSchema,
        422: ErrorSchema,
        500: ErrorSchema,
    },
)
def get_liked_musics(request):
    try:
        token = token_is_valid(request, return_user=True)
        if not token.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{token.message}",
            )
        liked_musics = token.user.liked_musics.all()
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 200, liked_musics


@router.get("/{id}", response={200: MusicSchemaOut, 404: ErrorSchema, 500: ErrorSchema})
def get_music(request, id: uuid.UUID):
    try:
        return 200, Music.objects.get(id=id)
    except Music.DoesNotExist:
        return api_error(404, "Music not found", "Music not found")
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get(
    "/{id}/liked",
    response={
        200: MusicSchemaOut,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
    },
)
def get_liked_music(request, id: uuid.UUID):
    try:
        token = token_is_valid(request, return_user=True)
        if not token.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{token.message}",
            )
        music = Music.objects.get(id=id)
        if not token.user.liked_musics.filter(id=music.id).exists():
            raise ApiProcessError(404, "Music not found", "Music not found")
    except Music.DoesNotExist:
        return api_error(404, "Music not found", "Music not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 200, music


@router.post(
    "/{id}/handle_liked_musics",
    response={
        200: MusicSchemaOut,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
    },
)
def handle_liked_musics(request, id: uuid.UUID):
    try:
        token = token_is_valid(request, return_user=True)
        if not token.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{token.message}",
            )
        music = Music.objects.get(id=id)
        user = token.user
        if user.liked_musics.filter(id=music.id).exists():
            user.liked_musics.remove(music)
        else:
            user.liked_musics.add(music)
        user.save()
    except Music.DoesNotExist:
        return api_error(404, "Music not found", "Music not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 200, music


@router.post("/", response={201: MusicSchemaOut, 400: ErrorSchema, 401: ErrorSchema})
def create_music(
    request,
    music: MusicSchemaIn,
    audio: UploadedFile,
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
        payload_dict = music.dict()
        payload_dict["artist_id"] = is_authenticated.user.id
        music = Music.objects.create(
            **payload_dict,
            audio=audio,
            image=image,
        )
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 201, music


@router.patch(
    "/{id}",
    response={
        200: MusicSchemaOut,
        400: ErrorSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
    },
)
def update_music(  # noqa: C901
    request,
    id: uuid.UUID,
    music: MusicSchemaUpdateIn = None,
    audio: UploadedFile = None,
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
        music_dict = music.dict(exclude_unset=True) if music else {}
        if music_dict == {} and audio is None and image is None:
            raise ApiProcessError(400, "Bad request", "Data not provided")
        music = Music.objects.get(id=id)
        music_dict["artist_id"] = is_authenticated.user.id
        if music.artist_id != music_dict["artist_id"]:
            raise ApiProcessError(
                403,
                "Forbidden",
                "You are not the owner of this music",
            )
        update_image = music_dict.pop("update_image", False)
        for key, value in music_dict.items():
            setattr(music, key, value)
        if audio:
            music.audio = audio
        if update_image:
            music.image = image
        music.save()
    except Music.DoesNotExist:
        return api_error(404, "Music not found", "Music not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 200, music


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
def delete_music(request, id: uuid.UUID):
    try:
        is_authenticated = token_is_valid(request, return_user=True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{is_authenticated.message}",
            )
        music = Music.objects.get(id=id)
        if music.artist_id != is_authenticated.user.id:
            raise ApiProcessError(
                403,
                "Forbidden",
                "You are not the owner of this music",
            )
        music.delete()
    except Music.DoesNotExist:
        return api_error(404, "Music not found", "Music not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 204, None
