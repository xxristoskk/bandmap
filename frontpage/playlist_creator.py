import spotipy

client_id = '33c183396aca4677979061389ebd6a2e'
client_secret = '97a2762f9fd14ac6ab5a73614abc2538'
scope = 'playlist-modify-public'
redirect_uri = 'http://127.0.0.1:8000/spotify/redirect'

class PlaylistMaker():
    def __init__(self, artists, token, city):
        self.artists = artists
        self.token = token
        self.city = city

    def get_user_details(self):
        sp = spotipy.Spotify(auth=self.token)
        username = sp.me()['id']
        sp.user_playlist_create(user=username, name=f"{self.city} Bandmap Playlist") #create a new playlist
        playlist_id = sp.current_user_playlists()['items'][0]['id'] #grab new playlist ID
        return (username,playlist_id)

    def search_spotify(self):
        sp = spotipy.Spotify(auth=self.token)
        artist_ids = []
        track_ids = []
        for artist in self.artists:
            results = sp.search(q= f"{artist['name']}", type='artist', limit=1)

            if any(results['artists']['items']) and artist['name'].lower() == results['artists']['items'][0]['name'].lower():
                artist_ids.append(results['artists']['items'][0]['id'])
            else:
                continue
        if len(artist_ids) > 50:
            for id_ in artist_ids[:50]:
                results = sp.artist_top_tracks(id_)
                track_ids = [track['id'] for track in results['tracks']]
        else:
            for id_ in artist_ids:
                results = sp.artist_top_tracks(id_)
                track_ids = [track['id'] for track in results['tracks']]

        return track_ids

    def create_playlist(self, results, playlist_id, sp_username):
        sp = spotipy.Spotify(auth=self.token)
        size = len(results)
        if size <= 100:
            return sp.user_playlist_add_tracks(user=sp_username, playlist_id= playlist_id, tracks=results)
        else:
            while size > 100:
                case = results[size-100:size]
                sp.user_playlist_add_tracks(user=sp_username, playlist_id=playlist_id, tracks=case)
                size = size - 100
                time.sleep(3)
            case = results[:size]
            return sp.user_playlist_add_tracks(user=sp_username, playlist_id=playlist_id, tracks=case)