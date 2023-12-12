import uuid

from django.db import models


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    external_id = models.CharField(max_length=32, unique=True, null=False, blank=False, editable=False)
    username = models.CharField(max_length=64, unique=True, null=False, blank=False)
    email = models.EmailField(null=False, blank=False)
    image = models.URLField(default="https://img.clerk.com/preview.png")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
