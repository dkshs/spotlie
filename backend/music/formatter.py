from django.conf import settings

URL_COMPLETED = settings.BASE_URL if settings.DEBUG else ""


def artist_query_formatter(query):
    return {
        "id": query.id,
        "name": query.name,
        "image": f"{URL_COMPLETED}{query.image.url}" if query.image else None,
    }


def music_query_formatter(query):
    return {
        "id": query.id,
        "title": query.title,
        "artist": artist_query_formatter(query.artist),
        "participants": [
            artist_query_formatter(singer) for singer in query.participants.all()
        ],
        "letters": query.letters,
        "cover": f"{URL_COMPLETED}{query.cover.url}",
        "audio": f"{URL_COMPLETED}{query.audio.url}",
    }
