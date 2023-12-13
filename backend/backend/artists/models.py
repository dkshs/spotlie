from secrets import token_hex
from django.db import models
from backend.users.models import User


class Artist(User):
    cover = models.ImageField(blank=True, upload_to="artists/covers/")

    def save(self, *args, **kwargs):
        if not self.external_id:
            self.external_id = f"user_{token_hex(8)}"
        super().save(*args, **kwargs)
