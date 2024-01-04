from ninja import Router

from backend.musics.models import Music
from backend.utils.schemas import ErrorSchema
from config.api.auth import token_is_valid
from config.api.utils import ApiProcessError, api_error

from ..models import MusicContext
from ..schemas import MusicContextSchemaIn, MusicContextSchemaOut

router = Router()


@router.get("/", response={200: MusicContextSchemaOut, 401: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema})
def get_music_context(request):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        music_context = MusicContext.objects.get(object_id=is_authenticated.user.id)
        return 200, music_context
    except MusicContext.DoesNotExist:
        return api_error(404, "Music context not found", "Music context not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.patch(
    "/", response={200: MusicContextSchemaOut, 401: ErrorSchema, 403: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema}
)
def update_music_context(request, payload: MusicContextSchemaIn):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        payload_dict = payload.dict()
        music_context = MusicContext.objects.filter(object_id=is_authenticated.user.id)
        if music_context.exists():
            music_context = music_context.first()
        else:
            music_context = MusicContext.objects.create(object_id=is_authenticated.user.id)
        if music_context.object_id != is_authenticated.user.id:
            raise ApiProcessError(403, "Forbidden", "You are not the owner of this music context")
        fields_to_update = payload_dict.pop("fields_to_update", None)
        musics_ids = payload_dict.pop("musics_ids", [])
        update_musics = fields_to_update["musics_ids"] if fields_to_update else True
        if update_musics:
            music_context.musics.clear()
        for music_id in musics_ids if update_musics else []:
            music = Music.objects.filter(id=music_id)
            music = music.first() if music.exists() else None
            if music:
                music_context.musics.add(music)
        for key, value in payload_dict.items():
            update = fields_to_update[key] if fields_to_update else True
            if update:
                setattr(music_context, key, value)
        music_context.save()
        return 200, music_context
    except MusicContext.DoesNotExist:
        return api_error(404, "Music context not found", "Music context not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
