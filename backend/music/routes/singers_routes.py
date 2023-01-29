from uuid import UUID
from ninja import Router, Schema, UploadedFile
from ..models import Singer
from ..error import exception_message_handler
from ..formatter import format_singer_query

router = Router()


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
