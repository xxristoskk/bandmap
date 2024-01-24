# Welcome to [BandMap](https://bandmapv2.herokuapp.com/)

### Update 12-14-23 to-do list
- Improve UI with React framework
- Allow for multiple genres to be queried by creating an array model
- Break up map.js into smaller javascript files
- Create a button to toggle between light and dark modes

## A way to explore Bandcamp on a map

BandMap allows users to explore independent artists based on geographic location and genres. You can search what genres you're interested in, and what region you want to explore. The results appear on a map with markers that represent each city, and the markers list all of the artists in that city. From there, you can previewing music and/or go to the artist's BandCamp page to listen to their catelog. If there are just too many artists in the city, you can also save a spotify playlist containing all of their music.

### Technical Details

The artist data is on MongoDB and the ETL was built using a script that scrapes artists from Bandcamp's artist index. The `MapMaker` class is used to transform the data into a GeoJSON, which is then fetched using the API built with Django Rest Framework. That GeoJSON is what populates the MapBox map. The Spotify API is used to search for the artists in the selected city, find their top tracks, and add them to a playlist that users authorize to make. That function isn't always successful; there are many artists on Bandcamp and on Spotify who share the same name, but I use the genres listed on Bandcamp to narrow the matches. Sometimes an artist on Bandcamp do not have their music on Spotify.