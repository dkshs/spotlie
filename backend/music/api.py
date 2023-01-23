from ninja import Router, Schema
from .models import Music, Singer
from decouple import config
from django.shortcuts import get_list_or_404, get_object_or_404
from django.http import HttpResponseBadRequest, JsonResponse

router = Router()


def exception_handler(message, full_message):
    return HttpResponseBadRequest(
        JsonResponse({"Error": {"message": message, "full_message": full_message}})
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
                message="Consulta inválida!",
                full_message="Os campos que podem ser ordenados são 'title' e 'singers'",
            )

    if id is not None:
        list_id = id.rsplit(",")
        try:
            musics = [musics.get(id=id) for id in list_id]
        except Exception as e:
            return exception_handler(
                message="ID inválido ou consulta inválida!", full_message=e.args
            )

    if title is not None:
        titles = title.rsplit(",")
        try:
            musics = [musics.get(title__icontains=title) for title in titles]
        except Exception:
            return exception_handler(
                message="Titulo inválido ou consulta inválida!", full_message=e.args
            )

    if singers is not None:
        singers = list(singers.rsplit(","))
        singers_musics = [
            get_list_or_404(musics, singers__name__icontains=i) for i in singers
        ]
        musics_list = singers_musics[0]
        musics = musics_list

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
def get_music(request, music_id: str):
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
                message="Consulta inválida!",
                full_message="O campo que pode ser ordenado é 'name'",
            )

    if id is not None:
        list_id = id.rsplit(",")
        try:
            singers = [singers.get(id=id) for id in list_id]
        except Exception as e:
            return exception_handler(
                message="ID inválido ou consulta inválida!", full_message=e.args
            )

    if name is not None:
        names = name.rsplit(",")
        try:
            singers = [singers.get(name__icontains=name) for name in names]
        except Exception:
            return exception_handler(
                message="Nome inválido ou consulta inválida!", full_message=e.args
            )

    return [{"id": singer.id, "name": singer.name} for singer in singers]


@router.get("/singer/{str:singer_id}", tags=["singers"])
def get_singer(request, singer_id: str):
    singer = get_object_or_404(Singer, id=singer_id)

    return {"id": singer.id, "name": singer.name}
