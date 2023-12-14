from ninja import Router

from .routes.users import router as users_router
from .routes.webhook import router as webhook_router

router = Router()


router.add_router("/users", webhook_router, tags=["users"])
router.add_router("/users", users_router, tags=["users"])
