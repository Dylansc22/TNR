//---------------------------------------------------------------------------------------
// ------------------------------- Step 1: Create The Map -------------------------------
//---------------------------------------------------------------------------------------
// All parameter options such as attributionControl, minZoom, style, etc... are found here... https://docs.mapbox.com/mapbox-gl-js/api/#map

//Activate Mapbox Map
mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5jIiwiYSI6Im53UGgtaVEifQ.RJiPqXwEtCLTLl-Vmd1GWQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/dylanc/cjudqm16b1x3s1fmfjveo40q8',
    //style: 'mapbox://styles/dylanc/cjsfuwcf00fby1fpnt4n5iokq', // stylesheet location
    center: [-110.93182, 32.23156], 
    zoom: 12.826,
    pitch: 0,
    bearing: 0,
    attributionControl: false, // Removed default attribution and put custom attribution in below
    //maxBounds: [[-111.2,32], [-110.6, 32.5]], //Southwest & Northeast Bounds
    //pitch: 45,
    //bearing: 10,
});

//Add Custom Mapbox Controls for Bicycle Routing
var draw = new MapboxDraw({
  accessToken: mapboxgl.accessToken,
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

//Adds Mapbox Search Box
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
});

//Add User-Geolocate Button
var geolocate = new mapboxgl.GeolocateControl({
    accessToken: mapboxgl.accessToken,
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
})

//Add Zome & Rotation Controls 
var zoom = new mapboxgl.NavigationControl({
    accessToken: mapboxgl.accessToken,    
})

// Shrinks Attribution to a small hover icon for displays 640px or less
map.addControl(new mapboxgl.AttributionControl({
    compact: true,   
    }));
    

//document.getElementById('topRightControls').appendChild(geocoder.onAdd(map)); //Manually locate the draw tool inside the topRightControls DIV id
document.getElementById('topRightControls').appendChild(geolocate.onAdd(map)); //Manually locate the draw tool inside the topRightControls DIV id
document.getElementById('topRightControls').appendChild(draw.onAdd(map)); //Manually locate the draw tool inside the topRightControls DIV id
document.getElementById('topRightControls').appendChild(zoom.onAdd(map)); //Manually locate the draw tool inside the topRightControls DIV id


//Add Data layers so map isn't empty
map.on('load', function(){
  map.setLayoutProperty('tnr_main_inner', 'visibility', 'visible');
  map.setLayoutProperty('tnr_main_outer', 'visibility', 'visible');
  map.setLayoutProperty('hawkdotsgeojson', 'visibility', 'visible');
  map.setLayoutProperty('hawk_roads', 'visibility', 'visible');
  map.setLayoutProperty('hawkroadscase', 'visibility', 'visible');
});

// On every scroll event, check which element is on screen
window.onscroll = function() {
    var chapterNames = Object.keys(chapters);
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            myFunction();
            break;
            }
        }
    };

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

function removehighlight() {
    var mylist=document.getElementById("toolbar");
    var listitems= mylist.getElementsByTagName("button");
    for (i=0; i<listitems.length; i++) {
        listitems[i].setAttribute("class", "");
        }
    }


/*
//Return Map Coordinates, barring, and pitch on mouse move so 
map.on('mousemove', function (e) {
  var lngRounded =  (Math.round(100000*map.getCenter().lng)/100000);
  var latRounded = (Math.round(100000*map.getCenter().lat)/100000);
  document.getElementById('mapPosition').innerHTML =
  // e.point is the x, y coordinates of the mousemove event relative
  // to the top-left corner of the map
  // e.lngLat is the longitude, latitude geographical position of the event
  //'Lat/Long:' + JSON.stringify(e.lngLat) +
  'center: [' + lngRounded + ', ' + latRounded + '], ' +
  '<br/> zoom: ' + JSON.stringify(Math.round(1000*map.getZoom())/1000) + ',' +
  '<br/> pitch: ' + JSON.stringify(Math.round(1000*map.getPitch())/1000) + ',' +
   '<br/> bearing: ' + JSON.stringify(Math.round(1000*map.getBearing())/1000) + ',<br/>'
});
*/
//---------------------------------------------------------------------------------------
// -------------    Step 2: Add Data Layers And Toggle    -------------------------------
//---------------------------------------------------------------------------------------

//Toggle High Stress Road Network

toggleLayer('tnrv5',
    ['tnr_main_inner',
    'tnr_main_outer'
    //'tnr-v4-apmebo',
    //'tnr-v3-9wi26p',
    //'tnr-v2-06s5zd',
    //'tnr-v1-c7wnkt'
    ],
    'Safest Bicycle Streets'); //Button Name

toggleLayer('highstress',
    ['hs_main_inner', 
    'hs_main_outer'],
    'High Stress Roads');

//Toggle All LS Original Road Network
toggleLayer('lowstress',
    ['ls_main_inner', 
    'ls_main_outer'], 'Low Stress Roads');

toggleLayer('hawks',
    ['hawkdotsgeojson', 
    'hawk_roads',
    'hawkroadscase'],
    'Signalled Crosswalks');

toggleLayer('osmbikes',
    ['osm-bicycleinfras-5z6khj', 
    //'hs_main_inner'
    ],
    'City Bicycle Lanes'); //Button Name

toggleLayer('theloop', ['theloop-b2gq5f'], 'The Loop Pedestrian Path');

toggleLayer ('satellite', 
  ['mapbox-satellite', 
  'hawkdotsgeojson 1', 
  'hawkroadscase 1', 
  'tnr_main_outer 1'], 'Satallite Baselayer');

//Toggle Annotation
toggleLayer('annotation',
    ['country-label',
    'state-label', 
    'settlement-label', 
    'settlement-subdivision-label', 
    'airport-label', 
    'poi-label', 
    'water-point-label', 
    'water-line-label', 
    'natural-point-label', 
    'natural-line-label', 
    'waterway-label', 
    'road-label'], 
    'Annotation'); //Button Name


function toggleLayer(htmlID, ids, name) {
    var link = document.createElement('button');
    link.setAttribute('id', htmlID);
    link.href = '#';
    link.className = '';
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
    var layers = document.getElementById('toolbar');
    layers.appendChild(link);
}

document.getElementById('tnrv5').setAttribute('class', 'active');        
        document.getElementById('hawks').setAttribute('class', 'active');        
        //document.getElementById('osmbikes').setAttribute('class', 'active');        
        document.getElementById('theloop').setAttribute('class', 'active');      

/* http://stackoverflow.com/a/14438954/1934
  function uniques(value, index, self) {
    return self.indexOf(value) === index;
  }
  */

//Enable Toggle Layers Button Behavior for Satellite Imagery Specifically since its a Mapbox Baselayer and not a Geojson
/*I dont think I need this anymore?
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
*/

//---------------------------------------------------------------------------------------
// --------------------------- Step 3: Create Custom Controls -----------------------------
//---------------------------------------------------------------------------------------



// add create, update, or delete actions
map.on('draw.create', updateRoute);
map.on('draw.update', updateRoute);
map.on('draw.delete', removeRoute);

// use the coordinates you just drew to make your directions request
var drawing = {}; 
function updateRoute() {
  //Add Nodecount
  removeRoute(); // overwrite any existing layers
  drawing = draw.getAll();
  var nodecount = draw.getAll().features[0].geometry.coordinates.length;
  var answer = document.getElementById('calculated-line');
  var lastFeature = drawing.features.length - 1;
  var coords = drawing.features[lastFeature].geometry.coordinates;
  console.log(JSON.parse(JSON.stringify(coords)));
  var newCoords = coords.join(';')
  getMatch(newCoords);

  //When people draw routes, there is a 25 node max, for returning a route, So I need to know (and return on screen) the node count 
  //Akso nodecount is a local variable only declared in updateRoute(), so the below line of code should only if still in updateRoute(), which is why i have it here 
  //document.getElementById("drawbox").innerHTML = "<h6>Nodes Used:" + nodecount +"</h6><p>Max 25 Nodes</p>";
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
   
    /*
    //Get Distance and Duration
    instructions.insertAdjacentHTML('beforeend', '<p>' +  'Distance: ' + distance.toFixed(2) + ' mi<br>Duration: ' + duration.toFixed(2) + ' mins<br>:');

    //Get Route Direction On Load Map
    steps.forEach(function(step){
        instructions.insertAdjacentHTML('beforeend', '<p>' + step.maneuver.instruction + '</p>')
    });

    */


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
        "line-color": "#6d5cc2", //"#2c9952" Green, //3b9ddd //#FFC300 Yellow
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
        'text-color': '#6d5cc2',  //Yellow
        'text-halo-color': 'hsl(55, 11%, 96%)',
        'text-halo-width': 3
      }
    });
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
}

    //Convert the jsonResponse from a Json into a formatted string ready to be sent to a server
    //Returning the entire GeoJson
/*
    var output = JSON.stringify(TNRRoute, undefined, 2);
    document.getElementById("completegeojson").innerHTML = "<b>Geojson Output:</b> <br>" + output;
  */
  };


// remove the layer if it exists
function removeRoute () {
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeLayer('routearrows');
    map.removeSource('route');
    //instructions.innerHTML = '';
    //I think I can delete this since I added the above line recently document.getElementById('calculated-line').innerHTML = '';
  } else  {
        return;
  }
}

