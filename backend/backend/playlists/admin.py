from django.contrib import admin

from .models import MusicOrder, Playlist

admin.site.register(Playlist)
admin.site.register(MusicOrder)
