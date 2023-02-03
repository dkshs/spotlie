from decouple import config


URL_COMPLETED = config("BASE_URL", default="http://127.0.0.1:8000", cast=str)


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
