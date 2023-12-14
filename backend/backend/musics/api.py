from ninja import Router

from .routes.musics import router as musics_router

router = Router()

router.add_router("/musics", musics_router, tags=["musics"])
