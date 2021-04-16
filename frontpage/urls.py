from django.contrib import admin
from django.urls import path
from .views import MapView

app_name = 'frontpage'

urlpatterns = [
    path('', MapView.as_view(), name='map'),
]
