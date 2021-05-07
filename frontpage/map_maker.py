import geojson
from geojson import FeatureCollection, Point, Feature

class MapMaker():
    def __init__(self, mongo_collection):
        self.artists = mongo_collection

    def make_geo_json(self, points):
        features = []
        for point in points.keys():
            feat = Feature(
                geometry=Point(point),
                properties=points[point]
            )
            features.append(feat)
        collection = FeatureCollection(features)
        return collection
    
    def point_properties(self):
        points = {}
        case = []
        for artist in self.artists:
            try:
                latest = artist['latest_release']
            except:
                latest = None
            genres = [x for x in artist['genres'] if x not in artist['location'].split(', ')]
            if not genres:
                genres = ['empty']
            long_lat = (artist['longitude'], artist['latitude'])
            if long_lat not in case:
                points[long_lat] = {
                    'city': artist['location'].split(', ')[0].title(),
                    'num_of_artists': 1,
                    'genres': genres,
                    'artists': [
                        {
                            'name': artist['artist_name'].title(),
                            'genre': genres[0],
                            'bc_url': artist['bc_url'],
                            'latest_release': latest
                        }
                    ]
                }
                case.append(long_lat)
            else:
                points[long_lat]['num_of_artists']+=1
                points[long_lat]['genres'].extend(genres)
                points[long_lat]['artists'].append({
                        'name': artist['artist_name'].title(),
                        'genre': genres[0],
                        'bc_url': artist['bc_url'],
                        'latest_release': latest
                    })
        for point in points.keys():
            genres = points[point]['genres']
            genre_freq = []
            case = []
            for genre in genres:
                if genre in case:
                    continue
                elif genre != 'empty':
                    genre_freq.append((genre, genres.count(genre)))
                    case.append(genre)
                else:
                    genre = 'undefined'
                    genre_freq.append((genre, genres.count(genre)))
            del points[point]['genres']
            genre_freq_sorted = sorted(genre_freq, key=lambda x: x[1], reverse=True)
            if len(genre_freq_sorted) >= 3:
                points[point]['top_genres'] = f"<p>{genre_freq_sorted[0][0]}, {genre_freq_sorted[1][0]}, {genre_freq_sorted[2][0]}</p>"
            elif len(genre_freq_sorted) <= 2 and len(genre_freq_sorted) > 1:
                points[point]['top_genres'] = f"<p>{genre_freq_sorted[0][0]}</p>"
        return points