# Generated by Django 4.2.8 on 2023-12-14 01:43

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("artists", "0002_artist_about_artist_instagram_link_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Music",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("title", models.CharField(max_length=255)),
                ("release_date", models.DateField(blank=True, null=True)),
                ("image", models.ImageField(blank=True, null=True, upload_to="musics/images/")),
                ("audio", models.FileField(upload_to="musics/audios/")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("artist", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="artists.artist")),
            ],
        ),
    ]
