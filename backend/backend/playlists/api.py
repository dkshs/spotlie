from ninja import Router

from .routes.playlists import router as playlists_router

router = Router()

router.add_router("/playlists", playlists_router, tags=["playlists"])
