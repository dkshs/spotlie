from datetime import datetime
from uuid import UUID

from ninja import Schema


class UserSchemaOut(Schema):
    id: UUID
    username: str
    image: str | None
    created_at: datetime
    updated_at: datetime
