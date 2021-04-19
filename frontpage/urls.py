from django.contrib import admin
from django.urls import path
from .views import MapView
from django.views.decorators.csrf import ensure_csrf_cookie

app_name = 'frontpage'

urlpatterns = [
    path('', ensure_csrf_cookie(MapView.as_view()), name='map'),
    path('save_location/', SaveLocation.as_view())
]
