from django.http import HttpRequest
from ninja import Router, Schema
from typing import List
from ..models import User
from music.error import exception_message_handler
from secrets import token_hex

router = Router()


class EmailAddresses(Schema):
    email_address: str


class EndpointDataSchema(Schema):
    id: str
    email_addresses: List[EmailAddresses]
    profile_image_url: str
    username: str = None


class EndpointSchema(Schema):
    type: str
    data: EndpointDataSchema


@router.post("/clerk_endpoint")
def clerk_endpoint(request: HttpRequest, evt: EndpointSchema):
    try:
        if evt.type not in ["user.created", "user.updated"]:
            return exception_message_handler(status=400, message="Invalid request")

        identifier = evt.data.id
        email = evt.data.email_addresses[0].email_address
        image = evt.data.profile_image_url
        username = evt.data.username if evt.data.username else f"user_{token_hex(8)}"

        if evt.type == "user.created":
            user = User(
                identifier=identifier, email=email, image=image, username=username
            )
            user.save()
        elif evt.type == "user.updated":
            user = User.objects.filter(identifier=identifier)
            if user.exists():
                user.update(email=email, image=image, username=username)
    except Exception as e:
        return exception_message_handler(e.args)


class EndpointDeletedUserDataSchema(Schema):
    id: str


class EndpointDeletedUserSchema(Schema):
    type: str
    data: EndpointDeletedUserDataSchema


@router.post("/user_deleted_clerk_endpoint")
def user_deleted_clerk_endpoint(request, evt: EndpointDeletedUserSchema):
    try:
        if evt.type != "user.deleted":
            return exception_message_handler(status=400, message="Invalid request")

        identifier = evt.data.id
        user = User.objects.filter(identifier=identifier)

        if user.exists():
            user.delete()

    except Exception as e:
        return exception_message_handler(e.args)
