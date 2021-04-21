from django.contrib import admin
from django.urls import path
from .views import AuthURL, callback, PlaylistMaker

urlpatterns = [
    path('auth/', AuthURL.as_view()),
    path('redirect/', callback),
    path('make_playlist/', PlaylistMaker.as_view())
]
