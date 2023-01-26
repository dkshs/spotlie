from uuid import UUID
from ninja import Router, Schema, UploadedFile
from .models import Music, Singer
from decouple import config
from django.shortcuts import get_list_or_404, get_object_or_404
from django.http import JsonResponse
from django.http.response import HttpResponse
from typing import List, Dict

router = Router()


class HttpResponseError(HttpResponse):
    status_code = 500

    def __init__(self, content=b"", status_code=500, *args, **kwargs):
        self.status_code = status_code
        super().__init__(*args, **kwargs)
        self.content = content


def exception_handler(status_code=500, message=None, full_message=None):
    return HttpResponseError(
        JsonResponse(
            {
                "Error": {
                    "status": status_code,
                    "message": message,
                    "full_message": full_message,
                }
            }
        ),
        status_code=status_code,
    )


@router.get("/musics", tags=["musics"])
def get_musics(
    request, id: str = None, title: str = None, singers: str = None, orderBy: str = None
):
    urlCompleted = config("DOMAIN", default="http://127.0.0.1:8000", cast=str)
    musics = Music.objects.all()

    if orderBy is not None and (
        orderBy.startswith("title") or orderBy.startswith("singers")
    ):
        orderBy = list(orderBy.split("."))
        column = orderBy[0]
        order = orderBy[1] if len(orderBy) == 2 else "desc"

        if column.startswith("singers"):
            column = "singers__name"

        try:
            if order.startswith("asc"):
                musics = musics.order_by(column)
            else:
                musics = musics.order_by(f"-{column}")
        except Exception as e:
            return exception_handler(
                status_code=400,
                message="Invalid query!",
                full_message="Fields that can be sorted are 'title' and 'singers'",
            )

    if id is not None:
        list_id = id.rsplit(",")
        try:
            musics = [musics.get(id=id) for id in list_id]
        except Exception as e:
            return exception_handler(
                status_code=400,
                message="Invalid ID or invalid query!",
                full_message=e.args,
            )

    if title is not None:
        titles = title.rsplit(",")
        try:
            musics = [musics.get(title__icontains=title) for title in titles]
        except Exception as e:
            return exception_handler(
                status_code=400,
                message="Invalid title or invalid query!",
                full_message=e.args,
            )

    if singers is not None:
        singers = list(singers.rsplit(","))
        singers_musics = [
            get_list_or_404(musics, singers__name__icontains=i) for i in singers
        ]
        musics = singers_musics[0]

    return [
        {
            "id": i.id,
            "title": i.title,
            "singers": [
                {"id": singer.id, "name": singer.name} for singer in i.singers.all()
            ],
            "cover": f"{urlCompleted}{i.cover.url}",
            "audio": f"{urlCompleted}{i.audio.url}",
        }
        for i in musics
    ]


@router.get("/music/{str:music_id}", tags=["musics"])
def get_music(request, music_id: UUID):
    urlCompleted = config("DOMAIN", default="http://127.0.0.1:8000", cast=str)
    music = get_object_or_404(Music, id=music_id)

    return {
        "id": music.id,
        "title": music.title,
        "singers": [
            {"id": singer.id, "name": singer.name} for singer in music.singers.all()
        ],
        "cover": f"{urlCompleted}{music.cover.url}",
        "audio": f"{urlCompleted}{music.audio.url}",
    }


class MusicCreateRequest(Schema):
    title: str
    singers: List[Dict] = []


@router.post("/music", tags=["musics"])
def create_music(
    request, music: MusicCreateRequest, cover: UploadedFile, audio: UploadedFile
):
    urlCompleted = config("DOMAIN", default="http://127.0.0.1:8000", cast=str)

    try:
        if not cover.content_type.startswith("image/"):
            raise ValueError("Cover must be an image.")
        if not audio.content_type.startswith("audio/"):
            raise ValueError("The audio must be an audio file.")

        m = music.dict()
        if m["singers"] == [] and len(m["singers"]) == 0:
            raise ValueError("Singers cannot be null!")
        for i in m["singers"]:
            if "name" not in i:
                raise ValueError("Singers must have a name!")

        singers = [Singer.objects.filter(name=i["name"]) for i in m["singers"]]
        if not singers[0]:
            raise ValueError("The singers do not exist or are invalid!")

        singers = [{"id": i[0].id, "name": i[0].name} for i in singers]
        musics = Music.objects.filter(title=m["title"]).filter(
            singers__in=[i["id"] for i in singers]
        )
        if musics.exists():
            raise ValueError("There is already this song!")

        music = Music(title=m["title"], cover=cover, audio=audio)
        music.save()

        for i in singers:
            music.singers.add(i["id"])
        music.save()

        return {
            "title": music.title,
            "singers": singers,
            "cover": f"{urlCompleted}{music.cover.url}",
            "audio": f"{urlCompleted}{music.audio.url}",
        }
    except Exception as e:
        message = "There was an internal error!"
        status = 400
        if e.args[0] == "Singers cannot be null!":
            message = "Singers cannot be null!"
        if e.args[0] == "Singers must have a name!":
            message = "Singers must have a name!"
        if e.args[0] == "There is already this song!":
            message = "There is already this song!"
        if e.args[0] == "The singers do not exist or are invalid!":
            message = "The singers do not exist or are invalid!"
        if e.args[0] == "Cover must be an image.":
            message = "Cover must be an image."
        if e.args[0] == "The audio must be an audio file.":
            message = "The audio must be an audio file."

        return exception_handler(
            status_code=status, message=message, full_message=e.args
        )


class MusicUpdateRequest(Schema):
    title: str


@router.patch("/music/{str:music_id}", tags=["musics"])
def update_music(
    request,
    music_id: UUID,
    music: MusicUpdateRequest = None,
    cover: UploadedFile = None,
    audio: UploadedFile = None,
):
    urlCompleted = config("DOMAIN", default="http://127.0.0.1:8000", cast=str)

    try:
        m = music.dict() if music != None else None
        music = Music.objects.get(pk=music_id)
        is_changed = False

        if m is not None and "title" in m and m["title"] != music.title:
            music.title = m["title"]
            is_changed = True
        if cover is not None and cover.content_type.startswith("image/"):
            music.cover = cover
            is_changed = True
        if audio is not None and audio.content_type.startswith("audio/"):
            music.audio = audio
            is_changed = True

        if is_changed:
            music.save()
        else:
            raise ValueError("Fill in one of the fields to update")

        return {
            "id": music.id,
            "title": music.title,
            "singers": [
                {"id": singer.id, "name": singer.name} for singer in music.singers.all()
            ],
            "cover": f"{urlCompleted}{music.cover.url}",
            "audio": f"{urlCompleted}{music.audio.url}",
        }
    except Exception as e:
        message = "There was an internal error!"
        status = 500
        if e.args[0] == "Fill in one of the fields to update":
            message = "Fill in one of the fields to update"
            status = 400
        if e.args[0] == "Music matching query does not exist.":
            status = 404
            message = "There is no music with this ID."

        return exception_handler(
            status_code=status, message=message, full_message=e.args
        )


@router.delete("/music/{str:music_id}", tags=["musics"])
def delete_music(request, music_id: UUID):
    try:
        music = Music.objects.get(pk=music_id)
        singers = [{"id": i.id, "name": i.name} for i in music.singers.all()]
        music.delete()

        return {"title": music.title, "singers": singers}
    except Exception as e:
        message = "Invalid ID!"
        status = 400
        if e.args[0] == "Music matching query does not exist.":
            status = 404
            message = "There is no music with this ID."

        return exception_handler(
            status_code=status, message=message, full_message=e.args
        )


@router.get("/singers", tags=["singers"])
def get_singers(request, id: str = None, name: str = None, orderBy: str = None):
    singers = Singer.objects.all()

    if orderBy is not None and orderBy.startswith("name"):
        orderBy = list(orderBy.split("."))
        column = orderBy[0]
        order = orderBy[1] if len(orderBy) == 2 else "desc"

        try:
            if order.startswith("asc"):
                singers = singers.order_by(column)
            else:
                singers = singers.order_by(f"-{column}")
        except Exception as e:
            return exception_handler(
                status_code=400,
                message="Invalid query!",
                full_message="The field that can be sorted is 'name'",
            )

    if id is not None:
        list_id = id.rsplit(",")
        try:
            singers = [singers.get(id=id) for id in list_id]
        except Exception as e:
            return exception_handler(
                status_code=400,
                message="Invalid ID or invalid query!",
                full_message=e.args,
            )

    if name is not None:
        names = name.rsplit(",")
        try:
            singers = [singers.get(name__icontains=name) for name in names]
        except Exception:
            return exception_handler(
                status_code=400,
                message="Invalid name or invalid query!",
                full_message=e.args,
            )

    return [{"id": singer.id, "name": singer.name} for singer in singers]


@router.get("/singer/{str:singer_id}", tags=["singers"])
def get_singer(request, singer_id: UUID):
    try:
        singer = get_object_or_404(Singer, id=singer_id)
        return {"id": singer.id, "name": singer.name}
    except Exception as e:
        message = "Invalid ID or invalid query!"
        status = 400
        if e.args[0] == "No Singer matches the given query.":
            message = "There is no singer with that id!"
            status = 404
        return exception_handler(
            status_code=status, message=message, full_message=e.args
        )


class SingerRequest(Schema):
    name: str


@router.post("/singer", tags=["singers"])
def create_singer(request, singer: SingerRequest):
    try:
        s = singer.dict()
        singer = Singer(**s)
        singer.save()
        return {"id": singer.id, "name": singer.name}
    except Exception as e:
        message = None
        if e.args[0] == "UNIQUE constraint failed: music_singer.name":
            status = 400
            message = "Existing singer with that name."

        return exception_handler(
            status_code=status, message=message, full_message=e.args
        )


@router.patch("/singer/{str:singer_id}", tags=["singers"])
def update_singer(request, singer_id: UUID, singer: SingerRequest):
    try:
        s = singer.dict()
        singer = Singer.objects.get(pk=singer_id)
        singer.name = s["name"]
        singer.save()

        return {"id": singer.id, "name": singer.name}
    except Exception as e:
        message = "Invalid ID or invalid name!"
        status = 400
        if e.args[0] == "Singer matching query does not exist.":
            status = 404
            message = "There is no singer with this ID."

        if e.args[0] == "UNIQUE constraint failed: music_singer.name":
            message = "This name already exists!"

        return exception_handler(
            status_code=status, message=message, full_message=e.args
        )


@router.delete("/singer/{str:singer_id}", tags=["singers"])
def delete_singer(request, singer_id: UUID):
    try:
        singer = Singer.objects.get(pk=singer_id)
        singer.delete()

        return {"id": singer.id, "name": singer.name}
    except Exception as e:
        message = "Invalid ID!"
        status = 400
        if e.args[0] == "Singer matching query does not exist.":
            status = 404
            message = "There is no singer with this ID."

        return exception_handler(
            status_code=status, message=message, full_message=e.args
        )
