from ninja import Router

from .routes.webhook import router as webhook_router

router = Router()


router.add_router("/users", webhook_router, tags=["users"])
