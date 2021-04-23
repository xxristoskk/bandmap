function closeNav() {
  $('#sideFeats').css('width', '0');
  $('#map-container').css('left', '0');
}

currentLocation = JSON.parse(document.getElementById('loc').textContent);

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
    url: 'save_location/',
    data: {
        'longitude': position.coords.longitude,
        'latitude': position.coords.latitude,
        'csrfmiddlewaretoken': csrftoken
    },
  });
  setTimeout(function(){location.reload()}, 1500);
};

console.log(currentLocation)

if (currentLocation.latitude == null) {
  getLocation()
}



mapboxgl.accessToken = JSON.parse(document.getElementById('token').textContent).token;
var initialZoom = 9;
var initialCenter = [currentLocation.longitude, currentLocation.latitude]

// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map-container', // put the map in this container
  style: 'mapbox://styles/mapbox/dark-v10', // use this basemap
  center: initialCenter, // initial view center
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
  
  // adding and removing geocoder search bar
  let searchBar = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  })

  // toggle new searchbar
  $('#addSearch').click(function() {
    if (map.hasControl(searchBar)) {
      map.removeControl(searchBar)
    } else {
      map.addControl(searchBar)
    }
  })

  // gets the center of the new location and sends it back to populate a new map
  $('#newLocation').click(function() {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let newCenter = map.getCenter();
    console.log(newCenter)
    $.post({
      url: 'new_location/',
      data: {'new_location': newCenter, 'csrfmiddlewaretoken': csrftoken},
      })
    setTimeout(function(){location.reload()}, 1500);
  });

  // button to get auth url and send the user to the auth page
  $('#spotifyAuth').click(function() {
    fetch('spotify/auth/')
      .then((response) => response.json())
      .then((data) => {
          window.location.replace(data.url,"_blank");
    });
  })

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
    
    // properties fo selected feature
    let selectedFeat = e.features[0];
    // parse embedded json object
    var artists = JSON.parse(selectedFeat.properties.artists);

    // sort selected artists to search spotify
    sortedArtists = []
    artists.forEach(function(artist) {
      sortedArtists.push({'name': artist.name})
    })

    // sends back the selected artists to make a playlist
    $('#createPlaylist').click(function() {
      const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      $.post({
        url: 'spotify/selected_artists/',
        data: {'artists': sortedArtists, 'city': selectedFeat.properties.city, 'csrfmiddlewaretoken': csrftoken},
        // success: function() {
        //   $('#success').addClass('activate')
        // }
      })
    });

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
          <a href='${artist.bc_url}' target="_blank" rel="noopener noreferrer">${artist.name}</a>
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