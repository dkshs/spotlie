from ninja import Router
from .routes.musics_routes import router as musics_routes
from .routes.singers_routes import router as singers_routes

router = Router()

router.add_router("/", musics_routes)
router.add_router("/", singers_routes)
