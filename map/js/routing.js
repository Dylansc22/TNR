function illCleanThisFunctionUpLater() {
  //---------------------------------------------------------------------------------------
  // ------------------------------- Step 1: Create The Map -------------------------------
  //---------------------------------------------------------------------------------------
  // All parameter options such as attributionControl, minZoom, style, etc... are found here... https://docs.mapbox.com/mapbox-gl-js/api/#map

  //Activate Mapbox Map
    mapboxgl.accessToken = API.mapbox;
    map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/dylanc/ck911k4gg0rqu1ilnr0o0dk1m',
        center: [-110.93182, 32.23156], 
        zoom: 12.826,
        pitch: 0,
        bearing: 0,
        attributionControl: false, // Removed default attribution and put custom attribution in below
        maxBounds: [[-111.2,32], [-110.6, 32.5]], //Southwest & Northeast Bounds
        minZoom:12,
        //pitch: 45,
        //bearing: 10,
    });

  //Add Zome & Rotation Controls 
    var zoom = new mapboxgl.NavigationControl({
        accessToken: mapboxgl.accessToken,    
    })

  //Adds Mapbox Search Box
    geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: true,
      placeholder: "Where to?"
      //bbox: [long, lat, long lat]
      //proximity: {
      //   longitude: -110,
      //   latitude: 32
      // } 
    });

  // Shrinks Attribution to a small hover icon for displays 640px or less
    map.addControl(new mapboxgl.AttributionControl({
        compact: true,   
        }));

  //Add Custom Mapbox Controls for Bicycle Routing
    draw = new MapboxDraw({
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

  //Add User-Geolocate Button
    geolocate = new mapboxgl.GeolocateControl({
        accessToken: mapboxgl.accessToken,
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: false, //Keep as False. When True, it automatically updates results in buggy behavior
                                  //Bugginess is from geolocate.on("geolocate", ...) command, which as a result
                                  //Will only fire at the very end of the javascript, and throws a lot of things
                                  //out of order
        showAccuracyCircle: true,
    })
      
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
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
      map.setLayoutProperty('theloop-b2gq5f', 'visibility', 'visible');
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
        'tnr_main_outer', 
        'hawk_roads',
        'hawkroadscase'
        //'tnr-v4-apmebo',
        //'tnr-v3-9wi26p',
        //'tnr-v2-06s5zd',
        //'tnr-v1-c7wnkt'
        ],
        'Safest Bicycle Streets'); //Button Name

    toggleLayer('hawks',
        ['hawkdotsgeojson'],
        'Signalled Crosswalks');

    toggleLayer('theloop', 
        ['theloop-b2gq5f'
        ], 
        'The Loop Pedestrian Path');

    toggleLayer('osmbikes',
        ['osm-bicycleinfras-5z6khj', 
        //'hs_main_inner'
        ],
        'City Bicycle Lanes'); //Button Name

    //Toggle All LS Original Road Network
    toggleLayer('lowstress',
        ['ls_main_inner', 
        'ls_main_outer'], 'Low Stress Roads');

    toggleLayer('highstress',
        ['hs_main_inner', 
        'hs_main_outer'],
        'High Stress Roads');

    toggleLayer ('satellite', 
      ['mapbox-satellite', 
      'hawkdotsgeojson', 
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

    toggleLayer('OSMID_LSHawkRoads',
        ['ORS_HawkRoads75m_byOSMID'],
        'Hawk Roads by OSMID');
    
    toggleLayer('hawkroads',
        ['hawk_roads', 'hawkroadscase'],
        'Hawk Roads');

    toggleLayer('ls-nonhawkroads-4dyda7',
        ['ls-nonhawkroads-4dyda7', 'ls-nonhawkroads-4dyda7 copy'],
        'Non-Crosswalk Roads');

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
  document.getElementById('theloop').setAttribute('class', 'active');      

  //---------------------------------------------------------------------------------------
  // --------------------------- Step 3: Create Custom Controls -----------------------------
  //---------------------------------------------------------------------------------------



}