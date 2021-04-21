from django.contrib import admin
from django.urls import path
from .views import MapView, SaveLocation, NewLocation

app_name = 'frontpage'

urlpatterns = [
    path('', MapView.as_view(), name='map'),
    path('save_location/', SaveLocation.as_view()),
    path('new_location/', NewLocation.as_view())
]