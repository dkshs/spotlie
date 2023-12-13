from ninja import Schema


class ErrorSchema(Schema):
    status: int
    message: str
    full_message: str
