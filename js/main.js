//---------------------------------------------------------------------------------------
// ---------------------------------- Create The Map ------------------------------------
//---------------------------------------------------------------------------------------
// All parameter options such as attributionControl, minZoom, style, etc... are found here... https://docs.mapbox.com/mapbox-gl-js/api/#map

mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5jIiwiYSI6Im53UGgtaVEifQ.RJiPqXwEtCLTLl-Vmd1GWQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/dylanc/ck911k4gg0rqu1ilnr0o0dk1m',
    center: [-110.926757, 35.215554 ], // starting position [lng, lat]
    zoom: 5, // starting zoom (0 = fully zoomed out, 22 = fully zoomed in)
    attributionControl: false, // Removed default attribution and put custom attribution in below to make it look nicer
    //maxBounds: [[-111.2,32], [-110.6, 32.5]], //Southwest & Northeast Bounds
    //pitch: 45, //Initial Pitch
    //bearing: 10, //Initial Bearing
});

//Add Mapbox Buttons & Controls 
var draw = new MapboxDraw({
  accessToken: mapboxgl.accessToken,
  displayControlsDefault: false,  //Default Draw show too many buttons I don't need (such as drawing a polygon), I only need a couple
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


map.on('load', function(){
    map.flyTo({
        center: [-110.932759,32.199656 ], // starting position [lng, lat]
        zoom: 12, //This should all be the same as the first var chapter 'tucson1' 
        pitch: 45,
        bearing: 10,
        speed: 0.3,
    });
});

/* Additional controls for mainroutingpage and functionality for main routing page
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

//These are the locations the map should fly when the user scrolls through the sidedeck. 
//Javascript chapter names must match the equivalent HTML ids
var chapters = {
'tucson1': { //This is mearly the reset position if i scroll to the top of the text
    center: [-110.932759,32.199656 ],
        zoom: 12,
        pitch: 45,
        bearing: 10,
    },
'bicycleinfrastructure': {
    center: [-110.90873, 32.1971], 
    zoom: 11.354,
    pitch: 46.98,
    bearing: 0,
    duration: 2000,
},
'accidents': {
    bearing: 10,
    center: [-110.9448, 32.2339],
    zoom: 13,
    pitch: 50,
    bearing: 25,
    duration: 2000,
},
'satallitebikelanes': {
    center: [-110.9438978,32.2353914],
    bearing: -24.8,
    zoom: 19.15,
    pitch: 56,
    duration: 3500,
    /*center: [-110.9255584,32.2361071], 
    bearing: -69.7,
    zoom: 19.435,
    pitch: 57,
    duration: 3500,*/
},
'highstressroads': {
    center: [-110.92102, 32.23629], 
    zoom: 13.6,
    pitch: 47,
    bearing: 18.4,
    duration: 3500,
},
'highstressroads2': {
    center: [-110.9102, 32.23429], 
    zoom: 13.6,
    pitch: 47,
    bearing: -12.4,
    duration: 5500,
},
/*'london-bridge': {
    bearing: 20,
    center: [-110.929702,32.21926065],
    zoom: 12,
    speed: 0.6,
    pitch: 40
},*/
'neighborhoodroads': {
bearing: -5,
center: [-110.926112,32.23569],
zoom: 13.5,
pitch: 23,
duration: 3000,
},
'traditionroutes': {
center: [-110.92912, 32.23123], 
zoom: 13,
pitch: 49,
bearing: 25.2,
duration: 3500,
},
/*
    center: [-110.9448, 32.2339],
    zoom: 13,
    pitch: 50,
    bearing: 25,
    duration: 3500,
},*/
/*'traditionroutes2': {
    bearing: 10,
    center: [-110.9448, 32.2339],
    zoom: 13,
    pitch: 50,
    bearing: 25,
    duration: 3500,
},*/
/*'deadendroads': {
center: [-110.92876, 32.23895], 
zoom: 14.156,
pitch: 19.406,
bearing: -10,
//speed: 0.3 
duration: 3000
},*/
'lowstressnetwork': {
    center: [-110.9195, 32.22924], 
    zoom: 12.54,
    pitch: 50,
    bearing: 0,
    duration: 6000,
},
'residentialsatallite': {
    bearing: -31,
    pitch: 56,
    center: [-110.929452,32.238657],
    zoom: 18.39,
    speed: 0.8,
},
'satallite': {
    bearing: -10,
    pitch: 60,
    center: [-110.9311202,32.2359678],
    zoom: 20.52,
    speed: 0.5,
},
'telegraph': {
    center: [-110.91999, 32.23657], 
    zoom: 12.7,
    pitch: 0,
    bearing: 0,
    duration: 4000,
}
};

var activeChapterName = 'tucson1';

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

//This is the meat-and-potatoes code that govern when the slide-deck layers show up 
//as you scroll forwards and backwards through the slide-deck. 
function myFunction() {
    if (activeChapterName === 'tucson1') {
        removehighlight();

        //Disable Pending Slides
        map.setLayoutProperty('theloop-b2gq5f', 'visibility', 'none');
        map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'none');
    } else 
    if (activeChapterName === 'bicycleinfrastructure') {
        removehighlight();        
        document.getElementById('theloop').setAttribute('class', 'active');
        document.getElementById('osmbikes').setAttribute('class', 'active');        

        //Enable Current Slides
        map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'visible');
        map.setLayoutProperty('theloop-b2gq5f', 'visibility', 'visible');

        //Disable Pending Slides
        map.setLayoutProperty('trafficincidentsbike-4uqhba', 'visibility', 'none');
        map.setLayoutProperty('trafficincidentsbike-4uqhba copy', 'visibility', 'none');

    } else 
    if (activeChapterName === 'accidents') {
        removehighlight();
        document.getElementById('theloop').setAttribute('class', 'active');
        document.getElementById('osmbikes').setAttribute('class', 'active');        

        //Enable Current Slides
        map.setLayoutProperty('trafficincidentsbike-4uqhba', 'visibility', 'visible');
        map.setLayoutProperty('trafficincidentsbike-4uqhba copy', 'visibility', 'visible');
    
        //Disable Pending Slides
        map.setLayoutProperty('hs_main_inner', 'visibility', 'none');
        map.setLayoutProperty('hs_main_outer', 'visibility', 'none');
        map.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
        map.setLayoutProperty('osm-bicycleinfras-example', 'visibility', 'none');
        map.setLayoutProperty('hs-do1x45-example', 'visibility', 'none');
       
    } else 
    if (activeChapterName === 'satallitebikelanes') {
        removehighlight();
        document.getElementById('satellite').setAttribute('class', 'active');        

        //Disable Prior Slides 
        map.setLayoutProperty('trafficincidentsbike-4uqhba', 'visibility', 'none');
        map.setLayoutProperty('trafficincidentsbike-4uqhba copy', 'visibility', 'none');
        map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'none');
        map.setLayoutProperty('theloop-b2gq5f', 'visibility', 'none');

        //Enable Current Slides
        map.setLayoutProperty('mapbox-satellite', 'visibility', 'visible');
        map.setLayoutProperty('osm-bicycleinfras-example', 'visibility', 'visible');
        //map.setLayoutProperty('hs-do1x45-example', 'visibility', 'visible');
        
        map.setLayoutProperty('ls_main_outer', 'visibility', 'none');
        map.setLayoutProperty('hs_main_inner', 'visibility', 'none');
        map.setLayoutProperty('hs_main_outer', 'visibility', 'none');
    } else
    if (activeChapterName === 'highstressroads') {
        removehighlight();        
        document.getElementById('osmbikes').setAttribute('class', 'active');        
        document.getElementById('highstress').setAttribute('class', 'active');
        //Disable Prior Slides
        map.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
        map.setLayoutProperty('osm-bicycleinfras-example', 'visibility', 'none');
        //map.setLayoutProperty('hs-do1x45-example', 'visibility', 'none');

        //Enable Currnet Slides
        map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'visible');
        map.setLayoutProperty('hs_main_inner', 'visibility', 'visible');
        map.setLayoutProperty('hs_main_outer', 'visibility', 'visible');

        //Disable Pending Slides        
        map.setLayoutProperty('hs_v2_neutral_inner', 'visibility', 'none');
        map.setLayoutProperty('hs_v2_neutral_outer', 'visibility', 'none');
    } else
    if (activeChapterName === 'highstressroads2') {
        removehighlight();
        document.getElementById('osmbikes').setAttribute('class', 'active');        

        map.setLayoutProperty('hs_main_inner', 'visibility', 'none');
        map.setLayoutProperty('hs_main_outer', 'visibility', 'none');
        //Need to remake this layer in new map map.setLayoutProperty('osm-bicycleinfras-example', 'visibility', 'none');
        map.setLayoutProperty('hs_v2_neutral_inner', 'visibility', 'visible');
        map.setLayoutProperty('hs_v2_neutral_outer', 'visibility', 'visible');
        map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'visible');

        //Disable Pending Slides
        map.setLayoutProperty('ls_main_inner', 'visibility', 'none');
        map.setLayoutProperty('ls_main_outer', 'visibility', 'none');
        map.setLayoutProperty('hawkdotsgeojson', 'visibility', 'none');

    } else
    if (activeChapterName === 'neighborhoodroads') {
        removehighlight();
        document.getElementById('lowstress').setAttribute('class', 'active');        
        document.getElementById('hawks').setAttribute('class', 'active');        

        //Disable Prior Slides
        map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'none');
        map.setLayoutProperty('hs_v2_neutral_inner', 'visibility', 'none');
        map.setLayoutProperty('hs_v2_neutral_outer', 'visibility', 'none');
        
        //Enable Current Slides
        map.setLayoutProperty('ls_main_inner', 'visibility', 'visible');
        map.setLayoutProperty('ls_main_outer', 'visibility', 'visible');
        map.setLayoutProperty('hawkdotsgeojson', 'visibility', 'visible');
        //map.setLayoutProperty('hawk_roads-white', 'visibility', 'visible');     

        //Disable Pending Slides        
        map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'none');
        map.setLayoutProperty('hs_main_inner', 'visibility', 'none');
        map.setLayoutProperty('hs_main_outer', 'visibility', 'none');
        map.setLayoutProperty('hs-do1x45-example', 'visibility', 'none');
        map.setLayoutProperty('osm-bicycleinfras-example', 'visibility', 'none');
        map.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
        map.setLayoutProperty('trafficincidentsbike-4uqhba', 'visibility', 'none');
        map.setLayoutProperty('trafficincidentsbike-4uqhba copy', 'visibility', 'none');
        map.setLayoutProperty('hawk_roads', 'visibility', 'none');
        map.setLayoutProperty('ls-nonhawkroads-4dyda7 copy', 'visibility', 'none');
        map.setLayoutProperty('ls-nonhawkroads-4dyda7', 'visibility', 'none'); 
        map.setLayoutProperty('ls_main_outer copy', 'visibility', 'none');      
        //map.setLayoutProperty('tnr_main_inner', 'visibility', 'none');
        //map.setLayoutProperty('tnr_main_outer', 'visibility', 'none');
        map.setLayoutProperty('hs_v2_neutral_inner', 'visibility', 'none');
        map.setLayoutProperty('hs_v2_neutral_outer', 'visibility', 'none');
    } else
    /*if (activeChapterName === 'deadendroads') {


        //map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'none');
        //map.setLayoutProperty('hs-do1x45', 'visibility', 'none');
        map.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
        map.setLayoutProperty('hs_main_inner', 'visibility', 'visible');
        map.setLayoutProperty('hs_main_outer', 'visibility', 'visible');
        map.setLayoutProperty('ls-nonhawkroads-4dyda7 copy', 'visibility', 'visible');
        map.setLayoutProperty('ls-nonhawkroads-4dyda7', 'visibility', 'visible');
        //map.setLayoutProperty('tnr_main_inner', 'visibility', 'visible');
        //map.setLayoutProperty('tnr_main_outer', 'visibility', 'visible');
        map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'none');
        map.setLayoutProperty('theloop-b2gq5f', 'visibility', 'none');
        //Turn on Neutral HS Roads to cover up bad bike lanes
        map.setLayoutProperty('hs_v2_neutral_inner', 'visibility', 'visible');
        map.setLayoutProperty('hs_v2_neutral_outer', 'visibility', 'visible');
        map.setLayoutProperty('hawk_roads-example', 'visibility', 'none');
    } else*/
    if (activeChapterName === 'residentialsatallite') {
        removehighlight();
        document.getElementById('satallite').setAttribute('class', 'active');        
        //Disable Prior Slides
        map.setLayoutProperty('ls_main_inner', 'visibility', 'none');
        map.setLayoutProperty('ls_main_outer', 'visibility', 'none');   
        map.setLayoutProperty('hawk_roads', 'visibility', 'none');

        //Enable Current Slides 
        map.setLayoutProperty('mapbox-satellite', 'visibility', 'visible');
        map.setLayoutProperty('ls_main_outer copy', 'visibility', 'visible');
        
        //Disable Pending Slides
        map.setLayoutProperty('hawk_roads-example', 'visibility', 'none');
    } else 
    if (activeChapterName === 'satallite') {
        removehighlight();
        document.getElementById('satallite').setAttribute('class', 'active');        
        //Disable Prior Slides
        map.setLayoutProperty('ls_main_outer copy', 'visibility', 'none');

        //Enable Current Slides 
        map.setLayoutProperty('mapbox-satellite', 'visibility', 'visible');
        map.setLayoutProperty('hawk_roads-example', 'visibility', 'visible');
        
        //Disable Pending Slides
        map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'none');
    } else 
    if (activeChapterName === 'traditionroutes') {
        removehighlight();
        document.getElementById('osmbikes').setAttribute('class', 'active');        
        //Disable Prior Slides
        map.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
        map.setLayoutProperty('hawk_roads-example', 'visibility', 'none');

        //Enable Current Slides
        map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'visible');
        
        //Disable Pending Slides
        map.setLayoutProperty('theloop-b2gq5f', 'visibility', 'none');
        map.setLayoutProperty('hawkdotsgeojson', 'visibility', 'none');
        map.setLayoutProperty('hawk_roads', 'visibility', 'none');
        map.setLayoutProperty('hawkroadscase', 'visibility', 'none');
        map.setLayoutProperty('tnr_main_inner', 'visibility', 'none');
        map.setLayoutProperty('tnr_main_outer', 'visibility', 'none');  
        //map.setLayoutProperty('hs_v2_neutral_inner', 'visibility', 'none');
        //map.setLayoutProperty('hs_v2_neutral_outer', 'visibility', 'none');
    } else 
    /*if (activeChapterName === 'traditionroutes2') {
        //No Prior Slides to Disable

        //Enable Current Slides   

        //Disable Pending Slides
        map.setLayoutProperty('theloop-b2gq5f', 'visibility', 'none');
        map.setLayoutProperty('hawk_roads', 'visibility', 'none');
        map.setLayoutProperty('hawkroadscase', 'visibility', 'none');
        map.setLayoutProperty('tnr_main_inner', 'visibility', 'none');
        map.setLayoutProperty('tnr_main_outer', 'visibility', 'none');
    } else */
    if (activeChapterName === 'lowstressnetwork') {
        removehighlight();
        //document.getElementById('osmbikes').setAttribute('class', 'active');        
        document.getElementById('hawks').setAttribute('class', 'active');                
        document.getElementById('hawks').setAttribute('class', 'active');        
        document.getElementById('theloop').setAttribute('class', 'active');        

        //Prior Slides to Disable
        map.setLayoutProperty('osm-bicycleinfras-5z6khj', 'visibility', 'none');

        //Enable Current Slides
        map.setLayoutProperty('theloop-b2gq5f', 'visibility', 'visible');
        map.setLayoutProperty('hawkdotsgeojson', 'visibility', 'visible');
        map.setLayoutProperty('hawk_roads', 'visibility', 'visible');
        map.setLayoutProperty('hawkroadscase', 'visibility', 'visible');
        map.setLayoutProperty('tnr_main_inner', 'visibility', 'visible');
        map.setLayoutProperty('tnr_main_outer', 'visibility', 'visible');  
        //map.setLayoutProperty('hs_v2_neutral_inner', 'visibility', 'visible');
        //map.setLayoutProperty('hs_v2_neutral_outer', 'visibility', 'visible');
        //No Pending Slides to Disable

    } else
    if (activeChapterName === 'telegraph') {
        removehighlight();
        document.getElementById('tnrv5').setAttribute('class', 'active');        
        document.getElementById('hawks').setAttribute('class', 'active');        
        document.getElementById('theloop').setAttribute('class', 'active');        

            //No Prior Slides to Disable
            //No Current Slides to Enable
            //No Pending Slides to Disable
    } return;
}

//---------------------------------------------------------------------------------------
// -------------------------------- Add Data Layers  ------------------------------------
//---------------------------------------------------------------------------------------

//Adds the legend map controls layers
//template of below code is: toggleLayer(HTML id, [what layers to enable/disable], what to name the button displayed on screen)

toggleLayer('tnrv5',
    ['tnr_main_inner','tnr_main_outer', 'hawk_roads','hawkroadscase'],
    'Safest Bicycle Streets'); //Button Name

toggleLayer('hawks',
    ['hawkdotsgeojson'],
    'Signalled Crosswalks');

toggleLayer('theloop', ['theloop-b2gq5f'], 'The Loop Pedestrian Path');

toggleLayer('osmbikes',
    ['osm-bicycleinfras-5z6khj'],
    'City Bicycle Lanes'); //Button Name

//Toggle All LS Original Road Network
toggleLayer('lowstress',
    ['ls_main_outer', 'ls_main_inner'], 
    'Low Stress Roads');

toggleLayer('highstress',
    ['hs_main_outer', 'hs_main_inner'],
    'High Stress Roads');

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
    'Annotation'); 


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


//---------------------------------------------------------------------------------------
// ------------------------- Using Draw Tools to Crete Bike Routes-----------------------
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

  //***When people draw routes, there is a 25 node max, for returning a route, So I need to know (and return on screen) the node count 
  //Akso nodecount is a local variable only declared in updateRoute(), so the below line of code should only if still in updateRoute(), which is why i have it here 
  
  /*Additional code for mainroutingpage
  document.getElementById("drawbox").innerHTML = "<h6>Nodes Used:" + nodecount +"</h6><p>Max 25 Nodes</p>";
  */
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
   
    /*Additonal code for mainroutingpage
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
        id: "route",
        type: "line",
        source: {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: coords
            }
        },
        layout: {
            "line-join": "round",
            "line-cap": "round"
        },
        paint: {
            "line-color": "#6d5cc2", //"#2c9952" Green, //3b9ddd //#FFC300 Yellow
            "line-width": 4,
            "line-opacity": 0.8
        }
    });

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

    var output = JSON.stringify(TNRRoute, undefined, 2);
/*additonal code for mainroutingpage
    document.getElementById("completegeojson").innerHTML = "<b>Geojson Output:</b> <br>" + output;
  */
  };



function CopyRouteToClipboard() {
  drawing.select();
  document.execCommand("copy");
  alert("Route Copied to Clipboard!");
}



// remove the layer if it exists
function removeRoute () {
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeLayer('routearrows');
    map.removeSource('route');
    //Additional code for mainroutingpage instructions.innerHTML = '';
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

/*
   HAving Trouble with the next line of code.
  var nodecount = draw.getAll().features[0].geometry.coordinates.length;

  //When people draw routes, there is a 25 node max, for returning a route, So I need to know (and return on screen) the node count 
  //Akso nodecount is a local variable only declared in updateRoute(), so the below line of code should only if still in updateRoute(), which is why i have it here 
  document.getElementById("drawbox").innerHTML = "<h6>Nodes Used:" + nodecount +"</h6><p>Max 25 Nodes</p>";

*/


/*Enable/Disable 3D Buildings when zoomed in

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
*/

