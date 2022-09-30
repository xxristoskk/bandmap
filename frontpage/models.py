from django.db import models

# Create your models here.
class SessionMap(models.Model):

    genre1 = models.CharField(max_length=15, blank=True, null=True)
    genre2 = models.CharField(max_length=15, blank=True, null=True)
    # mode = models.CharField(max_length=15, blank=True, null=True)
    session_user = models.CharField(max_length=100, unique=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)