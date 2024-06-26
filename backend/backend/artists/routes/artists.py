# ruff: noqa: BLE001, TRY301
import uuid

from django.contrib.contenttypes.models import ContentType
from django.forms.models import model_to_dict
from ninja import Router
from ninja import UploadedFile

from backend.artists.models import Artist
from backend.artists.schemas import ArtistSchemaOut
from backend.artists.schemas import ArtistSchemaUpdateIn
from backend.users.models import User
from backend.utils.schemas import ErrorSchema
from config.api.auth import token_is_valid
from config.api.utils import ApiProcessError
from config.api.utils import api_error

router = Router()


@router.get("/", response={200: list[ArtistSchemaOut], 500: ErrorSchema})
def get_artists(
    request,
    limit: int | None = None,
    offset: int = 0,
    order_by: str | None = None,
):
    try:
        artists = Artist.objects.all()
        if order_by:
            artists = artists.order_by(*order_by.split(","))
        return 200, artists[offset : offset + limit] if limit else artists[offset:]
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get(
    "/{id}",
    response={200: ArtistSchemaOut, 404: ErrorSchema, 500: ErrorSchema},
)
def get_artist(request, id: uuid.UUID):  # noqa: A002
    try:
        return 200, Artist.objects.get(id=id)
    except Artist.DoesNotExist:
        return api_error(404, "Artist not found", "Artist not found")
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get(
    "/turn_into_artist/",
    response={201: ArtistSchemaOut, 400: ErrorSchema, 401: ErrorSchema},
)
def create_artist(request):
    try:
        is_authenticated = token_is_valid(request, return_user=True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{is_authenticated.message}",
            )
        user = is_authenticated.user
        user_dict = model_to_dict(user)
        playlists = user.get_playlists()
        artist = Artist.objects.create(
            external_id=user.external_id,
            **user_dict,
        )
        playlists.update(
            content_type=ContentType.objects.get(app_label="artists", model="artist"),
            object_id=artist.id,
        )
        user.delete()
        artist.update_public_metadata(
            {"external_id": str(artist.id), "is_artist": True},
        )
    except User.DoesNotExist:
        return api_error(400, "Bad request", "User not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 201, artist


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
def update_artist(
    request,
    id: uuid.UUID,  # noqa: A002
    artist: ArtistSchemaUpdateIn = None,
    cover: UploadedFile = None,
):
    try:
        is_authenticated = token_is_valid(request, return_user=True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{is_authenticated.message}",
            )
        artist_dict = artist.dict(exclude_unset=True) if artist else {}
        if artist_dict == {} and cover is None:
            raise ApiProcessError(400, "Bad request", "Data not provided")
        artist = Artist.objects.get(id=id)
        if artist.id != is_authenticated.user.id:
            raise ApiProcessError(
                403,
                "Forbidden",
                "You are not the owner of this artist",
            )
        for key, value in artist_dict.items():
            setattr(artist, key, value)
        if cover:
            artist.cover = cover
        artist.save()
    except Artist.DoesNotExist:
        return api_error(404, "Artist not found", "Artist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 200, artist


@router.delete(
    "/{id}",
    response={204: None, 403: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema},
)
def delete_artist(request, id: uuid.UUID):  # noqa: A002
    try:
        is_authenticated = token_is_valid(request, return_user=True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(
                401,
                "Unauthorized",
                f"You are not logged in!\n{is_authenticated.message}",
            )
        artist = Artist.objects.get(id=id)
        if artist.id != is_authenticated.user.id:
            raise ApiProcessError(
                403,
                "Forbidden",
                "You are not the owner of this artist",
            )
        artist.delete()
    except Artist.DoesNotExist:
        return api_error(404, "Artist not found", "Artist not found")
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 204, None
