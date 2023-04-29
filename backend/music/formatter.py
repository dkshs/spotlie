from .models import Artist, Music
from django.conf import settings

URL_COMPLETED = settings.BASE_URL if settings.DEBUG else ""


def artist_query_formatter(artist: Artist):
    return {
        "id": artist.id,
        "name": artist.name,
        "image": f"{URL_COMPLETED}{artist.image.url}" if artist.image else None,
    }


def music_query_formatter(music: Music):
    return {
        "id": music.id,
        "title": music.title,
        "artist": artist_query_formatter(music.artist),
        "participants": [
            artist_query_formatter(singer) for singer in music.participants.all()
        ],
        "letters": music.letters,
        "cover": f"{URL_COMPLETED}{music.cover.url}",
        "audio": f"{URL_COMPLETED}{music.audio.url}",
    }
