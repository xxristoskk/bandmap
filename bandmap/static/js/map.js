currentLocation = JSON.parse(document.getElementById('loc').textContent)
spotify_token = JSON.parse(document.getElementById('sp_token').textContent)

function closeNav() {
    $('#sideFeats').css('width', '0');
    $('#map-container').css('left', '0');
    $('#topnav').css('display','none');
}

function authSpotify() {
  fetch('/spotify/auth')
      .then((response) => response.json())
      .then((data) => {
          window.location.replace(data.url)
      })
  
}

if (!navigator.geolocation) {
    console.error(`Your browser doesn't support Geolocation`);
};

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(saveLocation);
    } else {
        document.querySelector('#message').textContent = "Browser doesn't support Geolocation";
    }
};

function saveLocation(position) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    $.post({
      url: '',
      data: {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        csrfmiddlewaretoken: csrftoken
      },
    });
};

if (currentLocation.latitude == undefined || currentLocation.longitude == null) {
  getLocation();
}

mapboxgl.accessToken = JSON.parse(document.getElementById('token').textContent).token;
var initialZoom = 9;

// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map-container', // put the map in this container
  style: 'mapbox://styles/mapbox/dark-v10', // use this basemap
  center: [currentLocation.longitude, currentLocation.latitude], // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
}

// create the new map
var map = new mapboxgl.Map(initOptions);
const geojson = JSON.parse(document.getElementById('geojson').textContent);
// add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());


var circleRadius = ['step',['get','num_of_artists'],7,5,15,8,20,25,25,50,30,150,35];

// wait for the initial style to Load
map.on('style.load', function() {
  
  map.addSource('local-map', {
    type: 'geojson',
    data: geojson,
  });

  // let's make sure the source got added by logging the current map state to the console
  console.log(map.getStyle().sources);

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

  map.addSource('feature-highlight', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  map.addLayer({
    id: 'clusters-highlight',
    type: 'circle',
    source: 'feature-highlight',
    paint: {
      'circle-radius': circleRadius,
      'circle-color': '#8B2635',
      'circle-opacity': 0.7,
      'circle-stroke-color': '#536dfe',
      'circle-stroke-width': 2
    }
  });

  // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: 'popup'
  });

  map.on('click', 'clusters', function (e) {

    var features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
    });

    let selectedFeat = e.features[0];
    var artists = JSON.parse(selectedFeat.properties.artists);

    artist_html = `
    <div class='row'>
      <div class='col s6 left'>
        <h4 class='header white-text'>${selectedFeat.properties.city}</h4>
      </div>
      <div class='col s6 right'>
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      </div>
    </div>
    <div class='divider'></div><br>`
    
    builder = (artist) => {
      artist_html += `
      <div class='row valign-wrapper'>
        <div class='col s6'>
          <a href='${artist.bc_url}'>${artist.name}</a>
        </div>
        <div class='col s6'>
          <span class='right'>${artist.genre}</span>
        </div>
      </div>
      `
    };

    artists.forEach(builder);
    $('#artists').html(artist_html);
    $('#sideFeats').css('width', '300px');
    $('#map-container').css('left', '300px');

  });

  // listen for the mouse moving over the map and react when the cursor is over our data
  map.on('mouseenter','clusters', function (e) {

    // query for the features under the mouse, but only in the lots layer
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
    });

    map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

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

    map.getSource('feature-highlight').setData(selectedFeat);
    popup.setLngLat(coordinates).setHTML(popup_html).addTo(map);

  });

  map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = '';
    popup.remove();
    // reset the highlight source to an empty featurecollection
    map.getSource('feature-highlight').setData({
      type: 'FeatureCollection',
      features: []
    });
  });
    
});