import uuid

import requests
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.db import models


class AbstractUser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    external_id = models.CharField(max_length=32, unique=True, editable=False)
    first_name = models.CharField(blank=True, max_length=64, default="")
    last_name = models.CharField(blank=True, max_length=64, default="")
    username = models.CharField(max_length=64, unique=True)
    email = models.EmailField()
    image = models.URLField(
        blank=True,
        default="https://img.clerk.com/preview.png",
    )
    liked_musics = models.ManyToManyField(
        "musics.Music",
        blank=True,
        related_name="liked_by",
    )
    public_metadata = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def get_playlists(self):
        return ContentType.objects.get(
            app_label="playlists",
            model="playlist",
        ).get_all_objects_for_this_type(
            object_id=self.id,
        )

    def update_public_metadata(self, public_metadata: dict):
        public_metadata = public_metadata or {}
        # remove unchanged values
        public_metadata = {
            k: v for k, v in public_metadata.items() if v != self.public_metadata.get(k)
        }
        if not public_metadata:
            return
        self.public_metadata.update(public_metadata)
        requests.patch(
            f"https://api.clerk.com/v1/users/{self.external_id}/metadata",
            headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
            json={
                "public_metadata": public_metadata,
            },
            timeout=20,
        )
        self.save()

    def get_full_name(self):
        first_name = getattr(self, "first_name", "")
        last_name = getattr(self, "last_name", "")
        full_name = f"{first_name or ''} {last_name or ''}".strip()
        return full_name or self.username

    def is_artist(self) -> bool:
        return self.public_metadata.get("is_artist", False)

    def delete(self, *args, **kwargs) -> tuple[int, dict[str, int]]:
        # delete all playlists associated with this user
        for playlist in self.get_playlists():
            playlist.delete()
        return super().delete(*args, **kwargs)


class User(AbstractUser):
    def __str__(self):
        return self.get_full_name()
