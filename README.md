# Welcome to BandMap

## A way to explore Bandcamp on a map

On BandMap, each circle represents a city. The more artists there are in the city, the bigger the circle. Hovering over a city will let you know how many artists there are and which genres are most popular to make in that city (not based on listener habits).

In the `Help` tab you will find more details on what the menu buttons do. Go to `Settings` to filter genres, and choose the style of the map.

As of now, the app cannot be accessed in production. It also cannot run locally since the database and Spotify Dev credetentials are not provided. If you'd like to become a contributor, or would like a demo, feel free to reach out. 

### Technical Details

The artist data is on MongoDB and the ETL was built using the PyMongo wrapper. The `MapMaker` class is used to transform the data into a GeoJSON, which is then fetched using the API built with Django Rest Framework. The artists in a selected city are posted using the Django Rest Framework, and  `MakePlaylist` uses the Spotify API to build a playlist of those artists' top songs.
