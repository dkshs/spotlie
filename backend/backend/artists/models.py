from django.db import models

from backend.users.models import AbstractUser


class Artist(AbstractUser):
    cover = models.ImageField(blank=True, null=True, upload_to="artists/covers/")

    def __str__(self):
        return self.username
