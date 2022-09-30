# Generated by Django 3.1.6 on 2021-04-20 17:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spotifytoken',
            name='access_token',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='spotifytoken',
            name='expires_in',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='spotifytoken',
            name='refresh_token',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]