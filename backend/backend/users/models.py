import uuid

import requests
from django.conf import settings
from django.db import models


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    external_id = models.CharField(max_length=32, unique=True, null=False, blank=False, editable=False)
    username = models.CharField(max_length=64, unique=True, null=False, blank=False)
    email = models.EmailField(null=False, blank=False)
    image = models.URLField(blank=True, default="https://img.clerk.com/preview.png")
    public_metadata = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def update_public_metadata(self, public_metadata: dict):
        public_metadata = public_metadata or {}
        # remove unchanged values
        public_metadata = {k: v for k, v in public_metadata.items() if v != self.public_metadata.get(k)}
        if public_metadata == {}:
            return
        self.public_metadata = public_metadata
        requests.patch(
            f"https://api.clerk.com/v1/users/{self.external_id}/metadata",
            headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
            json={
                "public_metadata": public_metadata,
            },
        )
        self.save()

    def __str__(self):
        return self.username
