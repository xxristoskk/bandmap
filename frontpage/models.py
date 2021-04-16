from django.db import models

# Create your models here.
class SessionMap(models.Model):
    session_user = models.CharField(max_length=100, unique=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)