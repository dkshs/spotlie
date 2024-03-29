import jwt
from django.conf import settings
from django.http import HttpRequest

from backend.artists.models import Artist
from backend.users.models import User


class TokenIsValidReturn:
    def __init__(self, message: str, user: User = None, *, is_valid: bool):
        self.is_valid = is_valid
        self.message = message
        self.user = user


def token_is_valid(request: HttpRequest, *, return_user: bool = False):
    try:
        return token_is_valid_validator(request, return_user=return_user)
    except jwt.ExpiredSignatureError:
        return TokenIsValidReturn("Signature expired", is_valid=False)
    except jwt.InvalidSignatureError:
        return TokenIsValidReturn("Invalid signature", is_valid=False)
    except jwt.InvalidTokenError:
        return TokenIsValidReturn("Invalid token", is_valid=False)
    except Exception as e:  # noqa: BLE001
        return TokenIsValidReturn(f"Unknown error: {e}", is_valid=False)


def token_is_valid_validator(request: HttpRequest, *, return_user: bool = False):
    authorization = request.headers.get("Authorization")
    if authorization is None:
        return TokenIsValidReturn("No authorization header", is_valid=False)

    jwt_token = authorization.split(" ")[1]
    if jwt_token is None or jwt_token in ["", "null", "undefined"]:
        return TokenIsValidReturn("No token", is_valid=False)

    jwks_client = jwt.PyJWKClient(settings.JWKS_URL)
    key = jwks_client.get_signing_key_from_jwt(jwt_token).key
    data = jwt.decode(
        jwt_token,
        key,
        algorithms=["RS256"],
        options={
            "verify_signature": True,
            "verify_nbf": True,
        },
        verify=True,
    )

    user = None
    if return_user:
        is_artist = data["is_artist"]
        if is_artist:
            user = Artist.objects.filter(external_id=data["id"]).first()
        else:
            user = User.objects.filter(external_id=data["id"]).first()

    return TokenIsValidReturn("Token is valid", user, is_valid=True)
