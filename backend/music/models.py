from django.db import models
import uuid


class Artist(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4,
        primary_key=True,
        unique=True,
        null=False,
        blank=False,
        editable=False,
    )
    name = models.CharField(max_length=30, unique=True, null=False, blank=False)
    image = models.ImageField(upload_to="artists", blank=True)

    def __str__(self) -> str:
        return self.name


class Music(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4,
        primary_key=True,
        unique=True,
        null=False,
        blank=False,
        editable=False,
    )
    title = models.CharField(max_length=80, null=False, blank=False)
    artist = models.ForeignKey(
        Artist, on_delete=models.CASCADE, null=False, blank=False
    )
    participants = models.ManyToManyField(
        Artist, related_name="participants", blank=True
    )
    letters = models.TextField(blank=True)
    cover = models.ImageField(upload_to="cover", blank=False)
    audio = models.FileField(upload_to="audio", blank=False)

    def __str__(self) -> str:
        return self.title
