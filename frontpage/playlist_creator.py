import spotipy
import time

def break_up_albums(album_ids, sp):
    print(album_ids)
    trax = []
    size = len(album_ids)
    if size <= 20:
        for album in list(sp.albums(album_ids)['albums']):
            trax.extend([x['id'] for x in album['tracks']['items']])
        return trax
    else:
        while size > 20:
            case = album_ids[size-20:size]
            for album in list(sp.albums(case)['albums']):
                trax.extend([x['id'] for x in album['tracks']['items']])
            size = size - 20
            time.sleep(1)
        case = album_ids[:size]
        for album in list(sp.albums(case)['albums']):
                trax.extend([x['id'] for x in album['tracks']['items']])
        return trax

class MakePlaylist():
    def __init__(self, sp, sp_username):
        self.sp = sp
        self.sp_username = sp_username

    def get_playlist_id(self,pl_name):
        playlists = [x['name'].lower() for x in self.sp.current_user_playlists()['items']]

        #determine playlist ID
        if pl_name.lower() not in playlists:
            self.sp.user_playlist_create(user=self.sp_username, name=pl_name) #create a new playlist
            playlist_id = self.sp.current_user_playlists()['items'][0]['id'] #grab new playlist ID
            return playlist_id

        elif pl_name.lower() in playlists:
            playlist_id = self.sp.current_user_playlists()['items'][playlists.index(pl_name.lower())]['id']
            return playlist_id

    def search_artists(self, selected_artists):
        artist_ids= []
        for artist in selected_artists:
            results = self.sp.search(q=artist['artist_name'], type='artist', limit=1)
            # verifies the artist names match exactly
            if any(results['artists']['items']) and artist['artist_name'].lower() == results['artists']['items'][0]['name'].lower():
                artist_ids.append(results['artists']['items'][0]['id'])
            else:
                continue
        # find top tracks from artist ids
        top_trax = []
        if len(artist_ids) > 50:
            for id_ in artist_ids[:50]:
                results = self.sp.artist_top_tracks(id_)
                top_trax.extend([track['id'] for track in results['tracks']])
        else:
            for id_ in artist_ids:
                results = self.sp.artist_top_tracks(id_)
                top_trax.extend([track['id'] for track in results['tracks']])

        return top_trax

    def create_playlist(self, results, playlist_id):
        size = len(results)
        if size <= 100:
            return self.sp.user_playlist_add_tracks(user=self.sp_username, playlist_id= playlist_id, tracks=results)
        else:
            while size > 100:
                case = results[size-100:size]
                self.sp.user_playlist_add_tracks(user=self.sp_username, playlist_id=playlist_id, tracks=case)
                size = size - 100
                time.sleep(3)
            case = results[:size]
            return self.sp.user_playlist_add_tracks(user=self.sp_username, playlist_id=playlist_id, tracks=case)