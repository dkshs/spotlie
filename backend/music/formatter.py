from decouple import config


URL_COMPLETED = config("BASE_URL", default="http://127.0.0.1:8000", cast=str)


def format_singer_query(query):
    return {
        "id": query.id,
        "name": query.name,
        "image": f"{URL_COMPLETED}{query.image.url}" if query.image else None,
    }


def format_music_query(query):
    return {
        "id": query.id,
        "title": query.title,
        "singers": [format_singer_query(singer) for singer in query.singers.all()],
        "cover": f"{URL_COMPLETED}{query.cover.url}",
        "audio": f"{URL_COMPLETED}{query.audio.url}",
    }
