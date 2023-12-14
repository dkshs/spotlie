import uuid

from ninja import Router

from backend.utils.schemas import ErrorSchema

from ..models import User
from ..schemas import UserSchemaOut

router = Router()


@router.get("/", response={200: list[UserSchemaOut], 500: ErrorSchema})
def get_users(request, limit: int = 10, offset: int = 0, orderBy: str = None):
    try:
        users = User.objects.all()
        if orderBy:
            users = users.order_by(*orderBy.split(","))
        users = users[offset : offset + limit]  # noqa: E203
        return 200, users
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}


@router.get("/{id}", response={200: UserSchemaOut, 404: ErrorSchema, 500: ErrorSchema})
def get_user(request, id: uuid.UUID):
    try:
        user = User.objects.get(id=id)
        return 200, user
    except User.DoesNotExist:
        return 404, {"status": 404, "message": "User not found", "full_message": "User not found"}
    except Exception as e:
        return 500, {"status": 500, "message": "Internal server error", "full_message": str(e)}
