import uuid

from ninja import Router

from backend.utils.schemas import ErrorSchema
from config.api.utils import api_error

from ..models import User
from ..schemas import UserSchemaOut

router = Router()


@router.get("/", response={200: list[UserSchemaOut], 500: ErrorSchema})
def get_users(request, limit: int = 10, offset: int = 0, orderBy: str = None):
    try:
        users = User.objects.all()
        if orderBy:
            users = users.order_by(*orderBy.split(","))
        return 200, users[offset : offset + limit]  # noqa: E203
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get("/{id}", response={200: UserSchemaOut, 404: ErrorSchema, 500: ErrorSchema})
def get_user(request, id: uuid.UUID):
    try:
        return 200, User.objects.get(id=id)
    except User.DoesNotExist:
        return api_error(404, "User not found", "User not found")
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
