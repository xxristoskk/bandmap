from django.contrib import admin
from django.urls import path
from .views import MapView, NewGenres, NewLocation

app_name = 'frontpage'

urlpatterns = [
    path('', MapView.as_view(), name='map'),
    path('new_genres/', NewGenres.as_view()),
    path('new_location/', NewLocation.as_view())
]