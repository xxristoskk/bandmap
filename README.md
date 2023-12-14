# Welcome to [BandMap](https://bandmapv2.herokuapp.com/)

### Update 12-14-23 to-do list
- Improve UI with React framework
- Allow for multiple genres to be queried by creating an array model
- Break up map.js into smaller javascript files
- Create a button to toggle between light and dark modes

## A way to explore Bandcamp on a map

BandMap allows people to explore independent artists on a local level. They can search for artists in the genres they want to hear, and look for them in any location across the globe. Aside from previewing music on an artist's profile, users can create Spotify playlists featuring the top songs from the artists in a selected city. Whether someone is curious about what Techno sounds like in Egypt, someone visiting Toronto who wants to catch live local talent, or an independent artists looking to connect with similar artists in a region they want to perform in, Bandmap is useful for casual listeners, music enthusiasts, artists, and industry workers.

### Technical Details

The artist data is on MongoDB and the ETL was built using a script that scrapes artists from Bandcamp's artist index. The `MapMaker` class is used to transform the data into a GeoJSON, which is then fetched using the API built with Django Rest Framework. That GeoJSON is what populates the MapBox map. The Spotify API is used to search for the artists in the selected city, find their top tracks, and add them to a playlist that users authorize to make. That function isn't always successful; there are many artists on Bandcamp and on Spotify who share the same name, but I use the genres listed on Bandcamp to find ones that match.