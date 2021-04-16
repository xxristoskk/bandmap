from django.shortcuts import render, redirect
from django.views import View
from django.utils import timezone
from datetime import timedelta
from frontpage.playlist_creator import PlaylistMaker
from .models import SpotifyToken

# rest framework imports
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

# spotipy imports
# handling spotify auth
import spotipy
from spotipy.cache_handler import CacheHandler
from spotipy.oauth2 import SpotifyOAuth
import os
client_id = os.environ['SPOTIFY_ID']
client_secret = os.environ['SPOTIFY_SECRET']
scope = 'playlist-modify-public'
redirect_uri = 'http://127.0.0.1:8000/spotify/redirect'

class PlaylistAPI(APIView):
    def post(self,request):
        # selected_artists = self.request.POST.get('selectedArtists')
        print(request)
        selected_artists = request.data.selectedArtists
        city = request.data.city
        return Response({'artists': selected_artists, 'city': city})
            
    def get(self,request):
        print(request)
        sp_token = SpotifyToken.objects.filter(session_user=user.session_user)[0].access_token
        new_playlist = PlaylistMaker(selected_artists, city, sp_token)
        username,playlist_id = new_playlist.get_user_details()
        trax = new_playlist.search_spotify()
        new_playlist.create_playlist(trax,playlist_id,username)

# spotipy defaults to storing cached tokens to a cache file
# this class inherits from the base cache handler so tokens are saved to the profile model
class CustomCacheHandler(CacheHandler):
    def __init__(self, session_user):
        self.session_user = session_user 
    
    def get_cached_token(self):
        token_info = None
        try:
            token_info = {
                'access_token': self.session_user.access_token,
                'expires_in': self.session_user.expires_in,
                'refresh_token': self.session_user.refresh_token
            }
        except:
            print('No token info')
        return token_info
    
    def save_token_to_cache(self, token_info):
        try:
            self.session_user.access_token = token_info['access_token']
            self.session_user.refresh_token = token_info['refresh_token']
            self.session_user.expires_in = token_info['expires_in']
            self.session_user.save(update_fields=['access_token','refresh_token','expires_in'])
        except:
            print("Couldn't save token info")

# initialize spotify credentials
class AuthURL(APIView):
    def get(self, request):
        oauth = SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri,
            scope=scope,
            cache_handler=CustomCacheHandler(request.session.session_key),
            show_dialog=True
        )
        auth_url = oauth.get_authorize_url()
        return Response({'url': auth_url}, status=status.HTTP_200_OK)

def callback(request):
    ### this is where the session info gets attched to token
    if not request.session.exists(request.session.session_key):
        request.session.create()

    oauth = SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=redirect_uri,
        scope=scope,
        cache_handler=CustomCacheHandler(request.session.session_key),
        show_dialog=True
    )

    code = oauth.parse_response_code(request.build_absolute_uri())
    token_info = oauth.get_access_token(code)
    expires_in = timezone.now() + timedelta(seconds=token_info['expires_in'])
    session_token = SpotifyToken.objects.filter(session_user=request.session.session_key)

    if session_token.exists():
        token = session_token[0]
        token.access_token = token_info['access_token']
        token.refresh_token = token_info['refresh_token']
        token.expires_in = expires_in
        token.save(update_fields=['access_token','refresh_token','expires_in'])
    else:
        token = SpotifyToken(
            session_user=request.session.session_key,
            access_token=token_info['access_token'],
            refresh_token=token_info['refresh_token'],
            expires_in=expires_in
        )
        token.save()

    return redirect('frontpage:map')