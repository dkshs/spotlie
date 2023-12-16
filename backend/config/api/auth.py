import jwt
from django.conf import settings
from django.http import HttpRequest

from backend.artists.models import Artist
from backend.users.models import User


class InvalidTokenException(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

    def __str__(self):
        return self.message


class TokenIsValidReturn:
    def __init__(self, is_valid: bool, message: str, user: User = None):
        self.is_valid = is_valid
        self.message = message
        self.user = user


def token_is_valid(request: HttpRequest, return_user: bool = False):
    try:
        return token_is_valid_validator(request, return_user)
    except jwt.ExpiredSignatureError:
        return TokenIsValidReturn(False, "Signature expired")
    except jwt.InvalidSignatureError:
        return TokenIsValidReturn(False, "Invalid signature")
    except jwt.InvalidTokenError:
        return TokenIsValidReturn(False, "Invalid token")
    except Exception as e:
        return TokenIsValidReturn(False, f"Unknown error: {e}")


def token_is_valid_validator(request: HttpRequest, return_user: bool = False):
    authorization = request.headers.get("Authorization")
    if authorization is None:
        return TokenIsValidReturn(False, "No authorization header")

    jwt_token = authorization.split(" ")[1]
    if jwt_token is None or jwt_token in ["", "null", "undefined"]:
        return TokenIsValidReturn(False, "No token")

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

    return TokenIsValidReturn(True, "Token is valid", user)
