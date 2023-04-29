from backend.api_auth import AuthBearerEndpoint
from ninja import Router
from .routes.endpoints import router as endpoints_routes
from .routes.users_routes import router as users_routes

router = Router()

router.add_router("/", users_routes, tags=["users"])
router.add_router(
    "/users", endpoints_routes, tags=["endpoints"], auth=AuthBearerEndpoint()
)
