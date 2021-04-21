from django.shortcuts import render, redirect, HttpResponseRedirect
from django.views import View
from .models import SessionMap
import os

# imports for maps
from geopy.geocoders import Nominatim
from frontpage.map_maker import MapMaker
from frontpage.playlist_creator import MakePlaylist


# handling spotify auth
import spotipy
from spotipy.cache_handler import CacheHandler
from spotipy.oauth2 import SpotifyOAuth
from spotify.views import CustomCacheHandler, validate_tokens
from spotify.models import SpotifyToken

# initializing the database connection
import pymongo
mongodb_pw = os.environ['MONGODB_PW']
mongodb_user = os.environ['MONGODB_USER']
client = pymongo.MongoClient(f'mongodb+srv://{mongodb_user}:{mongodb_pw}@bc01-muwwi.gcp.mongodb.net/test?retryWrites=true&w=majority')
db = client.BC02
coll = db.artistInfo

# gets the names of artists in selected city and makes a playlist
class SelectedArtists(View):
    def post(self, *args, **kwargs):
        data = self.request.POST
        case = []
        artists = []
        city = data.dict()['city']

        # parsing posted data
        for k,v in data.items():
            if k != 'csrfmiddlewaretoken' and k != city:
                case.append(v)
        for x in range(0,len(case),2):
            artists.append({'artist_name':case[x]})

        sp = validate_tokens(self.request.session.session_key)
        spotify_username = sp.current_user()['id']
        playlist_maker = MakePlaylist(sp_username=spotify_username, sp=sp)
        track_ids = playlist_maker.search_artists(artists)
        playlist_id = playlist_maker.get_playlist_id(f"{city.title()} Bandmap Playlist")
        playlist_maker.create_playlist(track_ids, playlist_id)

        return redirect('map')

# saves the geolocation of session
class SaveLocation(View):
    model = SessionMap
    def post(self, *args, **kwargs):
        if self.request.is_ajax():
            user = self.model.objects.filter(session_user=self.request.session.session_key)[0]
            user.latitude = self.request.POST.get('latitude')
            user.longitude = self.request.POST.get('longitude')
            user.save(update_fields=['latitude','longitude'])
        return HttpResponseRedirect('/')

# saves new location if choosen
class NewLocation(View):
    def post(self, *args, **kwargs):
        user = SessionMap.objects.filter(session_user=self.request.session.session_key)[0]
        user.latitude = self.request.POST.get('new_location[lat]')
        user.longitude = self.request.POST.get('new_location[lng]')
        user.save(update_fields=['latitude','longitude'])
        return redirect('frontpage:map')

class MapView(View):
    template_name = 'index.html'
    model = SessionMap
    
    def get(self, *args, **kwargs):
        # create session_key if not made
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            self.model(session_user=self.request.session.session_key).save()
            user = self.model.objects.filter(session_user=self.request.session.session_key)
        else:
            user = self.model.objects.filter(session_user=self.request.session.session_key)
            if not user.exists():
                self.model(session_user=self.request.session.session_key).save()
        
        #verify spotify token
        token = SpotifyToken.objects.filter(session_user=user[0].session_user)
        if token.exists():
            sp_token = True
        else:
            sp_token = False
        
        #verify location
        location = {'latitude': user[0].latitude, 'longitude': user[0].longitude}
        if user[0].latitude != None:
            geolocator = Nominatim(user_agent='Bandmap')
            loc_lookup = geolocator.reverse(f"{user[0].latitude},{user[0].longitude}", language='en')
            if any(location):
                if loc_lookup.raw['address']['country_code'] == 'us':
                    region = loc_lookup.raw['address']['state'].lower()
                else:
                    region = loc_lookup.raw['address']['country'].lower()
            # query the mongodb collection for artists in this region
            local_artists = coll.find({'latitude':{'$exists':True},'location':{'$regex':f'({region})'}})
            if local_artists.count() < 50:
                local_artists = list(local_artists)
                print(loc_lookup.raw)
                try:
                    region = loc_lookup.raw['address']['state'].lower()
                    print(region)
                    additional_artists = coll.find({'latitude':{'$exists':True},'location':{'$regex':f'({region.lower()})'}})
                except:
                    region = loc_lookup.raw['address']['city'].lower()
                    print(region)
                    additional_artists = coll.find({'latitude':{'$exists':True},'location':{'$regex':f'(, {region.lower()})'}})
                local_artists.extend(list(additional_artists))

            # send data into the map maker and declare context
            user_map = MapMaker(local_artists)
            points = user_map.point_properties()
            context = {
                'geo': user_map.make_geo_json(points),
                'location': location,
                'sp_token': sp_token,
                'mapbox': {'token': os.environ['MAPBOX_TOKEN']}
            }
        else:
            # this indicates that this is the first time this browser is visiting
            context = {
                'geo': None,
                'location': location,
                'sp_token': sp_token,
                'mapbox': {'token': os.environ['MAPBOX_TOKEN']}
            }
        return render(self.request, self.template_name, context=context)