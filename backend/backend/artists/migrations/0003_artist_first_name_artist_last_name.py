# Generated by Django 4.2.8 on 2023-12-23 20:03

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("artists", "0002_artist_about_artist_instagram_link_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="artist",
            name="first_name",
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
        migrations.AddField(
            model_name="artist",
            name="last_name",
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
    ]
