# ruff: noqa: BLE001
import uuid

from ninja import Router

from backend.users.models import User
from backend.users.schemas import UserSchemaOut
from backend.utils.schemas import ErrorSchema
from config.api.auth import token_is_valid
from config.api.utils import ApiProcessError
from config.api.utils import api_error

router = Router()


@router.get("/", response={200: list[UserSchemaOut], 500: ErrorSchema})
def get_users(
    request,
    limit: int | None = None,
    offset: int = 0,
    order_by: str | None = None,
):
    try:
        users = User.objects.all()
        if order_by:
            users = users.order_by(*order_by.split(","))
        return 200, users[offset : offset + limit] if limit else users[offset:]
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get("/{id}", response={200: UserSchemaOut, 404: ErrorSchema, 500: ErrorSchema})
def get_user(request, id: uuid.UUID):  # noqa: A002
    try:
        return 200, User.objects.get(id=id)
    except User.DoesNotExist:
        return api_error(404, "User not found", "User not found")
    except Exception as e:
        return api_error(500, "Internal server error", str(e))


@router.get("/me/", response={200: UserSchemaOut, 401: ErrorSchema, 500: ErrorSchema})
def get_me(request):
    try:
        is_authenticated = token_is_valid(request, return_user=True)
        if not is_authenticated.is_valid:
            raise ApiProcessError(  # noqa: TRY301
                401,
                "Unauthorized",
                f"You are not logged in!\n{is_authenticated.message}",
            )
    except ApiProcessError as e:
        return api_error(**e.__dict__)
    except Exception as e:
        return api_error(500, "Internal server error", str(e))
    else:
        return 200, is_authenticated.user
