from django.db import models

# Create your models here.
class SessionMap(models.Model):
    GENRE_CHOICES = [
        ('ELECTRONIC', 'Electronic'),
        ('ROCK', 'Rock'),
        ('ALTERNATIVE', 'Alternative'),
        ('METAL', 'Metal'),
        ('PUNK', 'Punk'),
        ('RAP', 'Rap'),
        ('HIP-HOP', 'Hip-hop'),
        ('AMBIENT', 'Ambient'),
        ('TECHNO', 'Techno'),
        ('DUBSTEP', 'Dubstep'),
        ('DRUM N BASS', 'Drum n Bass'),
        ('POP', 'Pop'),
        ('FUTURE','Future'),
        ('DIY', 'DIY'),
        ('STONER', 'Stoner'),
        ('ACID', 'Acid'),
        ('DOWNTEMPO', 'Downtempo'),
        ('DEEP', 'Deep'),
        ('CONTEMPORARY', 'Contemporary'),
        ('FOLK', 'Folk'),
        ('PSYCH', 'Psychedelic'),
        ('JUNGLE', 'Jungle'),
        ('LOFI', 'Lo-Fi'),
        ('NOISE', 'Noise'),
        ('HARDCORE', 'Hardcore'),
        ('DARK', 'Dark'),
        ('INSTRUMENTAL', 'Instrumental'),
        ('INDIE', 'Indie'),
        ('EXP', 'Experimental'),
        ('HOUSE', 'House'),
        ('TRANCE', 'Trance'),
        ('ACOUSTIC', 'Acoustic'),
        ('JUKE', 'Juke'),
        ('FOOTWORK', 'Footwork')
    ]

    genre1 = models.CharField(max_length=15, choices=GENRE_CHOICES, blank=True, null=True)
    genre2 = models.CharField(max_length=15, choices=GENRE_CHOICES, blank=True, null=True)
    session_user = models.CharField(max_length=100, unique=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    class Meta:
        ordering = ['genre1','genre2']