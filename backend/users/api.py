from backend.api_auth import AuthBearerGlobal
from ninja import Router
from .routes.endpoints import router as endpoints_routes
from .routes.users_routes import router as users_routes

router = Router()

router.add_router("/", users_routes, auth=AuthBearerGlobal(), tags=["users"])
router.add_router("/users", endpoints_routes, tags=["endpoints"])
