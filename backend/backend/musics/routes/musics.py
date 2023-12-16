import uuid

from ninja import Router, UploadedFile

from backend.utils.schemas import ErrorSchema
from config.api.auth import InvalidTokenException, token_is_valid

from ..models import Music
from ..schemas import MusicSchemaIn, MusicSchemaOut, MusicSchemaUpdateIn

router = Router()


@router.get("/", response={200: list[MusicSchemaOut], 500: ErrorSchema})
def get_musics(request, limit: int = 10, offset: int = 0, orderBy: str = None):
    try:
        musics = Music.objects.all()
        if orderBy:
            musics = musics.order_by(*orderBy.split(","))
        musics = musics[offset : offset + limit]  # noqa: E203
        return 200, musics
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}


@router.get("/{id}", response={200: MusicSchemaOut, 404: ErrorSchema, 500: ErrorSchema})
def get_music(request, id: uuid.UUID):
    try:
        music = Music.objects.get(id=id)
        return 200, music
    except Music.DoesNotExist:
        return 404, {"status": 404, "message": "Music not found", "full_message": "Music not found"}
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}


@router.post("/", response={201: MusicSchemaOut, 400: ErrorSchema, 401: ErrorSchema})
def create_music(request, music: MusicSchemaIn, audio: UploadedFile, image: UploadedFile = None):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise InvalidTokenException(f"You are not logged in!\n{is_authenticated.message}")
        payload_dict = music.dict()
        payload_dict["artist_id"] = is_authenticated.user.id
        music = Music.objects.create(
            **payload_dict,
            audio=audio,
            image=image,
        )
        return 201, music
    except InvalidTokenException as e:
        return 401, {"status": 401, "message": "Unauthorized", "full_message": str(e)}
    except Exception as e:
        return 400, {"status": 400, "message": "Bad request", "full_message": str(e)}


@router.patch(
    "/{id}", response={200: MusicSchemaOut, 400: ErrorSchema, 401: ErrorSchema, 403: ErrorSchema, 404: ErrorSchema}
)
def update_music(
    request, id: uuid.UUID, music: MusicSchemaUpdateIn = None, audio: UploadedFile = None, image: UploadedFile = None
):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise InvalidTokenException(f"You are not logged in!\n{is_authenticated.message}")
        music_dict = music.dict(exclude_unset=True)
        if music_dict == {} and audio is None and image is None:
            return 400, {"status": 400, "message": "Bad request", "full_message": "Data not provided"}
        music = Music.objects.get(id=id)
        music_dict["artist_id"] = is_authenticated.user.id
        if music.artist_id != music_dict["artist_id"]:
            return 403, {"status": 403, "message": "Forbidden", "full_message": "You are not the owner of this music"}
        for key, value in music_dict.items():
            setattr(music, key, value)
        if audio:
            music.audio = audio
        if image:
            music.image = image
        music.save()
        return 200, music
    except Music.DoesNotExist:
        return 404, {"status": 404, "message": "Music not found", "full_message": "Music not found"}
    except InvalidTokenException as e:
        return 401, {"status": 401, "message": "Unauthorized", "full_message": str(e)}
    except Exception as e:
        return 400, {"status": 400, "message": "Bad request", "full_message": str(e)}


@router.delete("/{id}", response={204: None, 401: ErrorSchema, 403: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema})
def delete_music(request, id: uuid.UUID):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise InvalidTokenException(f"You are not logged in!\n{is_authenticated.message}")
        music = Music.objects.get(id=id)
        if music.artist_id != is_authenticated.user.id:
            return 403, {"status": 403, "message": "Forbidden", "full_message": "You are not the owner of this music"}
        music.delete()
        return 204, None
    except Music.DoesNotExist:
        return 404, {"status": 404, "message": "Music not found", "full_message": "Music not found"}
    except InvalidTokenException as e:
        return 401, {"status": 401, "message": "Unauthorized", "full_message": str(e)}
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}
