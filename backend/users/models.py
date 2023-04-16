from django.db import models
import uuid


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
    image = models.URLField()

    def __str__(self) -> str:
        return self.username
