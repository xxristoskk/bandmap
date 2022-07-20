from django.contrib import admin
from django.urls import path
from .views import AuthURL, callback, PlaylistMaker

app_name = 'spotify'

urlpatterns = [
    path('auth/', AuthURL.as_view(), name='auth'),
    path('redirect/', callback),
    path('selected_artists/', PlaylistMaker.as_view(), name='make_playlist')
]
