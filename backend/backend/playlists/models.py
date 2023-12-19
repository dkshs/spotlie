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
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True, upload_to="playlists")
    musics = models.ManyToManyField(Music, blank=True)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Owner
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    owner = GenericForeignKey("content_type", "object_id")

    def get_image_url(self):
        if self.image:
            return BASE_URL + self.image.url
        return None

    def __str__(self):
        return self.name
