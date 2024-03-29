import uuid

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from backend.musics.models import Music

BASE_URL = getattr(settings, "BASE_URL", "")


class Playlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    image = models.ImageField(blank=True, null=True, upload_to="playlists")
    musics = models.ManyToManyField(Music, blank=True, through="MusicOrder")
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Owner
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    owner = GenericForeignKey("content_type", "object_id")

    def __str__(self):
        return self.name

    def get_image_url(self):
        return BASE_URL + self.image.url if self.image else None

    def get_musics_order(self):
        return self.musics.through.objects.filter(playlist=self).order_by("order")

    def get_musics(self):
        return [m.music for m in self.get_musics_order()]


class MusicOrder(models.Model):
    order = models.PositiveIntegerField(default=0)
    music = models.ForeignKey(Music, on_delete=models.CASCADE)
    playlist = models.ForeignKey("Playlist", on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Music Order"
        verbose_name_plural = "Music Orders"

    def __str__(self):
        return f"{self.playlist.name} - {self.music.title}"
