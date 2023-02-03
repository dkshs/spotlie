from ninja import Router
from .routes.musics_routes import router as musics_routes
from .routes.artists_routes import router as artists_routes

router = Router()

router.add_router("/", musics_routes)
router.add_router("/", artists_routes)
