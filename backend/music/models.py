from django.db import models
from uuid import uuid4


class Singer(models.Model):
    id = models.UUIDField(
        default=uuid4(),
        primary_key=True,
        unique=True,
        null=False,
        blank=False,
        editable=False,
    )
    name = models.CharField(max_length=30, unique=True, null=False, blank=False)

    def __str__(self) -> str:
        return self.name


class Music(models.Model):
    id = models.UUIDField(
        default=uuid4(),
        primary_key=True,
        unique=True,
        null=False,
        blank=False,
        editable=False,
    )
    title = models.CharField(max_length=80, null=False, blank=False)
    singers = models.ManyToManyField(Singer, related_name="singers")
    cover = models.ImageField(upload_to="cover", blank=False)
    audio = models.FileField(upload_to="audio", blank=False)

    def __str__(self) -> str:
        return self.title
