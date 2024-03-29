import uuid

from django.conf import settings
from django.db import models

from backend.artists.models import Artist

BASE_URL = getattr(settings, "BASE_URL", "")


class Music(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="musics")
    release_date = models.DateField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True, upload_to="musics/images/")
    audio = models.FileField(upload_to="musics/audios/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def get_image_url(self):
        return BASE_URL + self.image.url if self.image else None

    def get_audio_url(self):
        return BASE_URL + self.audio.url
