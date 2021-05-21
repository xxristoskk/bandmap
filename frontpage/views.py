from django.shortcuts import render, HttpResponseRedirect, HttpResponse
from django.views import View
from rest_framework.views import APIView
from .models import SessionMap
import os

#imports for contact form_class
from django.views.generic.edit import FormView
from django.core.mail import EmailMessage
from frontpage.forms import ContactForm

# imports for maps
from geopy.geocoders import Nominatim
from frontpage.forms import FilterForm
from frontpage.map_maker import MapMaker

# handling spotify auth
from spotify.models import SpotifyToken

# initializing the database connection
import pymongo
mongodb_pw = os.environ['MONGODB_PW']
mongodb_user = os.environ['MONGODB_USER']
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
    local_artists = coll.find({
                'latitude': {'$exists':True},
                'location':{'$regex':f'({region})'},
                'genres':{'$all':genres}
                })
    if local_artists.count() < 10:
        local_artists = list(local_artists)
        try:
            region = loc_lookup.raw['address']['state'].lower()
            additional_artists = coll.find({
                'latitude':{'$exists':True},
                'location':{'$regex':f'({region.lower()})'},
                'genres': {'$all':genres}
                })
        except:
            region = loc_lookup.raw['address']['city'].lower()
            additional_artists = coll.find({
                'latitude':{'$exists':True},
                'location':{'$regex':f'(, {region.lower()})'},
                'genres': {'$all':genres}
                })
        local_artists.extend(list(additional_artists))
    else:
        local_artists = list(local_artists)
    return local_artists
    
# main map view
class MapView(View):
    template_name = 'index.html'
    model = SessionMap
    contact_form_class = ContactForm
    filter_form_class = FilterForm 

    def post(self, *args, **kwargs):
        user = self.model.objects.filter(session_user=self.request.session.session_key)[0]
        data = self.request.POST
        contact_form = self.contact_form_class(data=data)
        filter_form = self.filter_form_class(data=data,instance=user)

        # contact form
        if 'contact' in self.request.POST:
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
                return HttpResponseRedirect('')

        # filter form
        if 'filter' in self.request.POST:
            if filter_form.is_valid():
                filter_form.save()
                user.genre1 = filter_form.cleaned_data.get('genre1')
                user.genre2 = filter_form.cleaned_data.get('genre2')
                user.save(update_fields=['genre1','genre2'])
                return HttpResponseRedirect('')
            else:
                return HttpResponse(filter_form.errors)
    
    ### NEED TO FIND A WAY TO ADD & SUBTRACT GENRES FROM FILTER LIST
    '''
    
    We want to be able to go dynamically add another form field for multiple genres.
    
    - Set the limit at 3 genres
    - Try using the query {'genres': {'$eleMatch': {'$all': ['genre1'], '$all': ['genre2']}}
        - Something that returns enough artists but doesn't take forever to retreive
    - Create the logic for querying one or multiple genres

    '''

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
        
        # verify spotify token exists
        token = SpotifyToken.objects.filter(session_user=user[0].session_user)
        if token.exists():
            sp_token = True
        else:
            sp_token = False
        
        # initialize location
        location = {'latitude': user[0].latitude, 'longitude': user[0].longitude}

        # if the user has a location, start building the map
        if user[0].latitude != None:

            # reverse lookup of user coords
            geolocator = Nominatim(user_agent='Bandmap')
            loc_lookup = geolocator.reverse(f"{user[0].latitude},{user[0].longitude}", language='en')
            if any(location):
                if loc_lookup.raw['address']['country_code'] == 'us':
                    region = loc_lookup.raw['address']['state'].lower()
                else:
                    region = loc_lookup.raw['address']['country'].lower()

            # query the mongodb collection for artists in this region
            ## if user defined a genre filter
            if user[0].genre1 != None:
                genres = [user[0].genre1.lower()]
                if user[0].genre2 != None:
                    genres.append(user[0].genre2.lower())
                local_artists = search_db(region, genres, loc_lookup)
                
            ## if user didn't define a genre filter
            else:
                local_artists = coll.find(
                    {'latitude': {'$exists':True},
                    'location':{'$regex':f'({region})'},
                    })
                # query again if there are very few artists
                if local_artists.count() < 50:
                    local_artists = list(local_artists)
                    try:
                        region = loc_lookup.raw['address']['state'].lower()
                        additional_artists = coll.find({'latitude':{'$exists':True},'location':{'$regex':f'({region.lower()})'}})
                    except:
                        region = loc_lookup.raw['address']['city'].lower()
                        additional_artists = coll.find({'latitude':{'$exists':True},'location':{'$regex':f'({region.lower()})'}})
                    if additional_artists.count() < 10:
                        pass
                    elif additional_artists.count() >= 10:
                        local_artists.extend(list(additional_artists))
                else:
                    local_artists = list(local_artists)

            # using the results from the mongodb query to build the geojson and build context
            user_map = MapMaker(local_artists)
            points = user_map.point_properties()
            context = {
                'geo': user_map.make_geo_json(points),
                'location': location,
                'sp_token': sp_token,
                'mapbox': {'token': 'pk.eyJ1IjoieHJpc3Rvc2siLCJhIjoiY2s3cXdhMGR5MDgxdjNlbXZjaGdkczNkcCJ9.Fu-hNW-oYVvXmSxbmbVjQA'},
                'contact_form': self.contact_form_class,
                'filter_form': self.filter_form_class(instance=user[0]),
                'first_visit': False
            }
            return render(self.request, self.template_name, context=context)
        # set everything blank if new session
        else:
            context = {
                'geo': None,
                'location': location,
                'sp_token': sp_token,
                'mapbox': {'token': 'pk.eyJ1IjoieHJpc3Rvc2siLCJhIjoiY2s3cXdhMGR5MDgxdjNlbXZjaGdkczNkcCJ9.Fu-hNW-oYVvXmSxbmbVjQA'},
                'contact_form': self.contact_form_class,
                'filter_form': self.filter_form_class(instance=user[0]),
                'first_visit': True
            }
            return render(self.request, self.template_name, context=context)