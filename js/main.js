//---------------------------------------------------------------------------------------
// ------------------------------- Step 1: Create The Map -------------------------------
//---------------------------------------------------------------------------------------
// All parameter options such as attributionControl, minZoom, style, etc... are found here... https://docs.mapbox.com/mapbox-gl-js/api/#map

mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5jIiwiYSI6Im53UGgtaVEifQ.RJiPqXwEtCLTLl-Vmd1GWQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/dylanc/cjtc75i652sp41fqrckja69dq',
    //style: 'mapbox://styles/dylanc/cjsfuwcf00fby1fpnt4n5iokq', // stylesheet location
    center: [-110.926757, 35.215554 ], // starting position [lng, lat]
    zoom: 5, // starting zoom
    attributionControl: false, // Removed default attribution and put custom attribution in below
    //maxBounds: [[-111.2,32], [-110.6, 32.5]], //Southwest & Northeast Bounds
    //pitch: 45,
    //bearing: 10,
});

map.on('load', function(){
    map.flyTo({
        center: [-110.932759,32.199656 ], // starting position [lng, lat]
        zoom: 12, //This should all be the same as the first var chapter 'tucson1' 
        pitch: 45,
        bearing: 10,
        speed: 0.4,
    });
});

map.on('mousemove', function (e) {
document.getElementById('info').innerHTML =
// e.point is the x, y coordinates of the mousemove event relative
// to the top-left corner of the map
JSON.stringify(e.point) + '<br />' +
// e.lngLat is the longitude, latitude geographical position of the event
JSON.stringify(e.lngLat);
});

var chapters = {
'tucson1': {
    center: [-110.932759,32.199656 ], // starting position [lng, lat]
        zoom: 12,
        pitch: 45,
        bearing: 10,
},
'baker': {
    bearing: 10,
    center: [-110.92357, 32.213554],
    zoom: 15,
    pitch: 45
},
'aldgate': {
    duration: 6000,
    center: [-110.907800,32.22162],
    bearing: -10,
    zoom: 14.5,
    pitch: 0
},
'london-bridge': {
    bearing: 20,
    center: [-110.929702,32.21926065],
    zoom: 12,
    speed: 0.6,
    pitch: 40
},
'woolwich': {
bearing: -10,
center: [-110.8880799,32.2150097],
zoom: 13.5,
speed: 0.3
},
'gloucester': {
    bearing: 15,
    center: [-110.9545, 32.2524],
    zoom: 15.3,
    pitch: 20,
    speed: 0.5
},
'caulfield-gardens': {
    bearing: -15,
    center: [-110.89, 32.21],
    zoom: 12.3
},
'telegraph': {
    bearing: 10,
    center: [-110.9747, 32.2226],
    zoom: 17.3,
    pitch: 40
},
'charing-cross': {
    bearing: 0,
    center: [-110.974, 32.2226],
    zoom: 14.3,
    pitch: 20
}
};
 
// On every scroll event, check which element is on screen
window.onscroll = function() {
var chapterNames = Object.keys(chapters);
for (var i = 0; i < chapterNames.length; i++) {
    var chapterName = chapterNames[i];
if (isElementOnScreen(chapterName)) {
    setActiveChapter(chapterName);
break;
}
}
};
 
var activeChapterName = 'tucson1';
function setActiveChapter(chapterName) {
if (chapterName === activeChapterName) return;
 
map.flyTo(chapters[chapterName]);
 
document.getElementById(chapterName).setAttribute('class', 'active');
document.getElementById(activeChapterName).setAttribute('class', '');
 
activeChapterName = chapterName;
}
 
function isElementOnScreen(id) {
var element = document.getElementById(id);
var bounds = element.getBoundingClientRect();
return bounds.top < window.innerHeight && bounds.bottom > 0;
}

//---------------------------------------------------------------------------------------
// --------------------------- Step 2: Add Data Layers  -----------------------------
//---------------------------------------------------------------------------------------

//Toggle Annotation
toggleLayer(
    ['country-label',
    'state-label', 
    'settlement-label', 
    'settlement-subdivision-label', 
    'airport-label', 
    'transit-label', 
    'poi-label', 
    'water-point-label', 
    'water-line-label', 
    'natural-point-label', 
    'natural-line-label', 
    'waterway-label', 
    'golf-hole-label', 
    'road-exit-shield', 
    'road-number-shield', 
    'road-label', 
    'building-number-label', 
    'contour-label'], 
    'Annotation'); //Button Name

//Toggle Standard Road Network
toggleLayer(
    ['road-oneway-arrow-white',
    'level-crossing', 
    'road-rail-tracks', 
    'road-rail', 
    'road-motorway-trunk', 
    'road-oneway-arrow-blue', 
    'road-primary', 
    'road-secondary-tertiary',
    'road-street', 
    'road-minor', 
    'road-polygon',
    'road-pedestrian-polygon-pattern', 
    'road-pedestrian-polygon-fill', 
    'road-pedestrian', 
    'road-major-link', 
    'road-steps', 
    'road-path-cycleway-piste', 
    'road-path-rough', 
    'road-path-smooth',
    'road-construction',
    'road-motorway-trunk-case',
    'road-major-link-case',
    'road-primary-case',
    'road-secondary-tertiary-case',
    'road-street-case',
    'road-minor-case',
    'road-street-low',
    'road-pedestrian-case',
    'road-steps-bg',
    'road-path-bg',
    'bridge-oneway-arrow-white',
    'bridge-motorway-trunk-2',
    'bridge-major-link-2',
    'bridge-motorway-trunk-2-case',
    'bridge-major-link-2-case',
    'bridge-rail-tracks',
    'bridge-rail',
    'bridge-motorway-trunk',
    'bridge-oneway-arrow-blue',
    'bridge-primary-secondary-tertiary',
    'bridge-street-minor',
    'bridge-pedestrian',
    'bridge-major-link',
    'bridge-steps',
    'bridge-path-cycleway-piste',
    'bridge-path-smooth-rough',
    'bridge-construction',
    'bridge-motorway-trunk-case',
    'bridge-major-link-case',
    'bridge-primary-secondary-tertiary-case',
    'bridge-street-minor-case',,
    'bridge-street-minor-low',
    'bridge-pedestrian-case',
    'bridge-steps-bg',
    'bridge-path-bg'], 
    'Standard Road Network'); //Button Name

//Toggle High Stress Road Network
toggleLayer(
    ['hs-do1x45'],
    'High Stress Road Network');

//Toggle All LS Original Road Network
toggleLayer(
    ['ls-790ous'], 'Low Stress Road Network');

toggleLayer(
    ['hawks-1sb3f4',
    'hawkroads-acywed'], 
    'Neighborhood Connections');

toggleLayer(
    ['tnr-v5-5pfsxq',
    //'tnr-v4-apmebo',
    //'tnr-v3-9wi26p',
    //'tnr-v2-06s5zd',
    //'tnr-v1-c7wnkt'
    ],
    'Recommended Bicycle Network'); //Button Name

toggleLayer(
    ['osm-bicycleinfras-5z6khj', 
    //'hs-do1x45 copy'
    ],
    'Recommended Bicycle Lanes'); //Button Name

function toggleLayer(ids, name) {
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = name;

    link.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        for (layers in ids){
            var visibility = map.getLayoutProperty(ids[layers], 'visibility');
            if (visibility === 'visible') {
                map.setLayoutProperty(ids[layers], 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(ids[layers], 'visibility', 'visible');
            }
         }
    };
    var layers = document.getElementById('menu');
    layers.appendChild(link);
}

//Add Separate Button For Toggling Individual Layers
map.on('load', function(){
    var switchy = document.getElementById('remover');
    switchy.addEventListener("click", function(){
        switchy = document.getElementById('remover');
        if (switchy.className === 'on') {
            switchy.setAttribute('class', 'off');
            map.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
            switchy.innerHTML = 'Add Satellite';
        } else {
            switchy.setAttribute('class', 'on');
            map.setLayoutProperty('mapbox-satellite', 'visibility', 'visible');
            switchy.innerHTML = 'Remove Satallite';
        }
    });
});

//---------------------------------------------------------------------------------------
// -------------    Step 3: Add Data Layers Toggle Button   -----------------------------
//---------------------------------------------------------------------------------------

/* Might Not Need this section any more?


Generate Menu of Button for Toggling Layers
var toggleableLayerIds = [ 'Signaled Crosswalks', 'Bicycle Infrastructure',  'Future Buttons Here' ]; //Add toggleable layer ids here
 
for (var i = 0; i < toggleableLayerIds.length; i++) {
var id = toggleableLayerIds[i];
 
var link = document.createElement('a');
link.href = '#';
link.className = 'active';
link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();
     
        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
     
        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };
     
    var layers = document.getElementById('menu');
    layers.appendChild(link);
    }
*/
//---------------------------------------------------------------------------------------
// --------------------------- Step 4: Create Custom Controls -----------------------------
//---------------------------------------------------------------------------------------

var draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    line_string: true,
    trash: true,
  },
  styles: [
    // For more info - Mapbox GL Style Spec - https://docs.mapbox.com/mapbox-gl-js/style-spec
    // ACTIVE (being drawn)
    // line stroke
    {
      "id": "gl-draw-line", // Required String - Unique layer name
      "type": "line", //Required types: fill, line, symbol, circle, heatmap, fill-extrusion, raster, hillshade, background)
      "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]], 
      "layout": { 
        "line-cap": "round", //e.g. butt (default), round, square
        "line-join": "round" //miter (default), bevel, round
      },
      "paint": { 
        "line-color": "#81A4CD", 
        "line-dasharray": [2, 4],
        "line-width": 2,
        "line-opacity": 0.7
        //line-translate
        //line-gap-width
        //line-gradient
        //etc...
      }
    },
    // vertex point halos - must come before vertex, because these are two layers of circles
    {
      "id": "gl-draw-polygon-and-line-vertex-halo-active",
      "type": "circle",
      "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      "paint": {
        "circle-radius": 8,
        "circle-color": "#FFF" 
      }
    },
    // vertex points
    {
      "id": "gl-draw-polygon-and-line-vertex-active",
      "type": "circle",
      "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      "paint": {
        "circle-radius": 5,
        "circle-color": "#3E7CB1", 
      }
    },
    // midpoint point halos
    {
      "id": "gl-draw-polygon-and-line-midpoint-halo-active",
      "type": "circle",
      "filter": ["all", ["==", "meta", "midpoint"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      "paint": {
        "circle-radius": 4,
        "circle-color": "#FFF" 
      }
    },
    // midpoint points
    {
        "id": "gl-draw-polygon-and-line-midpoint-active",
        "type": "circle",
        "filter": ["all", ["==", "meta", "midpoint"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
        "paint": {
            "circle-radius": 3,
            "circle-color": "#3E7CB1",
        }
    },
  ]
});

// add create, update, or delete actions
map.on('draw.create', updateRoute);
map.on('draw.update', updateRoute);
map.on('draw.delete', removeRoute);

// use the coordinates you just drew to make your directions request
function updateRoute() {
  removeRoute(); // overwrite any existing layers
  var data = draw.getAll();
  var answer = document.getElementById('calculated-line');
  var lastFeature = data.features.length - 1;
  var coords = data.features[lastFeature].geometry.coordinates;
  var newCoords = coords.join(';')
  getMatch(newCoords);
}

// make a directions request
function getMatch(e) {
  var url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + e +'?geometries=geojson&steps=true&&access_token=' + 'pk.eyJ1IjoiZHlsYW5jIiwiYSI6Im53UGgtaVEifQ.RJiPqXwEtCLTLl-Vmd1GWQ';
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.onload  = function() {
    var jsonResponse = req.response;
    var distance = jsonResponse.routes[0].distance*0.001*0.621371;
    var duration = jsonResponse.routes[0].duration/60;
    var steps = jsonResponse.routes[0].legs[0].steps;
    var coords = jsonResponse.routes[0].geometry;
   
    //Get Distance and Duration
    instructions.insertAdjacentHTML('beforeend', '<p>' +  'Distance: ' + distance.toFixed(2) + ' mi<br>Duration: ' + duration.toFixed(2) + ' minutes' + '</p>');

    //Get Route Direction On Load Map
    steps.forEach(function(step){
        instructions.insertAdjacentHTML('beforeend', '<p>' + step.maneuver.instruction + '</p>')
    });

    //Get Route Geojson Coordinates

    /*/Basic proof of concept
    var output = "Geojson Coordinates: <br>" + coords.coordinates[0] + '<br>' + coords.coordinates[1] + '<br>' + coords.coordinates[2];
    document.getElementById("htmlcoords").innerHTML = output; //Essentially Links your JS Variable to the HTML ID you want associated with it */


    //Convert the jsonResponse from a Json into a formatted string ready to be sent to a server
    /*Returning the entire GeoJson
    var textedJson = JSON.stringify(jsonResponse, undefined, 2);
    document.getElementById("completegeojson").innerHTML = textedJson;*/

    /*Returning just the coordinates
    var x='';
    for (i = 0; i < jsonResponse.routes[0].geometry.coordinates.length; i++) {
        x = x + "[" + jsonResponse.routes[0].geometry.coordinates[i] + "]" + "<br>";
    }
    document.getElementById("coordsonlyID").innerHTML = x;*/



    //Convert the jsonResponse from a Json into a formatted string ready to be sent to a server
    //Returning the entire GeoJson
    delete jsonResponse.waypoints;
    delete jsonResponse.code;
    delete jsonResponse.uuid;
    console.log(Object.getOwnPropertyNames(req));
    // expected output: Array ["a", "b", "c"]
    //var textedJson = JSON.stringify(jsonResponse, undefined, 2);
    //document.getElementById("completegeojson").innerHTML = textedJson;


    //Add The Route To The Map
    addRoute(coords);
  };


  req.send();
}

// adds the route as a layer on the map
function addRoute (coords) {
  // check if the route is already loaded
  if (map.getSource('route')) {
    map.removeLayer('route')
    map.removeSource('route')
  } else{
    map.addLayer({
      "id": "route",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": coords
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#FFC300", //"#2c9952" Green, //3b9ddd //#FFC300 Yellow
        "line-width": 4,
        "line-opacity": 0.8
      }
    }),

    //Add directional arrows to route
    map.addLayer({
      id: 'routearrows',
      type: 'symbol',
      source: 'route',
      layout: {
        'symbol-placement': 'line',
        'text-field': '▶',
        'text-size': {
          base: 2,
          stops: [[12, 24], [22, 60]]
        },
        'symbol-spacing': {
          base: 1,
          stops: [[12, 30], [22, 160]]
        },
        'text-keep-upright': false
      },
      paint: {
        'text-color': '#FFC300',  //Yellow
        'text-halo-color': 'hsl(55, 11%, 96%)',
        'text-halo-width': 3
      }
    });
  };

var TNRRoute = {
    "id": "TNR Route",
        "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": coords
                }
            ]
        };
    //Convert the jsonResponse from a Json into a formatted string ready to be sent to a server
    //Returning the entire GeoJson

    var output = JSON.stringify(TNRRoute, undefined, 2);
    document.getElementById("completegeojson").innerHTML = "<b>Geojson Output:</b> <br>" + output;
}




// remove the layer if it exists
function removeRoute () {
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeLayer('routearrows');
    map.removeSource('route');
    instructions.innerHTML = '';
    //I think I can delete this since I added the above line recently document.getElementById('calculated-line').innerHTML = '';
  } else  {
        return;
  }
}



//---------------------------------------------------------------------------------------
// --------------------------- Step 5: Add Custom Controls -----------------------------
//---------------------------------------------------------------------------------------


    /* No longer need regular driving directions
    //Adds driving directions to top-left corner
    map.addControl(new MapboxDirections({
        accessToken: 'pk.eyJ1IjoiZHlsYW5jIiwiYSI6Im53UGgtaVEifQ.RJiPqXwEtCLTLl-Vmd1GWQ' 
    }), 'top-right');
    */

    // Adds Mapbox Search Box
    map.addControl(new MapboxGeocoder({
        accessToken: 'pk.eyJ1IjoiZHlsYW5jIiwiYSI6Im53UGgtaVEifQ.RJiPqXwEtCLTLl-Vmd1GWQ' 
    }));

    // Add User-Geolocate to the map
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true
        }));

    // Add zoom and rotation controls to the map
    map.addControl(new mapboxgl.NavigationControl());

    // Add the draw tool to the map
    map.addControl(draw);

    // Shrinks Attribution to a small hover icon for displays 640px or less
    map.addControl(new mapboxgl.AttributionControl({
            compact: true,   
        }));


// The 'building' layer in the mapbox-streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', function() {
// Insert the layer beneath any symbol layer.
var layers = map.getStyle().layers;
 
var labelLayerId;
for (var i = 0; i < layers.length; i++) {
if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
labelLayerId = layers[i].id;
break;
}
}
 
map.addLayer({
'id': '3d-buildings',
'source': 'composite',
'source-layer': 'building',
'filter': ['==', 'extrude', 'true'],
'type': 'fill-extrusion',
'minzoom': 15,
'paint': {
'fill-extrusion-color': '#aaa',
 
// use an 'interpolate' expression to add a smooth transition effect to the
// buildings as the user zooms in
'fill-extrusion-height': [
"interpolate", ["linear"], ["zoom"],
15, 0,
15.05, ["get", "height"]
],
'fill-extrusion-base': [
"interpolate", ["linear"], ["zoom"],
15, 0,
15.05, ["get", "min_height"]
],
'fill-extrusion-opacity': .6
}
}, labelLayerId);
});
