from .models import User


def user_query_formatter(user: User):
    return {
        "id": user.id,
        "username": user.username,
        "image": user.image,
    }
