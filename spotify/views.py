from django.shortcuts import redirect
from django.utils import timezone
from datetime import timedelta
from frontpage.playlist_creator import MakePlaylist
from .models import SpotifyToken
import os

# rest framework imports
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

# spotipy imports
# handling spotify auth
import spotipy
from spotipy.cache_handler import CacheHandler
from spotipy.oauth2 import SpotifyOAuth

client_id = os.environ['SPOTIFY_ID']
client_secret = os.environ['SPOTIFY_SECRET']
scope = 'playlist-modify-public'
redirect_uri = 'https://bandmap-staging.herokuapp.com/spotify/redirect'

def validate_tokens(session_user):
    oauth = SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=redirect_uri,
        scope=scope,
        cache_handler=CustomCacheHandler(session_user),
        show_dialog=True
    )
    # takes a session id and checks to see if it has expired token
    token_info = SpotifyToken.objects.filter(session_user=session_user)[0]
    expiration = token_info.expires_in
    if expiration <= timezone.now():
        token_info = oauth.refresh_access_token(token_info.refresh_token)
        token = token_info['access_token']
        return spotipy.Spotify(auth=token)
    else:
        return spotipy.Spotify(auth=token_info.access_token)
        


class PlaylistMaker(APIView):
    def post(self, *args, **kwargs):
        # find spotify token associated with session
        token = SpotifyToken.objects.filter(session_user=self.request.session.session_key)[0]

        #get the data from POST
        data = self.request.data
        artists = data['artists']
        city = data['city']

        #get the access token
        sp = validate_tokens(token.session_user)
        
        #get username and start building playlist
        username = sp.current_user()['id']
        playlist_maker = MakePlaylist(sp_username=username, sp=sp)
        track_ids = playlist_maker.search_artists(artists)
        playlist_id = playlist_maker.get_playlist_id(f"{city.title()} BandMap Playlist")
        playlist_maker.create_playlist(track_ids, playlist_id)
        return redirect('frontpage:map')

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

# callback function for Spotify API redirect
def callback(request):
    oauth = SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=redirect_uri,
        scope=scope,
        cache_handler=CustomCacheHandler(request.session.session_key),
        show_dialog=True
    )

    # get the access token and search for the current session user
    code = oauth.parse_response_code(request.build_absolute_uri())
    token_info = oauth.get_access_token(code)
    expires_in = timezone.now() + timedelta(seconds=token_info['expires_in'])
    session_token = SpotifyToken.objects.filter(session_user=request.session.session_key)

    # saves the token to associated session user
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