def users_query_formatter(query):
    return {
        "username": query.username,
        "image": query.image,
    }


def user_query_formatter(query):
    return {
        "id": query.id,
        "username": query.username,
        "image": query.image,
    }
