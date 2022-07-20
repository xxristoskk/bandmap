from django.shortcuts import render, HttpResponseRedirect
from django.views import View
from .models import SessionMap
from rest_framework.views import APIView
import json

#imports for contact form_class
from django.core.mail import EmailMessage
from frontpage.forms import ContactForm

# imports for maps
from geopy.geocoders import Nominatim
from frontpage.map_maker import MapMaker


# handling spotify auth
from spotify.models import SpotifyToken

# initializing the database connection
import pymongo
mongodb_pw = 'm0m0fuzzyface'
mongodb_user = 'toast'
client = pymongo.MongoClient(f'mongodb+srv://{mongodb_user}:{mongodb_pw}@bc01-muwwi.gcp.mongodb.net/test?retryWrites=true&w=majority')
db = client.BC02
coll = db.artistInfo

# saves the geolocation of session
class SaveLocation(APIView):
    model = SessionMap
    def post(self, *args, **kwargs):
        data = self.request.data
        user = self.model.objects.filter(session_user=self.request.session.session_key)[0]
        user.latitude = data['latitude']
        user.longitude = data['longitude']
        user.save(update_fields=['latitude','longitude'])
        return HttpResponseRedirect('/')

# saves new location if choosen
class NewLocation(APIView):
    model = SessionMap
    def post(self, *args, **kwargs):
        user = self.model.objects.filter(session_user=self.request.session.session_key)[0]
        data = self.request.data
        user.latitude = data['new_location']['lat']
        user.longitude = data['new_location']['lng']
        user.save(update_fields=['latitude','longitude'])
        return HttpResponseRedirect('/')

## MongoDB search
def search_db(region, genres, loc_lookup):

    print(genres)
    genre1_artists = list(coll.find({
                'latitude': {'$exists':True},
                'location':{'$regex':f'({region})'},
                'genres':genres[0]
                }))
    genre2_artists = list(coll.find({
                'latitude': {'$exists':True},
                'location':{'$regex':f'({region})'},
                'genres':genres[1]
                }))


    local_artists = genre1_artists
    # if local_artists.count() < 10:
    #     local_artists = list(local_artists)
    #     try:
    #         region = loc_lookup.raw['address']['state'].lower()
    #         additional_artists = coll.find({
    #             'latitude':{'$exists':True},
    #             'location':{'$regex':f'({region.lower()})'},
    #             'genres': {'$all':genres}
    #             })
    #     except:
    #         region = loc_lookup.raw['address']['city'].lower()
    #         additional_artists = coll.find({
    #             'latitude':{'$exists':True},
    #             'location':{'$regex':f'(, {region.lower()})'},
    #             'genres': {'$all':genres}
    #             })
    #     if additional_artists.count() < 10:
    #         pass
    #     elif additional_artists.count() >= 10:
    #         local_artists.extend(list(additional_artists))
    # else:
    return local_artists
    
# main map view
class MapView(View):
    template_name = 'index.html'
    model = SessionMap
    contact_form_class = ContactForm

    def post(self, *args, **kwargs):
            self.request.session.create()
            self.model(session_user=self.request.session.session_key).save()
            user = self.model.objects.filter(session_user=self.request.session.session_key)[0]

            if any(self.request.POST):
                data = self.request.POST
                print(f"self.request.POST is {data}")
            else:
                data = json.loads(self.request.body.decode("utf-8"))
                print(f"json.loads is {data}")
                
                genres = data['genres']
                
                if len(genres) > 1:
                    user.genre1 = genres[0]['tag']
                    user.genre2 = genres[1]['tag']
                else:
                    user.genre1 = genres[0]['tag']
                
                print(f'settings location {data["location"]}')

                if type(data['location']) == str:
                    location = data['location']
                    geolocator = Nominatim(user_agent='Bandmap')
                    loc_lookup = geolocator.geocode(query=location, exactly_one=True, addressdetails=True)
                    user.latitude = loc_lookup.raw['lat']
                    user.longitude = loc_lookup.raw['lon']
                elif type(data['location']) == dict:
                    user.latitude = data['location']['latitude']
                    user.longitude = data['location']['longitude']

                user.save(update_fields=['genre1', 'genre2', 'latitude', 'longitude'])


                return HttpResponseRedirect('/')

            contact_form = self.contact_form_class(data=data)

            # contact form
            if 'contact' in data:
                if contact_form.is_valid():
                    subject = contact_form.cleaned_data.get('subject')
                    message = contact_form.cleaned_data.get('message')
                    sender = contact_form.cleaned_data.get('sender')

                    recipiants = ['x.katsaros.ds@gmail.com']

                    email = EmailMessage(
                        subject,
                        message,
                        sender,
                        recipiants,
                        reply_to=[sender]
                    )
                    email.send()
                    return HttpResponseRedirect('/')
    


    def get(self, *args, **kwargs):
        
        # assume this is the user's first visit
        print('START')
        first_visit = True

        # create session_key if this is the first visit
        if not self.request.session.exists(self.request.session.session_key):

            print('first time visit')

            # self.request.session.create()
            # self.model(session_user=self.request.session.session_key).save()
            # user = self.model.objects.filter(session_user=self.request.session.session_key)

            context = {
                'first_visit': first_visit,
            }
            return render(self.request, self.template_name, context=context)
        else:

            print('second time visit')

            #lookup user session_key
            user = self.model.objects.filter(session_user=self.request.session.session_key)
            if not user.exists():
                self.model(session_user=self.request.session.session_key).save()
                first_visit = False
            
            # verify spotify token exists
            token = SpotifyToken.objects.filter(session_user=user[0].session_user)
            if token.exists():
                sp_token = True
            else:
                sp_token = False

            # initialize location
            location = {'latitude': user[0].latitude, 'longitude': user[0].longitude}

            print(f'location {location}')

            if location['latitude'] == None:
                return render(self.request, self.template_name, context={'first_visit': True})
        
            # reverse lookup of user coords
            geolocator = Nominatim(user_agent='Bandmap')
            loc_lookup = geolocator.reverse(f"{location['latitude']},{location['longitude']}", language='en')
            if any(location):
                # US lookup
                if loc_lookup.raw['address']['country_code'] == 'us':
                    region = loc_lookup.raw['address']['state'].lower()
                else:
                    #Global lookup
                    region = loc_lookup.raw['address']['country'].lower()

                print(f'region {region}')

            # search mongoDB for artists based on region and genres

            genres = [user[0].genre1.lower(),user[0].genre2.lower()]

            local_artists = search_db(region, genres, loc_lookup)
        
            print(f'loaded artists')
            
            # build geojson based on mongoDB query
            user_map = MapMaker(local_artists)
            points = user_map.point_properties()

            context = {
                'geo': user_map.make_geo_json(points),
                'location': location,
                'sp_token': sp_token,
                'mapbox': {'token': 'pk.eyJ1IjoieHJpc3Rvc2siLCJhIjoiY2tuamYzNzNsMDBncTJycnRldXI4anl3byJ9.e6qEe4Rv6KT2NmreEuRgSg'},
                'contact': self.contact_form_class,
                'genres': local_artists, #'genres' needs to be changed to local artists in HTML and JS files
                'first_visit': False
            }

            return render(self.request, self.template_name, context=context)