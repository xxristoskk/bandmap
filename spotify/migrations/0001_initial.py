# Generated by Django 3.2.3 on 2022-07-20 21:12

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SpotifyToken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_user', models.CharField(max_length=100, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('refresh_token', models.CharField(blank=True, max_length=200, null=True)),
                ('access_token', models.CharField(blank=True, max_length=200, null=True)),
                ('expires_in', models.DateTimeField(null=True)),
            ],
        ),
    ]
