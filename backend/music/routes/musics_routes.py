from uuid import UUID
from ninja import Router, Schema, UploadedFile
from ..models import Music, Artist
from django.shortcuts import get_object_or_404
from ..error import exception_message_handler
from typing import List, Dict
from ..formatter import artist_query_formatter, music_query_formatter

router = Router()


@router.get("/musics")
def get_musics(
    request,
    id: str = None,
    title: str = None,
    artist: str = None,
    participants: str = None,
    orderBy: str = None,
    limit: int = None,
):
    try:
        musics = Music.objects.all()

        if orderBy is not None:
            orderBy = list(orderBy.split("."))
            column = orderBy[0]
            order = orderBy[1] if len(orderBy) == 2 else "desc"

            if column not in ["title", "artist"]:
                raise ValueError("Fields that can be sorted are 'title' and 'artist'")

            if column == "artist":
                column = "artist"

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

        if artist is not None:
            artists = list(artist.rsplit(","))
            artist_musics = [musics.filter(artist__name__icontains=i) for i in artists]
            musics = artist_musics[0]

        if participants is not None:
            participants = list(participants.rsplit(","))
            participants_musics = [
                musics.filter(participants__name__icontains=i) for i in participants
            ]
            musics = participants_musics[0]

        if limit is not None:
            musics = musics[:limit]

        return [music_query_formatter(i) for i in musics]
    except Exception as e:
        return exception_message_handler(e.args)


@router.get("/music/{str:music_id}")
def get_music(request, music_id: UUID):
    music = Music.objects.filter(pk=music_id)
    if not music.exists():
        return {}

    music = music.first()
    return music_query_formatter(music)


class MusicCreateRequest(Schema):
    title: str
    artist: str
    letters: str = ""
    participants: List[Dict] = []


@router.post("/music")
def create_music(
    request, music: MusicCreateRequest, cover: UploadedFile, audio: UploadedFile
):
    try:
        if not cover.content_type.startswith("image/"):
            raise ValueError("Cover must be an image.")
        if not audio.content_type.startswith("audio/"):
            raise ValueError("The audio must be an audio file.")

        m = music.dict()
        if m["participants"] != [] and len(m["participants"]) != 0:
            for i in m["participants"]:
                if "name" not in i:
                    raise ValueError("Participants must have a name!")
            participants = [
                Artist.objects.filter(name=i["name"]) for i in m["participants"]
            ]
            if not participants[0].exists():
                raise ValueError("The participants do not exist or are invalid!")

            participants = [artist_query_formatter(i[0]) for i in participants]

        if m["title"].strip() == "":
            raise ValueError("Title cannot be empty!")

        if "artist" not in m and m["artist"].strip() == "":
            raise ValueError("Artist cannot be null!")

        artist = Artist.objects.filter(name=m["artist"])
        if not artist.exists():
            raise ValueError("The artists do not exist or are invalid!")
        artist = artist_query_formatter(artist[0])

        musics = Music.objects.filter(title=m["title"]).filter(artist__id=artist["id"])
        if musics.exists():
            raise ValueError("There is already this song!")

        letters = m["letters"].strip() if m["letters"].strip() != "" else ""

        music = Music(
            title=m["title"].strip(),
            artist_id=artist["id"],
            cover=cover,
            audio=audio,
            letters=letters,
        )
        music.save()

        if m["participants"] != [] and len(m["participants"]) != 0:
            for i in participants:
                music.participants.add(i["id"])
            music.save()

        return music_query_formatter(music)
    except Exception as e:
        return exception_message_handler(e.args)


class MusicUpdateRequest(Schema):
    title: str
    letters: str = ""


@router.patch("/music/{str:music_id}")
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
        if m is not None and m["letters"].strip() != "":
            is_changed = True
            music.letters = m["letters"].strip()
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

        return music_query_formatter(music)
    except Exception as e:
        return exception_message_handler(e.args)


class MusicUpdateParticipantsRequest(Schema):
    participants: List[Dict]


@router.patch("/music/{str:music_id}/participants")
def update_music_participants(
    request, music_id: UUID, participants: MusicUpdateParticipantsRequest
):
    try:
        music = get_object_or_404(Music, pk=music_id)
        music_artist = music.artist

        p = participants.dict()
        for i in p["participants"]:
            if "name" not in i:
                raise ValueError("Participants must have a name!")

        participants = [
            get_object_or_404(Artist, name=i["name"]) for i in p["participants"]
        ]
        if not participants[0]:
            raise ValueError("The participants do not exist or are invalid!")

        participants = [artist_query_formatter(i) for i in participants]

        for participant in participants:
            if music_artist.name != participant["name"]:
                p = music.participants.filter(name=participant["name"])
                if p.exists():
                    music.participants.remove(p.first())
                else:
                    music.participants.add(participant["id"])

        return music_query_formatter(music)
    except Exception as e:
        return exception_message_handler(e.args)


@router.delete("/music/{str:music_id}")
def delete_music(request, music_id: UUID):
    try:
        music = Music.objects.get(pk=music_id)
        music.delete()

        return {"title": music.title}
    except Exception as e:
        return exception_message_handler(e.args)
