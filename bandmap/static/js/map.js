/*
TABLE OF CONTENTS:
1a. LOCATION INITIALIZATION
2a. OPTIONS INITIALIZATION
3a. MENU BUTTON EVENTS
4a. MAP INITIALIZATION
5a. MAP EVENTS
*/


// 1a

// MATERIALIZE CHIPS
genres = [
  'electronic', 
  'experimental', 
  'rock', 
  'alternative', 
  'hip-hop/rap', 
  'ambient', 
  'metal', 
  'punk', 
  'indie', 
  'noise', 
  'techno', 
  'indie rock', 
  'pop', 
  'instrumental', 
  'hip hop', 
  'drone', 
  'rap', 
  'folk', 
  'acoustic', 
  'house', 
  'electronica', 
  'psychedelic', 
  'singer-songwriter', 
  'hardcore', 
  'lo-fi', 
  'dark ambient', 
  'industrial', 
  'jazz', 
  'alternative rock', 
  'hip-hop', 
  'indie pop', 
  'experimental electronic', 
  'world', 
  'beats', 
  'electro', 
  'lofi', 
  'black metal', 
  'soundtrack', 
  'post-punk', 
  'post-rock', 
  'deep house', 
  'punk rock', 
  'soul', 
  'shoegaze', 
  'downtempo', 
  'death metal', 
  'funk', 
  'dance', 
  'minimal', 
  'avant-garde', 
  'idm', 
  'improvisation', 
  'vaporwave', 
  'synthwave', 
  'blues', 
  'progressive', 
  'drum & bass', 
  'emo', 
  'dub', 
  'synthpop', 
  'indie folk', 
  'trap', 
  'synth', 
  'underground hip hop', 
  'r&b', 
  'underground', 
  'folk rock', 
  'garage', 
  'piano', 
  'instrumental hip-hop', 
  'ambient electronic', 
  'dubstep', 
  'electronic music', 
  'tech house', 
  'americana', 
  'chillout', 
  'pop rock', 
  'guitar', 
  'harsh noise', 
  'chill', 
  'soundscape', 
  'classical', 
  'progressive rock', 
  'hardcore punk', 
  'psychedelic rock', 
  'pop punk', 
  'atmospheric', 
  'grunge', 
  'garage rock', 
  'edm', 
  'psytrance', 
  'dream pop', 
  'trance', 
  'hard rock', 
  'reggae', 
  'country', 
  'hiphop', 
  'grindcore', 
  'bass', 
  'diy', 
  'trip hop', 
  'doom', 
  'devotional', 
  'noise rock', 
  'darkwave', 
  'glitch', 
  'acid', 
  'new wave', 
  'experimental rock', 
  'post-hardcore', 
  'dark', 
  'r&b/soul', 
  'heavy metal', 
  'experiemental', 
  'new age', 
  'thrash metal', 
  'spoken word', 
  'sound art', 
  'field recordings', 
  'doom metal', 
  'disco', 
  'electroacoustic', 
  'breakbeat', 
  'jungle', 
  'world music', 
  'free jazz', 
  'meditation', 
  'cinematic', 
  'metalcore', 
  'rock & roll', 
  'chiptune', 
  'progressive metal', 
  'breaks', 
  'chillwave', 
  'bedroom pop', 
  'acoustic guitar', 
  'orchestral', 
  'boom bap', 
  'fusion', 
  'music', 
  'stoner rock', 
  'drone ambient', 
  'instrumentals', 
  'black-bandcamp', 
  'musique concrete', 
  'blues rock', 
  'alternative pop', 
  'power pop', 
  'comedy', 
  'electropop', 
  'soundscapes', 
  'sludge', 
  'alt-country', 
  'bass music', 
  'free improvisation', 
  'abstract', 
  'roots', 
  'melodic', 
  'deep', 
  'goth', 
  'art rock', 
  'breakcore', 
  'contemporary', 
  'space', 
  'math rock', 
  'progressive house', 
  'power electronics', 
  'harsh noise wall', 
  'stoner', 
  'ebm', 
  'dungeon synth', 
  'rave', 
  'latin', 
  'experimental hip-hop', 
  'live', 
  'psych', 
  'folk punk', 
  'poetry', 
  'space rock', 
  'retrowave', 
  'drum and bass', 
  'garage punk', 
  'krautrock', 
  'dub techno', 
  'psychedelic trance', 
  'alternative hip-hop', 
  'remix', 
  '', 
  'techno.', 
  'improv', 
  'minimalism', 
  'independent', 
  'plunderphonics', 
  'improvised music', 
  'minimal techno', 
  'surf', 
  'dnb', 
  'gothic', 
  'hip hop instrumentals', 
  'ska', 
  '80s', 
  'samples', 
  'bedroom', 
  'modern classical', 
  'deep techno', 
  'beat tape', 
  'synthesizer', 
  'post-metal', 
  'rock and roll', 
  'weird', 
  'atmospheric black metal', 
  'christian', 
  'screamo', 
  'spiritual', 
  'nu disco', 
  'synth pop', 
  'folk pop', 
  'house music', 
  'prog', 
  'avant garde', 
  'experimental pop', 
  'avantgarde', 
  'crust', 
  'film music', 
  'acoustic rock', 
  'groove', 
  'horror', 
  'songwriter', 
  'underground rap', 
  'thrash', 
  'contemporary classical', 
  'field recording', 
  'boombap', 
  'powerviolence', 
  'neo-soul', 
  'loops', 
  'hard techno', 
  'video game', 
  'video game music', 
  'prog rock', 
  'classic rock', 
  'dreampop', 
  'noise pop', 
  'improvised', 
  'female vocals', 
  'grime', 
  'minimalist', 
  'rnb', 
  'neoclassical', 
  'tokyo, japan', 
  'heavy', 
  'kids', 
  'retro', 
  'chillhop', 
  'drums', 
  'deathcore', 
  'jam', 
  'post rock', 
  'instrumental rock', 
  'vocal', 
  'cassette', 
  'noisecore', 
  'tape', 
  'lounge', 
  'dance music', 
  'jazzy', 
  'jazz fusion', 
  'rap & hip-hop', 
  'raw black metal', 
  'sad', 
  'indiepop', 
  'jazz and improvised music', 
  'sample-based', 
  'hnw', 
  'leftfield', 
  'heavy rock', 
  'love', 
  'soulful', 
  'analog', 
  'melodic hardcore', 
  'future bass', 
  'stoner metal', 
  'cyberpunk', 
  'space music', 
  'free', 
  'sound collage', 
  'surf rock', 
  'industrial techno', 
  'dancehall', 
  'post punk', 
  'deep tech', 
  'holland', 
  'funky', 
  'neo-classical', 
  'sludge metal', 
  'meditative', 
  'christmas', 
  'art', 
  'bluegrass', 
  'djent', 
  'microhouse', 
  'witch house', 
  'grind', 
  'swing', 
  'club', 
  'progressive trance', 
  'triphop', 
  'melodic death metal', 
  'future funk', 
  'gospel', 
  'easy listening', 
  'footwork', 
  'punkrock', 
  "rock'n roll", 
  'coldwave', 
  'relaxation', 
  'piano solo', 
  'tribal', 
  'chill out', 
  'relaxing', 
  'rock n roll', 
  'beat', 
  'glitch hop', 
  'post-industrial', 
  'modular', 
  'dreamy', 
  'punk hardcore', 
  'traditional', 
  'ambient rock', 
  'postrock',
  ]

  const genre_data = {}

  genres.forEach(function(genre) {
  genre_data[genre] = null
  })

  const autoOptions = {
  data: genre_data
  }

  document.addEventListener('DOMContentLoaded', function() {
      var elem = document.querySelector('.chips');
      var instances = M.Chips.init(
          elem,
          options={
            limit: 2,
            autocompleteOptions: autoOptions,
            placeholder: 'Enter a genre'})
    })

// INITIALIZE LOCATION
first_visit = JSON.parse(document.getElementById('first_visit').textContent)

if (first_visit) {
  document.querySelector('.popup-intro').classList.add('activate')
  document.querySelector('.popup-intro-content').classList.add('activate')
  document.querySelector('#save-data').addEventListener('click', function() {
    var chipsInput = M.Chips.getInstance(document.querySelector('.chips'))
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
    var user_location = document.querySelector('#location').value

    console.log(chipsInput)
    console.log(chipsInput.chipsData)

    var optionsData = {
      location: user_location,
      genres: chipsInput.chipsData
    }

    document.querySelector(".preload").classList.add('activate')

    fetch('',{
      method: 'POST',
      body: JSON.stringify(optionsData),
      headers: {'X-CSRFToken': csrftoken, 'content-type':'application/json'}
    })
    .then(data => {
      if (data.status == '200') {
        location.reload()
        document.querySelector(".preload").classList.remove('activate')
      }
    })
  })
} else {
  currentLocation = JSON.parse(document.getElementById('loc').textContent)
}


// 2a
/* MENU BUTTONS */

// toggle new searchbar
document.querySelector('#addSearch').addEventListener('click', function() {
  if (map.hasControl(searchBar)) {
    map.removeControl(searchBar)
  } else {
    map.addControl(searchBar)
  }
})

// POPULATE NEW MAP FROM NEW LOCATION
document.querySelector('#newLocation').addEventListener('click', function() {

  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  let newCenter = map.getCenter();
  const data = {'new_location': newCenter}
  document.querySelector(".preload").classList.add('activate')

  fetch('new_location/',{
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'X-CSRFToken': csrftoken, 'content-type': 'application/json'}
  })
  .then(data => {
    if (data.status == '200') {
      setTimeout(function() {
        document.querySelector(".preload").classList.remove('activate')
        location.reload()
      }, 700);
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

// check local storage for saved map style
if (!(localStorage.getItem('mapStyle'))) {
  localStorage.setItem('mapStyle', 'mapbox://styles/mapbox/dark-v10')
  var mapStyle = localStorage.getItem('mapStyle')
  optionDark.setAttribute('selected','selected')
  optionLight.removeAttribute('selected','selected')
} else {
  var mapStyle = localStorage.getItem('mapStyle')
}

if (document.body.contains(optionLight) || document.body.contains(optionDark)){
  // make sure the current style is the default selection
  if (mapStyle == 'mapbox://styles/mapbox/light-v10') {
    optionLight.setAttribute('selected','selected')
    optionDark.removeAttribute('selected','selected')
  } else {
    optionLight.removeAttribute('selected','selected')
    optionDark.setAttribute('selected','selected')
  }
}

// OPTIONS (genre filter, mode, styles)
if (document.body.contains(document.querySelector('#options'))) {

  // saving the changes
  document.querySelector('#options').addEventListener('click', function() {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
    var chipsInstance = M.Chips.getInstance(document.querySelector('.chips'))
    var optionsData = {
      location: currentLocation,
      genres: chipsInstance.chipsData
    }
    document.querySelector(".preload").classList.add('activate')


    fetch('',{
      method: 'POST',
      body: JSON.stringify(optionsData),
      headers: {'X-CSRFToken': csrftoken, 'content-type':'application/json'}
    })
    .then(data => {
      if (data.status == '200') {
        location.reload()
        document.querySelector(".preload").classList.remove('activate')
      }
    })
  })
}

// INITIALIZE MAPBOX OPTIONS
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

    /* CREATE SPOTIFY PLAYLIST */
    function successPlaylist() {
      document.querySelector('.popup-success').classList.add('activate')
      setTimeout(function(){document.querySelector('.popup-success.activate').classList.remove('activate')}, 2000)
    }

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
        <div class='col s6'><p>Common Genres:</p></div>
        <div class='col s6'><span class='primary'>${selectedFeat.properties.top_genres}</span></div>
      </div>
    `
    // ARTIST FEATURES
    artist_html = ``

    // this function constructs the side panel based on the map mode
    builder = (artist) => {

      // discovery will look for the latest releases and display a player to preview artists
      if (artist.latest_release) {

        // checks to see if the release is a track or album
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

      // if the artist doesn't have a release ID then no player is shown
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
        /*
          THIS NEEDS TO BE CHANGED FROM A COLLAPSIBLE TO SIMPLE ROWS + 2 COLUMNS (name/link & genre)
          in this mode, there is no genre filter, which means there are thousands of artists in the GeoJSON file.
          to make this mode run more smoothly (and to keep from making thousands of requests to bandcamp for the preview players),
          the previews are not included.
        */
    }
    artists.forEach(builder)

    // OPEN SIDENAV
    document.querySelector('#city').innerHTML = city_html
    document.querySelector('#artists').innerHTML = artist_html
    document.querySelector('#cityStats').innerHTML = city_stats
    document.querySelector('#sideFeats').style.width = '300px'
    document.querySelector('#map-container').style.left = '300px'

  })

  // listen for the mouse moving over the map and react when the cursor is over our data
  map.on('mouseenter','clusters', function (e) {

    // query for the features under the mouse, but only in the lots layer
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
    })

    map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

    // coords and feats for popup and sidebar info
    var coordinates = features[0].geometry.coordinates.slice()
    let selectedFeat = e.features[0]

    let popup_html = `
      <div class='popup-feature'>
        <div class='popup-header'>
          <h4>${selectedFeat.properties.city}</h4><span class='artist-count'>${selectedFeat.properties.num_of_artists} artists</span>
        </div>
        <div class='custom-content'>
          Most Common Genres:
        </div>
        <div class='top-genres'><span class='primary'><em>${selectedFeat.properties.top_genres}</em></span></div>
      </div>
    `

    // filling in the empty source for the highlighted city
    map.getSource('feature-highlight').setData(selectedFeat);

    // popup for hovering over city
    popup.setLngLat(coordinates).setHTML(popup_html).addTo(map);
  })


  map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = ''
    // popup.remove();

    // reset the highlight source to an empty featurecollection
    map.getSource('feature-highlight').setData({
      type: 'FeatureCollection',
      features: []
    })
  })
})