from ninja import Router
from .routes.artists import router as artists_router

router = Router()

router.add_router("/artists", artists_router, tags=["artists"])
