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
    if exception_arg[0] == "Fields that can be sorted are 'title' and 'singers'":
        message = "Invalid query."
        status = 400
    if exception_arg[0] == "O valor “%(value)s” não é um UUID válido":
        message = "The id query must only have ids of type UUID."
        status = 400
    if exception_arg[0] == "Singers cannot be null!":
        message = "Singers cannot be null!"
        status = 400
    if exception_arg[0] == "Singers must have a name!":
        message = "Singers must have a name!"
        status = 400
    if exception_arg[0] == "There is already this song!":
        message = "There is already this song!"
        status = 400
    if exception_arg[0] in [
        "The singers do not exist or are invalid!",
        "No Singer matches the given query.",
        "Singer matching query does not exist.",
    ]:
        message = "The singers do not exist or are invalid!"
        status = 400
    if exception_arg[0] == "Cover must be an image.":
        message = "Cover must be an image."
        status = 400
    if exception_arg[0] == "The audio must be an audio file.":
        message = "The audio must be an audio file."
        status = 400
    if exception_arg[0] == "Fill in one of the fields to update.":
        message = "Fill in one of the fields to update."
        status = 400
    if exception_arg[0] == "There is already a song with that title and those singers!":
        message = "There is already a song with that title and those singers!"
        status = 400
    if exception_arg[0] == "The field that can be filtered is 'name'.":
        message = "The field that can be filtered is 'name'."
        status = 400
    if exception_arg[0] == "UNIQUE constraint failed: music_singer.name":
        message = "Existing singer with that name."
        status = 400
    if exception_arg[0] == "Singer matching query does not exist.":
        message = "The singers do not exist."
        status = 404

    return exception_handler(
        status_code=status, message=message, full_message=exception_arg
    )
