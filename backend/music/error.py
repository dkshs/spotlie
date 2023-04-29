from django.http.response import JsonResponse, HttpResponse


class HttpResponseError(HttpResponse):
    status_code = 500

    def __init__(self, content=b"", status_code=500, *args, **kwargs):
        self.status_code = status_code
        super().__init__(*args, **kwargs)
        self.content = content


def exception_handler(status_code=500, message=None, full_message=None):
    return HttpResponseError(
        JsonResponse(
            {
                "Error": {
                    "status": status_code,
                    "message": message,
                    "full_message": full_message,
                }
            }
        ),
        status_code=status_code,
    )


def exception_message_handler(exception_arg, message: str = None, status: int = 500):
    message = "There was an internal error!" if message is None else message

    if exception_arg[0] in [
        "Music matching query does not exist.",
        "No Music matches the given query.",
    ]:
        message = "The song with this query does not exist!"
        status = 404
    if exception_arg[0] == "Fields that can be sorted are 'title' and 'artist'":
        message = "Invalid query."
        status = 400
    if exception_arg[0] == "O valor “%(value)s” não é um UUID válido":
        message = "The id query must only have ids of type UUID."
        status = 400
    if exception_arg[0] == "Artist cannot be null!":
        message = "Artist cannot be null!"
        status = 400
    if exception_arg[0] == "Participants must have a name!":
        message = "Participants must have a name!"
        status = 400
    if exception_arg[0] == "There is already this song!":
        message = "There is already this song!"
        status = 400
    if exception_arg[0] in [
        "The artists do not exist or are invalid!",
        "No Artist matches the given query.",
        "Artist matching query does not exist.",
    ]:
        message = "The artists do not exist or are invalid!"
        status = 400
    if exception_arg[0] == "The participants do not exist or are invalid!":
        message = "The participants do not exist or are invalid!"
        status = 400
    if exception_arg[0] == "Cover must be an image.":
        message = "Cover must be an image."
        status = 400
    if exception_arg[0] == "Image must be an image.":
        message = "Image must be an image."
        status = 400
    if exception_arg[0] == "The audio must be an audio file.":
        message = "The audio must be an audio file."
        status = 400
    if exception_arg[0] == "Fill in one of the fields to update.":
        message = "Fill in one of the fields to update."
        status = 400
    if exception_arg[0] == "There is already a song with that title and those artist!":
        message = "There is already a song with that title and those artist!"
        status = 400
    if (
        exception_arg[0]
        == "There is already a song with that title and those participants!"
    ):
        message = "There is already a song with that title and those participants!"
        status = 400
    if exception_arg[0] == "The field that can be filtered is 'name'.":
        message = "The field that can be filtered is 'name'."
        status = 400
    if exception_arg[0] == "Title cannot be empty!":
        message = "Title cannot be empty!"
        status = 400
    if exception_arg[0] == "UNIQUE constraint failed: music_artist.name":
        message = "Existing artist with that name."
        status = 400
    if exception_arg[0] == "Artist matching query does not exist.":
        message = "The artists do not exist."
        status = 404
    if exception_arg[0] == "You are not logged in!":
        message = exception_arg[0]
        status = 401

    return exception_handler(
        status_code=status, message=message, full_message=exception_arg
    )
