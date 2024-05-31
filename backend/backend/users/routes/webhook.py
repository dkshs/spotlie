from secrets import token_hex

from django.conf import settings
from django.http import HttpRequest
from ninja import Router
from ninja import Schema
from svix.webhooks import Webhook
from svix.webhooks import WebhookVerificationError

from backend.artists.models import Artist
from backend.users.models import User


class Response(Schema):
    message: str


secret = settings.WEBHOOK_SECRET

router = Router()


@router.post("/webhook", response={200: Response, 400: Response})
def webhook(request: HttpRequest):  # noqa: C901
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
            first_name = data.get("first_name", "") or ""
            last_name = data.get("last_name", "") or ""
            email = data["email_addresses"][0]["email_address"]
            username = data["username"] or f"user_{token_hex(8)}"
            image = data["profile_image_url"]
            if image == "https://www.gravatar.com/avatar?d=mp":
                image = "https://img.clerk.com/preview.png"
            public_metadata = data["public_metadata"]

            is_artist = public_metadata.get("is_artist", False)
            public_metadata["is_artist"] = is_artist
            if is_artist:
                Artist.objects.update_or_create(
                    external_id=external_id,
                    defaults={"email": email},
                )
            user = User.objects.filter(external_id=external_id)
            artist = Artist.objects.filter(external_id=external_id)
            if artist.exists() and not is_artist:
                public_metadata["is_artist"] = False
                artist.delete()
            elif artist.exists() or is_artist:
                public_metadata["is_artist"] = True
                user.delete() if user.exists() else None
                user = artist
            if user.exists():
                user_f = user.first()
                public_metadata["external_id"] = str(user.first().id)
                if (
                    user_f.first_name == first_name
                    and user_f.last_name == last_name
                    and user_f.email == email
                    and user_f.username == username
                    and user_f.image == image
                    and user_f.public_metadata == public_metadata
                ):
                    return 200, {"message": "ok"}
            user.update_or_create(
                external_id=external_id,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                    "username": username,
                    "image": image,
                },
            )
            public_metadata["external_id"] = str(user.first().id)
            user.first().update_public_metadata(public_metadata)
        elif event_type == "user.deleted":
            user = User.objects.filter(external_id=external_id)
            artist = Artist.objects.filter(external_id=external_id)
            user.delete() if user.exists() else None
            artist.delete() if artist.exists() else None
        else:
            return 400, {"message": f"invalid event type: {event_type}"}
    except Exception as e:  # noqa: BLE001
        return 400, {"message": f"Error processing webhook: {e}"}

    return 200, {"message": "ok"}
