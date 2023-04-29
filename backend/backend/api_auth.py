from django.conf import settings
from django.http import HttpRequest
from ninja.security import HttpBearer
import jwt
from users.models import User


class AuthBearerGlobal(HttpBearer):
    def authenticate(self, request, token):
        if token == settings.API_KEY:
            return token


class AuthBearerEndpoint(HttpBearer):
    def authenticate(self, request, token):
        if token == settings.ENDPOINT_KEY:
            return token


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
    except Exception:
        return TokenIsValidReturn(False, "Unknown error")


def token_is_valid_validator(request: HttpRequest, return_user: bool = False):
    authorization = request.headers.get("Authorization")
    if authorization is None:
        return TokenIsValidReturn(False, "No authorization header")

    jwt_token = authorization.split(" ")[1]
    if jwt_token is None or jwt_token in ["", "null", "undefined"]:
        return TokenIsValidReturn(False, "No token")

    jwks_client = jwt.PyJWKClient(settings.JWKS_URL, True)
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
        user = User.objects.filter(identifier=data["id"]).first()
        if user is None:
            user = User(
                identifier=data["id"],
                email=data["email"],
                image=data["image"],
                username=data["username"],
            )
            user.save()

    return TokenIsValidReturn(True, "Token is valid", user)
