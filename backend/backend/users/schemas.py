from datetime import datetime
from uuid import UUID

from ninja import Schema


class UserSchemaOut(Schema):
    id: UUID
    first_name: str | None
    last_name: str | None
    full_name: str
    username: str
    image: str | None
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def resolve_full_name(obj):
        return obj.get_full_name()
