from django.contrib import admin

from .models import MusicOrder
from .models import Playlist

admin.site.register(Playlist)
admin.site.register(MusicOrder)
