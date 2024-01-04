from ninja import Router

from .routes.music_contexts import router as music_contexts_router

router = Router()

router.add_router("/music_contexts", music_contexts_router, tags=["music_contexts"])
