from django.db import models

# Create your models here.
class SpotifyToken(models.Model):
    session_user = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=200)
    access_token = models.CharField(max_length=200)
    expires_in = models.DateTimeField()