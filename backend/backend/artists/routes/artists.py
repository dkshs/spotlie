from ninja import Router, UploadedFile
import uuid
from typing import List
from ..models import Artist
from ..schemas import ArtistSchemaOut, ArtistSchemaIn, ArtistSchemaUpdateIn
from backend.utils.schemas import ErrorSchema

router = Router()


@router.get("/", response={200: List[ArtistSchemaOut], 500: ErrorSchema})
def get_artists(request, limit: int = 10, offset: int = 0, orderBy: str = None):
    try:
        artists = Artist.objects.all()
        if orderBy:
            artists = artists.order_by(*orderBy.split(","))
        return 200, artists[offset : offset + limit]
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}


@router.get("/{id}", response={200: ArtistSchemaOut, 404: ErrorSchema, 500: ErrorSchema})
def get_artist(request, id: uuid.UUID):
    try:
        artist = Artist.objects.get(id=id)
        return artist
    except Artist.DoesNotExist:
        return 404, {"status": 404, "message": "Artist not found", "full_message": "Artist not found"}
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}


@router.post("/", response={201: ArtistSchemaOut, 400: ErrorSchema})
def create_artist(request, artist: ArtistSchemaIn, cover: UploadedFile = None):
    try:
        artist_dict = artist.dict()
        artist = Artist(**artist_dict, cover=cover)
        artist.save()
        return 201, artist
    except Exception as e:
        return 400, {"status": 400, "message": "Bad request", "full_message": str(e)}


@router.patch("/{id}", response={200: ArtistSchemaOut, 400: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema})
def update_artist(request, id: uuid.UUID, artist: ArtistSchemaUpdateIn = None, cover: UploadedFile = None):
    try:
        artist_dict = artist.dict(exclude_unset=True)
        if artist_dict == {} and cover is None:
            return 400, {"status": 400, "message": "Bad request", "full_message": "Data not provided"}
        artist = Artist.objects.get(id=id)
        for key, value in artist_dict.items():
            setattr(artist, key, value)
        if cover:
            artist.cover = cover
        artist.save()
        return 200, artist
    except Artist.DoesNotExist:
        return 404, {"status": 404, "message": "Artist not found", "full_message": "Artist not found"}
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}


@router.delete("/{id}", response={204: None, 404: ErrorSchema, 500: ErrorSchema})
def delete_artist(request, id: uuid.UUID):
    try:
        artist = Artist.objects.get(id=id)
        artist.delete()
        return 204, None
    except Artist.DoesNotExist:
        return 404, {"status": 404, "message": "Artist not found", "full_message": "Artist not found"}
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}
