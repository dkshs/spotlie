from django.conf import settings
from django.db import models

from backend.users.models import AbstractUser

BASE_URL = getattr(settings, "BASE_URL", "")


class Artist(AbstractUser):
    cover = models.ImageField(blank=True, null=True, upload_to="artists/covers/")
    about = models.TextField(blank=True, null=True)
    twitter_link = models.URLField(blank=True, null=True)
    instagram_link = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    def get_cover_url(self):
        return BASE_URL + self.cover.url if self.cover else None

    def __str__(self):
        return self.get_full_name()
