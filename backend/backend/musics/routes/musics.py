import uuid

from ninja import FilterSchema, Query, Router, UploadedFile

from backend.utils.schemas import ErrorSchema
from config.api.auth import token_is_valid
from config.api.utils import ApiProcessError, api_error

from ..models import Music
from ..schemas import MusicSchemaIn, MusicSchemaOut, MusicSchemaUpdateIn

router = Router()


class MusicFilterSchema(FilterSchema):
    artist_id: uuid.UUID | None = None


@router.get("/", response={200: list[MusicSchemaOut], 500: ErrorSchema})
def get_musics(
    request, limit: int = None, offset: int = 0, orderBy: str = None, filters: MusicFilterSchema = Query(...)
):
    try:
        musics = filters.filter(Music.objects.all())
        if orderBy:
            musics = musics.order_by(*orderBy.split(","))
        return 200, musics[offset : offset + limit] if limit else musics[offset:]  # noqa: E203
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get("/{id}", response={200: MusicSchemaOut, 404: ErrorSchema, 500: ErrorSchema})
def get_music(request, id: uuid.UUID):
    try:
        return 200, Music.objects.get(id=id)
    except Music.DoesNotExist:
        return api_error(404, "Music not found", "Music not found")
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.post("/", response={201: MusicSchemaOut, 400: ErrorSchema, 401: ErrorSchema})
def create_music(request, music: MusicSchemaIn, audio: UploadedFile, image: UploadedFile = None):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        payload_dict = music.dict()
        payload_dict["artist_id"] = is_authenticated.user.id
        music = Music.objects.create(
            **payload_dict,
            audio=audio,
            image=image,
        )
        return 201, music
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.patch(
    "/{id}", response={200: MusicSchemaOut, 400: ErrorSchema, 401: ErrorSchema, 403: ErrorSchema, 404: ErrorSchema}
)
def update_music(
    request, id: uuid.UUID, music: MusicSchemaUpdateIn = None, audio: UploadedFile = None, image: UploadedFile = None
):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        music_dict = music.dict(exclude_unset=True) if music else {}
        if music_dict == {} and audio is None and image is None:
            raise ApiProcessError(400, "Bad request", "Data not provided")
        music = Music.objects.get(id=id)
        music_dict["artist_id"] = is_authenticated.user.id
        if music.artist_id != music_dict["artist_id"]:
            raise ApiProcessError(403, "Forbidden", "You are not the owner of this music")
        update_image = music_dict.pop("update_image", False)
        for key, value in music_dict.items():
            setattr(music, key, value)
        if audio:
            music.audio = audio
        if update_image:
            music.image = image
        music.save()
        return 200, music
    except Music.DoesNotExist:
        return api_error(404, "Music not found", "Music not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.delete("/{id}", response={204: None, 401: ErrorSchema, 403: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema})
def delete_music(request, id: uuid.UUID):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        music = Music.objects.get(id=id)
        if music.artist_id != is_authenticated.user.id:
            raise ApiProcessError(403, "Forbidden", "You are not the owner of this music")
        music.delete()
        return 204, None
    except Music.DoesNotExist:
        return api_error(404, "Music not found", "Music not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
