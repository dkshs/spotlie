from uuid import UUID
from ninja import Router, Schema, UploadedFile
from .models import Music, Singer
from django.shortcuts import get_object_or_404
from .error import exception_message_handler
from typing import List, Dict
from .formatter import format_singer_query, format_music_query

router = Router()


@router.get("/musics", tags=["musics"])
def get_musics(
    request,
    id: str = None,
    title: str = None,
    singers: str = None,
    orderBy: str = None,
    limit: int = None,
):
    try:
        musics = Music.objects.all()

        if orderBy is not None:
            orderBy = list(orderBy.split("."))
            column = orderBy[0]
            order = orderBy[1] if len(orderBy) == 2 else "desc"

            if column not in ["title", "singers"]:
                raise ValueError("Fields that can be sorted are 'title' and 'singers'")

            if column == "singers":
                column = "singers__name"

            musics = (
                musics.order_by(column)
                if order.startswith("asc")
                else musics.order_by(f"-{column}")
            )

        if id is not None:
            list_id = id.rsplit(",")
            musics = [musics.filter(pk=id) for id in list_id]
            musics = [i[0] if i.exists() else None for i in musics]
            if None in musics:
                return []

        if title is not None:
            titles = title.rsplit(",")
            musics = [musics.filter(title__icontains=title) for title in titles]
            musics = [i[0] if i.exists() else None for i in musics]
            if None in musics:
                return []

        if singers is not None:
            singers = list(singers.rsplit(","))
            singers_musics = [
                musics.filter(singers__name__icontains=i) for i in singers
            ]
            musics = singers_musics[0]

        if limit is not None:
            musics = musics[:limit]

        return [format_music_query(i) for i in musics]
    except Exception as e:
        return exception_message_handler(e.args)


@router.get("/music/{str:music_id}", tags=["musics"])
def get_music(request, music_id: UUID):
    music = Music.objects.filter(pk=music_id)
    if not music.exists():
        return {}

    music = music.first()
    return format_music_query(music)


class MusicCreateRequest(Schema):
    title: str
    singers: List[Dict] = []


@router.post("/music", tags=["musics"])
def create_music(
    request, music: MusicCreateRequest, cover: UploadedFile, audio: UploadedFile
):
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

        singers = [format_singer_query(i[0]) for i in singers]
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

        return format_music_query(music)
    except Exception as e:
        return exception_message_handler(e.args)


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
    try:
        m = music.dict() if music != None else None
        music = Music.objects.get(pk=music_id)
        is_changed = False

        if (
            m is not None
            and "title" in m
            and m["title"] != music.title
            and m["title"].strip() != ""
        ):
            music.title = m["title"].strip()
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
            raise ValueError("Fill in one of the fields to update.")

        return format_music_query(music)
    except Exception as e:
        return exception_message_handler(e.args)


class MusicUpdateSingersRequest(Schema):
    singers: List[Dict]


@router.patch("/music/{str:music_id}/singers", tags=["musics"])
def update_music_singers(request, music_id: UUID, singers: MusicUpdateSingersRequest):
    try:
        music = get_object_or_404(Music, pk=music_id)

        s = singers.dict()
        for i in s["singers"]:
            if "name" not in i:
                raise ValueError("Singers must have a name!")

        singers = [get_object_or_404(Singer, name=i["name"]) for i in s["singers"]]
        if not singers[0]:
            raise ValueError("The singers do not exist or are invalid!")

        singers = [format_singer_query(i) for i in singers]
        musics = (
            Music.objects.filter(title=music.title)
            .filter(singers__in=[i["id"] for i in singers])
            .exclude(title=music.title)
        )
        if musics.exists():
            raise ValueError(
                "There is already a song with that title and those singers!"
            )

        for singer in singers:
            s = music.singers.filter(name=singer["name"])
            singers_len = len(music.singers.all())
            if s.exists():
                if singers_len > 1:
                    music.singers.remove(s.first())
            else:
                music.singers.add(singer["id"])

        return format_music_query(music)
    except Exception as e:
        return exception_message_handler(e.args)


@router.delete("/music/{str:music_id}", tags=["musics"])
def delete_music(request, music_id: UUID):
    try:
        music = Music.objects.get(pk=music_id)
        singers = [format_singer_query(i) for i in music.singers.all()]
        music.delete()

        return {"title": music.title, "singers": singers}
    except Exception as e:
        return exception_message_handler(e.args)


@router.get("/singers", tags=["singers"])
def get_singers(
    request, id: str = None, name: str = None, orderBy: str = None, limit: int = None
):
    try:
        singers = Singer.objects.all()

        if orderBy is not None:
            orderBy = list(orderBy.split("."))
            column = orderBy[0]

            if column != "name":
                raise ValueError("The field that can be filtered is 'name'.")

            order = orderBy[1] if len(orderBy) == 2 else "desc"
            singers = (
                singers.order_by(column)
                if order.startswith("asc")
                else singers.order_by(f"-{column}")
            )

        if id is not None:
            list_id = id.rsplit(",")
            singers = [singers.filter(pk=id) for id in list_id]
            singers = [i[0] if i.exists() else None for i in singers]
            if None in singers:
                return []

        if name is not None:
            names = name.rsplit(",")
            singers = [Singer.objects.filter(name__icontains=name) for name in names]
            singers = [i[0] if i.exists() else None for i in singers]
            if None in singers:
                return []

        if limit is not None:
            singers = singers[:limit]

        return [format_singer_query(singer) for singer in singers]
    except Exception as e:
        return exception_message_handler(e.args)


@router.get("/singer/{str:singer_id}", tags=["singers"])
def get_singer(request, singer_id: UUID):
    try:
        singer = Singer.objects.filter(pk=singer_id)
        if not singer.exists():
            return {}

        singer = singer.first()
        return format_singer_query(singer)
    except Exception as e:
        return exception_message_handler(e.args)


class SingerRequest(Schema):
    name: str


@router.post("/singer", tags=["singers"])
def create_singer(request, singer: SingerRequest, image: UploadedFile = None):
    try:
        s = singer.dict()
        singer = Singer(**s, image=image)
        singer.save()

        return format_singer_query(singer)
    except Exception as e:
        return exception_message_handler(e.args)


@router.patch("/singer/{str:singer_id}", tags=["singers"])
def update_singer(
    request, singer_id: UUID, singer: SingerRequest = None, image: UploadedFile = None
):
    try:
        s = singer.dict() if singer != None else None
        singer = Singer.objects.get(pk=singer_id)
        is_changed = False

        if s != None and "name" in s:
            singer.name = s["name"]
            is_changed = True

        if image != None and image.content_type.startswith("image/"):
            singer.image = image
            is_changed = True

        if is_changed:
            singer.save()
        else:
            raise ValueError("Fill in one of the fields to update.")

        return format_singer_query(singer)
    except Exception as e:
        return exception_message_handler(e.args)


@router.delete("/singer/{str:singer_id}", tags=["singers"])
def delete_singer(request, singer_id: UUID):
    try:
        singer = Singer.objects.get(pk=singer_id)
        singer.delete()

        return {"name": singer.name}
    except Exception as e:
        return exception_message_handler(e.args)
