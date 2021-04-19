from django.shortcuts import render, redirect, HttpResponse
from django.views import View
from .models import SessionMap
# from spotify.models import SpotifyToken
from geopy.geocoders import Nominatim


from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from frontpage.map_maker import MapMaker

# initializing the database connection
import pymongo
import os
mongodb_pw = os.environ['MONGODB_PW']
mongodb_user = os.environ['MONGODB_USER']
client = pymongo.MongoClient(f'mongodb+srv://{mongodb_user}:{mongodb_pw}@bc01-muwwi.gcp.mongodb.net/test?retryWrites=true&w=majority')
db = client.BC02
coll = db.artistInfo

class SaveLocation(View):
    model = SessionMap
    def post(self, *args, **kwargs):
        if self.request.is_ajax():
            print(self.request.POST.get('latitude') + "This works")
            print(self.request.session.session_key)
            user = self.model.objects.filter(session_user=self.request.session.session_key)[0]
            print(user)
            user.latitude = self.request.POST.get('latitude')
            user.longitude = self.request.POST.get('longitude')
            user.save(update_fields=['latitude','longitude'])
        return HttpResponseRedirect('/')

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
        
        ## find location
        location = {'latitude': user[0].latitude, 'longitude': user[0].longitude}

        if user[0].latitude != None:
            geolocator = Nominatim(user_agent='Bandmap')
            loc_lookup = geolocator.reverse(f"{user[0].latitude},{user[0].longitude}")
            if any(location):
                try:
                    region = loc_lookup.raw['address']['state']
                except:
                    region = loc_lookup.raw['address']['country']
            local_artists = coll.find({'latitude':{'$exists':True},'location':{'$regex':f'({region.lower()})'}})
            user_map = MapMaker(local_artists)
            points = user_map.point_properties()
            # if sp_token.exists():
            context = {
                'geo': user_map.make_geo_json(points),
                'location': location,
                # 'sp_token': {'sp_token': sp_token[0].access_token},
                'mapbox': {'token': os.environ['MAPBOX_TOKEN']}
            }
        else:
            context = {
                'geo': None,
                'location': location,
                # 'sp_token': None,
                'mapbox': {'token': os.environ['MAPBOX_TOKEN']}
            }
        return render(self.request, self.template_name, context=context)