from uuid import UUID
from ninja import Router, Schema, UploadedFile
from ..models import Artist
from ..error import exception_message_handler
from ..formatter import artist_query_formatter

router = Router()


@router.get("/artists", tags=["artists"])
def get_artists(
    request, id: str = None, name: str = None, orderBy: str = None, limit: int = None
):
    try:
        artists = Artist.objects.all()

        if orderBy is not None:
            orderBy = list(orderBy.split("."))
            column = orderBy[0]

            if column != "name":
                raise ValueError("The field that can be filtered is 'name'.")

            order = orderBy[1] if len(orderBy) == 2 else "desc"
            artists = (
                artists.order_by(column)
                if order.startswith("asc")
                else artists.order_by(f"-{column}")
            )

        if id is not None:
            list_id = id.rsplit(",")
            artists = [artists.filter(pk=id) for id in list_id]
            artists = [i[0] if i.exists() else None for i in artists]
            if None in artists:
                return []

        if name is not None:
            names = name.rsplit(",")
            artists = [Artist.objects.filter(name__icontains=name) for name in names]
            artists = [i[0] if i.exists() else None for i in artists]
            if None in artists:
                return []

        if limit is not None:
            artists = artists[:limit]

        return [artist_query_formatter(artist) for artist in artists]
    except Exception as e:
        return exception_message_handler(e.args)


@router.get("/artist/{str:artist_id}", tags=["artists"])
def get_artist(request, artist_id: UUID):
    try:
        artist = Artist.objects.filter(pk=artist_id)
        if not artist.exists():
            return {}

        artist = artist.first()
        return artist_query_formatter(artist)
    except Exception as e:
        return exception_message_handler(e.args)


class ArtistRequest(Schema):
    name: str


@router.post("/artist", tags=["artists"])
def create_artist(request, artist: ArtistRequest, image: UploadedFile = None):
    try:
        a = artist.dict()
        artist = Artist(**a, image=image)
        artist.save()

        return artist_query_formatter(artist)
    except Exception as e:
        return exception_message_handler(e.args)


@router.patch("/artist/{str:artist_id}", tags=["artists"])
def update_artist(
    request, artist_id: UUID, artist: ArtistRequest = None, image: UploadedFile = None
):
    try:
        a = artist.dict() if artist != None else None
        artist = Artist.objects.get(pk=artist_id)
        is_changed = False

        if a != None and "name" in a:
            artist.name = a["name"]
            is_changed = True

        if image != None:
            if not image.content_type.startswith("image/"):
                raise ValueError("Image must be an image.")
            artist.image = image
            is_changed = True

        if is_changed:
            artist.save()
        else:
            raise ValueError("Fill in one of the fields to update.")

        return artist_query_formatter(artist)
    except Exception as e:
        return exception_message_handler(e.args)


@router.delete("/artist/{str:artist_id}", tags=["artists"])
def delete_artist(request, artist_id: UUID):
    try:
        artist = Artist.objects.get(pk=artist_id)
        artist.delete()

        return {"name": artist.name}
    except Exception as e:
        return exception_message_handler(e.args)
