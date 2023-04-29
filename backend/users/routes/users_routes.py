from ninja import Router
from ..formatter import user_query_formatter
from backend.api_auth import token_is_valid
from music.error import exception_message_handler

router = Router()


@router.get("/user")
def get_user(request):
    try:
        is_authenticated = token_is_valid(request, True)
        if not is_authenticated.is_valid:
            raise ValueError("You are not logged in!", is_authenticated.message)

        user = is_authenticated.user
        return user_query_formatter(user) if user else {}
    except Exception as e:
        return exception_message_handler(e.args)
