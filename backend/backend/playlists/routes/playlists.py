import uuid

from django.contrib.contenttypes.models import ContentType
from ninja import Router, UploadedFile

from backend.musics.models import Music
from backend.utils.schemas import ErrorSchema

from ..models import Playlist
from ..schemas import PlaylistSchemaIn, PlaylistSchemaOut, PlaylistSchemaUpdateIn

router = Router()


@router.get("/", response={200: list[PlaylistSchemaOut], 500: ErrorSchema})
def get_playlists(request, limit: int = 10, offset: int = 0, orderBy: str = None):
    try:
        playlists = Playlist.objects.all()
        if orderBy:
            playlists = playlists.order_by(*orderBy.split(","))
        playlists = playlists[offset : offset + limit]  # noqa: E203
        return 200, playlists
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}


@router.get("/{id}", response={200: PlaylistSchemaOut, 404: ErrorSchema, 500: ErrorSchema})
def get_playlist(request, id: uuid.UUID):
    try:
        playlist = Playlist.objects.get(id=id)
        return 200, playlist
    except Playlist.DoesNotExist:
        return 404, {"status": 404, "message": "Playlist not found", "full_message": "Playlist not found"}
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}


@router.post("/", response={201: PlaylistSchemaOut, 400: ErrorSchema})
def create_playlist(request, playlist: PlaylistSchemaIn, image: UploadedFile = None):
    try:
        payload_dict = playlist.dict()
        musics = payload_dict.pop("musics", [])
        owner_is_artist = payload_dict.pop("owner_is_artist")
        payload_dict["object_id"] = payload_dict.pop("owner_id")
        owner_type = "artist" if owner_is_artist else "user"
        payload_dict["content_type"] = ContentType.objects.get(app_label=f"{owner_type}s", model=owner_type)
        playlist = Playlist.objects.create(
            **payload_dict,
            image=image,
        )
        for music in musics:
            playlist.musics.add(music)
        return 201, playlist
    except Exception as e:
        return 400, {"status": 400, "message": "Bad request", "full_message": str(e)}


@router.patch("/{id}", response={200: PlaylistSchemaOut, 400: ErrorSchema})
def update_playlist(request, id: uuid.UUID, playlist: PlaylistSchemaUpdateIn = None, image: UploadedFile = None):
    try:
        playlist_dict = playlist.dict(exclude_unset=True)
        if playlist_dict == {} and image is None:
            raise Exception("Data not provided")
        playlist = Playlist.objects.get(id=id)
        for key, value in playlist_dict.items():
            setattr(playlist, key, value)
        if image:
            playlist.image = image
        playlist.save()
        return 200, playlist
    except Playlist.DoesNotExist:
        return 404, {"status": 404, "message": "Playlist not found", "full_message": "Playlist not found"}
    except Exception as e:
        return 400, {"status": 400, "message": "Bad request", "full_message": str(e)}


@router.delete("/{id}", response={204: None, 404: ErrorSchema, 500: ErrorSchema})
def delete_playlist(request, id: uuid.UUID):
    try:
        playlist = Playlist.objects.get(id=id)
        playlist.delete()
        return 204, None
    except Playlist.DoesNotExist:
        return 404, {"status": 404, "message": "Playlist not found", "full_message": "Playlist not found"}
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}


@router.patch("/{id}/add_musics", response={200: PlaylistSchemaOut, 400: ErrorSchema, 404: ErrorSchema})
def add_musics_to_playlist(request, id: uuid.UUID, musics: list[uuid.UUID]):
    try:
        playlist = Playlist.objects.get(id=id)
        for music in musics:
            music_obj = Music.objects.filter(id=music).first()
            if not music_obj:
                raise Exception(f"Music with id {music} not found")
            if music in playlist.musics.all():
                continue
            playlist.musics.add(music)
        playlist.save()
        return 200, playlist
    except Playlist.DoesNotExist:
        return 404, {"status": 404, "message": "Playlist not found", "full_message": "Playlist not found"}
    except Exception as e:
        return 400, {"status": 400, "message": "Bad request", "full_message": str(e)}


@router.patch("/{id}/remove_musics", response={200: PlaylistSchemaOut, 400: ErrorSchema, 404: ErrorSchema})
def remove_musics_from_playlist(request, id: uuid.UUID, musics: list[uuid.UUID]):
    try:
        playlist = Playlist.objects.get(id=id)
        for music in musics:
            playlist.musics.remove(music)
        playlist.save()
        return 200, playlist
    except Playlist.DoesNotExist:
        return 404, {"status": 404, "message": "Playlist not found", "full_message": "Playlist not found"}
    except Exception as e:
        return 400, {"status": 400, "message": "Bad request", "full_message": str(e)}
