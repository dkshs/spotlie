from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from backend.musics.models import Music
from backend.playlists.models import Playlist


class MusicContext(models.Model):
    MUSIC_STATE = (("playing", "Playing"), ("paused", "Paused"))
    current_music = models.ForeignKey(Music, on_delete=models.SET_NULL, null=True, blank=True)
    current_playlist = models.ForeignKey(Playlist, on_delete=models.SET_NULL, null=True, blank=True)
    musics = models.ManyToManyField(Music, blank=True, related_name="musics_context")
    music_state = models.CharField(max_length=10, choices=MUSIC_STATE, default="paused")

    # Owner
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    owner = GenericForeignKey("content_type", "object_id")

    def __str__(self) -> str:
        return f"Music Context {self.id} - {self.owner}"

    class Meta:
        verbose_name = "Music Context"
        verbose_name_plural = "Music Contexts"
        ordering = ["id"]
