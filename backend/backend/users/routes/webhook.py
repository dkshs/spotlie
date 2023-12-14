from secrets import token_hex

from django.conf import settings
from django.http import HttpRequest
from ninja import Router, Schema
from svix.webhooks import Webhook, WebhookVerificationError

from backend.artists.models import Artist

from ..models import User


class Response(Schema):
    message: str


secret = settings.WEBHOOK_SECRET

router = Router()


@router.post("/webhook", response={200: Response, 400: Response})
def webhook(request: HttpRequest):
    headers = request.headers
    payload = request.body

    try:
        wh = Webhook(secret)
        evt = wh.verify(payload, headers)
    except WebhookVerificationError as e:
        return 400, {"message": f"invalid webhook: {e}"}

    event_type = evt["type"]
    data = evt["data"]
    try:
        external_id = data["id"]
        if event_type in ["user.created", "user.updated"]:
            email = data["email_addresses"][0]["email_address"]
            username = data["username"] if data["username"] else f"user_{token_hex(8)}"
            image = data["profile_image_url"]
            if image == "https://www.gravatar.com/avatar?d=mp":
                image = "https://img.clerk.com/preview.png"
            public_metadata = data["public_metadata"]

            user = User.objects.filter(external_id=external_id)
            artist = Artist.objects.filter(external_id=external_id)
            if artist.exists():
                user.delete() if user.exists() else None
                user = artist
            if user.exists():
                user_f = user.first()
                if (
                    user_f.email == email
                    and user_f.username == username
                    and user_f.image == image
                    and user_f.public_metadata == public_metadata
                ):
                    return 200, {"message": "ok"}
            user.update_or_create(
                external_id=external_id,
                defaults={
                    "email": email,
                    "username": username,
                    "image": image,
                },
            )
            if event_type == "user.created":
                is_artist = public_metadata["is_artist"] if "is_artist" in public_metadata else False
                public_metadata = {"is_artist": is_artist}
            user.first().update_public_metadata(public_metadata)
        elif event_type == "user.deleted":
            user = User.objects.filter(external_id=external_id)
            artist = Artist.objects.filter(external_id=external_id)
            user.delete() if user.exists() else None
            artist.delete() if artist.exists() else None
        else:
            return 400, {"message": f"invalid event type: {event_type}"}
    except Exception as e:
        return 400, {"message": f"Error processing webhook: {e}"}

    return 200, {"message": "ok"}