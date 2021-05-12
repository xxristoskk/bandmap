/*
TABLE OF CONTENTS:
1a. LOCATION INITIALIZATION
2a. BUTTON EVENTS
3a. MAP
4a. MAP EVENTS
*/

// 1a
// INITIALIZE LOCATION FROM COOKIES
currentLocation = JSON.parse(document.getElementById('loc').textContent)

// CHECK FOR GEOLOCATION API
if (!navigator.geolocation) {
  console.error(`Your browser doesn't support Geolocation`)
};

// LOCATION FUNCTIONS
function getLocation() {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(saveLocation)
} else {
  document.querySelector('#message').textContent = "Browser doesn't support Geolocation";
  }
};
function saveLocation(position) {
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  const data = {
    'longitude': position.coords.longitude,
    'latitude': position.coords.latitude,
  }

  fetch('save_location/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'X-CSRFToken': csrftoken, 'content-type':'application/json'}
  })
  .then(data => {
    if (data.status == '200' && currentLocation == null) {
      setTimeout(function(){
        document.querySelector('.popup-intro').classList.add('activate')
        document.querySelector('.popup-intro-content').classList.add('activate')

        // button to start app
        document.querySelector('#myLocation').addEventListener('click', function() {
          location.reload()
        })
      }, 500);
    }
  })
};

// CALL LOCATION FUNCTIONS IF NONE IN COOKIES
if (currentLocation.latitude == null) {
  getLocation()
}

// 2a
/* BUTTONS */
// toggle new searchbar
document.querySelector('#addSearch').addEventListener('click', function() {
  if (map.hasControl(searchBar)) {
    map.removeControl(searchBar)
  } else {
    map.addControl(searchBar)
  }
})

// POPULATE NEW LOCATION
document.querySelector('#newLocation').addEventListener('click', function() {
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  let newCenter = map.getCenter();
  const data = {'new_location': newCenter}

  fetch('new_location/',{
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'X-CSRFToken': csrftoken, 'content-type': 'application/json'}
  })
  .then(data => {
    if (data.status == '200') {
      setTimeout(function(){location.reload()}, 700);
    }
  })
});

// AUTHORIZE SPOTIFY
if (document.body.contains(document.querySelector('#spotifyAuth'))) {
  document.querySelector('#spotifyAuth').addEventListener('click', function() {
    fetch('spotify/auth/')
      .then((response) => response.json())
      .then((data) => {
          window.location.replace(data.url,"_blank");
    });
  })
}

// 3a
/* MAP SETUP */
var optionDark = document.querySelector("[value='mapbox://styles/mapbox/dark-v10']")
var optionLight = document.querySelector("[value='mapbox://styles/mapbox/light-v10']")
if (!(localStorage.getItem('mapStyle'))) {
  localStorage.setItem('mapStyle', 'mapbox://styles/mapbox/dark-v10')
  var mapStyle = localStorage.getItem('mapStyle')
} else {
  var mapStyle = localStorage.getItem('mapStyle')
}

// INITIALIZE MAP OPTIONS
mapboxgl.accessToken = JSON.parse(document.getElementById('token').textContent).token;
var initialZoom = 9;
var initialCenter = [currentLocation.longitude, currentLocation.latitude]

// DARK OR LIGHT STYLES
if (document.body.contains(document.getElementById('changeStyle'))) {
  document.getElementById('changeStyle').addEventListener('change', function(e) {
    localStorage.setItem('mapStyle', e.target.value)
    if (e.target.value == 'mapbox://styles/mapbox/dark-v10') {
      optionDark.setAttribute('selected','selected')
      optionLight.removeAttribute('selected','selected')
    } else {
      optionLight.setAttribute('selected','selected')
      optionDark.setAttribute('selected','selected')
    }
    location.reload()
  })
}

/* CREATING NEW MAP */
var initOptions = {
  container: 'map-container',
  style: mapStyle,
  center: initialCenter,
  zoom: initialZoom,
}
var map = new mapboxgl.Map(initOptions);
const geojson = JSON.parse(document.getElementById('geojson').textContent);


/* MAPBOX CONTROLS */

// ZOOM
map.addControl(new mapboxgl.NavigationControl());

// SEARCH
let searchBar = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
})

/* MAP STYLING */
var circleRadius = ['step',['get','num_of_artists'],7,5,15,8,20,25,25,50,30,150,35];

// wait for the initial style to Load
map.on('style.load', function() {

  map.addSource('local-map', {
    type: 'geojson',
    data: geojson,
  });

  // INITIAL LAYER
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'local-map',
    filter: ['has', 'num_of_artists'],
    paint: {
      'circle-radius': circleRadius,
      'circle-color': '#536dfe',
      'circle-opacity': 0.7,
    }
  });
  // ADD GEOJSON TO MAP
  map.addSource('feature-highlight', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  // HOVERED LAYER
  map.addLayer({
    id: 'clusters-highlight',
    type: 'circle',
    source: 'feature-highlight',
    paint: {
      'circle-radius': circleRadius,
      'circle-color': '#000066',
      'circle-opacity': 0.4,
      'circle-stroke-color': '#9a4755',
      'circle-stroke-width': 2
    }
  });

  // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true,
    className: 'mapbox-custom-popup'
  });

  // 4a
  /* MAP EVENTS */
  map.on('click', 'clusters', function (e) {
    if (popup) {
      popup.remove();
    }

    var features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
    });
    
    // properties fo selected feature
    let selectedFeat = e.features[0]

    // parse embedded json object
    var artists = JSON.parse(selectedFeat.properties.artists);

    // sort selected artists to search spotify
    sortedArtists = []
    artists.forEach(function(artist) {
      sortedArtists.push({'name': artist.name})
    })

    function successPlaylist() {
      document.querySelector('.popup-success').classList.add('activate')
      setTimeout(function(){document.querySelector('.popup-success.activate').classList.remove('activate')}, 2000)
    }

    /* CREATE SPOTIFY PLAYLIST */
    if (document.body.contains(document.querySelector('#createPlaylist'))) {
      document.getElementById('createPlaylist').addEventListener('click', function() {
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
        const data = {'artists': artists, 'city': selectedFeat.properties.city}

        fetch('spotify/selected_artists/', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {'X-CSRFToken': csrftoken, 'content-type': 'application/json'}
          })
        .then(data => {if (data.status == '200') {successPlaylist()}})
      })
    }

    /* CITY DETAILS */
    city_html = `
    <div class='row'>
      <div class='col s6 left'>
        <h4 class='header' style='color: #ff5c5c;;'>${selectedFeat.properties.city}</h4>
      </div>
      <div class='col s6 right'>
        <a href="javascript:void(0)" style='color: #536dfe;' class="closebtn" onclick="closeNav()">&times;</a>
      </div>
    </div>
    `
    city_stats = `
      <div class='row valign-wrapper'>
        <div class='col s6'><p>Number of Artists:</p></div>
        <div class='col s6'><span style='color: #ff5c5c;'>${selectedFeat.properties.num_of_artists}</span></div>
      </div>
      <div class='row valign-wrapper'>
        <div class='col s6'><p>Popular Genres:</p></div>
        <div class='col s6'><span class='primary'>${selectedFeat.properties.top_genres}</span></div>
      </div>
    `
    // ARTIST FEATURES
    artist_html = ``
    builder = (artist) => {
      if (artist.latest_release) {
        if (artist.latest_release.type == 'track') {
          artist_html += `
          <li>
            <div class='collapsible-header'><h6>${artist.name}</h6></div>
            <div class='collapsible-body'>
              <div class='row right-align'>
                <a href='${artist.bc_url}' target="_blank" rel="noopener noreferrer">Bandcamp Page</a>
              </div>
              <div class='row'>
              <div class='col s6 left-align' style='color: white;'>Genre:</div>
                <div class='col s6 right-align'><span class='primary'>${artist.genre}</span></div>
              </div>
              <div class='row valign-wrapper' style='margin-left: -60px; margin-right: -30px;'>
                <iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/track=${artist.latest_release.id}/size=small/bgcol=333333//linkcol=536dfe/transparent=true/" seamless></iframe>
              </div>
            </div>
          </li>
          `
        } else if (artist.latest_release.type == 'album') {
          artist_html += `
          <li>
            <div class='collapsible-header'><h6>${artist.name}</h6></div>
            <div class='collapsible-body'>
            <div class='row right-align'>
              <a href='${artist.bc_url}' target="_blank" rel="noopener noreferrer">Bandcamp Page</a>
            </div>
            <div class='row'>
              <div class='col s6 left-align' style='color: white;'>Genre:</div>
              <div class='col s6 right-align'><span class='primary'>${artist.genre}</span></div>
            </div>
              <div class='row valign-wrapper' style='margin-left: -60px; margin-right: -30px;'>
                <iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=${artist.latest_release.id}/size=small/bgcol=333333/linkcol=536dfe/transparent=true/" seamless></iframe>
              </div>
            </div>
          </li>
          `
        }
      } else {
          artist_html += `
          <li>
            <div class='collapsible-header'><h6>${artist.name}</h6></div>
            <div class='collapsible-body'>
            <div class='row right-align'>
              <a href='${artist.bc_url}' target="_blank" rel="noopener noreferrer">Bandcamp Page</a>
            </div>
            <div class='row'>
              <div class='col s6 left-align' style='color: white;'>Genre:</div>
              <div class='col s6 right-align'><span class='primary'>${artist.genre}</span></div>
            </div>
            </div>
          </li>
          `
      }
    };
    artists.forEach(builder);

    // PAGINATION
    function paginate() {
      pageSize = 25
      totalPages = getNumberOfPages()
      for (i=1; i <= totalPages; i++) {

      }
    }
    function getNumberOfPages() {
      return Math.ceil(artists.length / 25)
    }

    // OPEN SIDENAV
    document.querySelector('#city').innerHTML = city_html
    document.querySelector('#artists').innerHTML = artist_html
    document.querySelector('#cityStats').innerHTML = city_stats
    document.querySelector('#sideFeats').style.width = '300px'
    document.querySelector('#map-container').style.left = '300px'

  });

  // listen for the mouse moving over the map and react when the cursor is over our data
  map.on('mouseenter','clusters', function (e) {

    // query for the features under the mouse, but only in the lots layer
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
    });

    map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

    // coords and feats for popup and sidebar info
    var coordinates = features[0].geometry.coordinates.slice();
    let selectedFeat = e.features[0];
    
    let popup_html = `
      <div class='popup-feature'>
        <div class='popup-header'>
          <h4>${selectedFeat.properties.city}</h4><span class='artist-count'>${selectedFeat.properties.num_of_artists} artists</span>
        </div>
        <div class='custom-content'>
          Most Popular Genres:
        </div>
        <div class='top-genres'><span class='primary'><em>${selectedFeat.properties.top_genres}</em></span></div>
      </div>
    `;

    // filling in the empty source for the highlighted city
    map.getSource('feature-highlight').setData(selectedFeat);

    // popup for hovering over city
    popup.setLngLat(coordinates).setHTML(popup_html).addTo(map);
  });

  
  map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = '';
    // popup.remove();

    // reset the highlight source to an empty featurecollection
    map.getSource('feature-highlight').setData({
      type: 'FeatureCollection',
      features: []
    });
  }); 
});