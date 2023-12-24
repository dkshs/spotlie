import uuid

from django.contrib.contenttypes.models import ContentType
from django.forms.models import model_to_dict
from ninja import Router, UploadedFile

from backend.users.models import User
from backend.utils.schemas import ErrorSchema
from config.api.auth import token_is_valid
from config.api.utils import ApiProcessError, api_error

from ..models import Artist
from ..schemas import ArtistSchemaOut, ArtistSchemaUpdateIn

router = Router()


@router.get("/", response={200: list[ArtistSchemaOut], 500: ErrorSchema})
def get_artists(request, limit: int = None, offset: int = 0, orderBy: str = None):
    try:
        artists = Artist.objects.all()
        if orderBy:
            artists = artists.order_by(*orderBy.split(","))
        return 200, artists[offset : offset + limit] if limit else artists[offset:]  # noqa: E203
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get("/{id}", response={200: ArtistSchemaOut, 404: ErrorSchema, 500: ErrorSchema})
def get_artist(request, id: uuid.UUID):
    try:
        return 200, Artist.objects.get(id=id)
    except Artist.DoesNotExist:
        return api_error(404, "Artist not found", "Artist not found")
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get("/turn_into_artist/", response={201: ArtistSchemaOut, 400: ErrorSchema, 401: ErrorSchema})
def create_artist(request):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        user = is_authenticated.user
        user_dict = model_to_dict(user)
        playlists = user.get_playlists()
        artist = Artist.objects.create(
            external_id=user.external_id,
            **user_dict,
        )
        playlists.update(
            content_type=ContentType.objects.get(app_label="artists", model="artist"), object_id=artist.id
        )
        user.delete()
        artist.update_public_metadata({"external_id": str(artist.id), "is_artist": True})
        return 201, artist
    except User.DoesNotExist:
        return api_error(400, "Bad request", "User not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.patch(
    "/{id}",
    response={
        200: ArtistSchemaOut,
        400: ErrorSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
    },
)
def update_artist(request, id: uuid.UUID, artist: ArtistSchemaUpdateIn = None, cover: UploadedFile = None):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        artist_dict = artist.dict(exclude_unset=True) if artist else {}
        if artist_dict == {} and cover is None:
            raise ApiProcessError(400, "Bad request", "Data not provided")
        artist = Artist.objects.get(id=id)
        if artist.id != is_authenticated.user.id:
            raise ApiProcessError(403, "Forbidden", "You are not the owner of this artist")
        for key, value in artist_dict.items():
            setattr(artist, key, value)
        if cover:
            artist.cover = cover
        artist.save()
        return 200, artist
    except Artist.DoesNotExist:
        return api_error(404, "Artist not found", "Artist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.delete("/{id}", response={204: None, 403: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema})
def delete_artist(request, id: uuid.UUID):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(401, "Unauthorized", f"You are not logged in!\n{is_authenticated.message}")
        artist = Artist.objects.get(id=id)
        if artist.id != is_authenticated.user.id:
            raise ApiProcessError(403, "Forbidden", "You are not the owner of this artist")
        artist.delete()
        return 204, None
    except Artist.DoesNotExist:
        return api_error(404, "Artist not found", "Artist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
