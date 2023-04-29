from django.db import models
import uuid
from secrets import token_hex


class User(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4,
        primary_key=True,
        unique=True,
        null=False,
        blank=False,
        editable=False,
    )
    identifier = models.CharField(
        max_length=32, unique=True, null=False, blank=False, editable=False
    )
    email = models.EmailField(null=False, blank=False)
    username = models.CharField(max_length=64, unique=True, null=False, blank=False)
    image = models.URLField(default="https://www.gravatar.com/avatar?d=mp")

    def save(self, *args, **kwargs):
        if not self.identifier:
            self.identifier = f"user_{token_hex(8)}"
        if not self.username:
            self.username = f"user_{token_hex(8)}"
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.username
