from ninja import Router
from ..models import User
from ..formatter import users_query_formatter, user_query_formatter
from music.error import exception_message_handler

router = Router()


@router.get("/users")
def get_users(
    request,
    username: str = None,
    orderBy: str = None,
    limit: int = None,
):
    try:
        users = User.objects.all()

        if orderBy is not None:
            order = orderBy if orderBy == "asc" else "desc"

            users = (
                users.order_by("username")
                if order.startswith("asc")
                else users.order_by("-username")
            )

        if username is not None:
            usernames = username.rsplit(",")
            users = [
                users.filter(username__icontains=username) for username in usernames
            ]
            users = [user[0] if user.exists() else None for user in users]
            if None in users:
                return []

        if limit is not None:
            users = users[:limit]

        return [users_query_formatter(user) for user in users]
    except Exception as e:
        return exception_message_handler(e.args)


@router.get("/user/{str:user_identifier}")
def get_user(request, user_identifier: str):
    user = User.objects.filter(identifier=user_identifier)
    if not user.exists():
        return {}

    user = user.first()
    return user_query_formatter(user)
