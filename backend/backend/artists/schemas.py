from datetime import datetime
from uuid import UUID

from ninja import Schema


class ArtistSchemaOut(Schema):
    id: UUID
    username: str
    about: str | None
    twitter_link: str | None
    instagram_link: str | None
    image: str | None
    cover: str | None
    is_verified: bool
    created_at: datetime
    updated_at: datetime


class ArtistSchemaUpdateIn(Schema):
    about: str = None
    twitter_link: str = None
    instagram_link: str = None
    is_verified: bool = None
