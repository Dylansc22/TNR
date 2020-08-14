function illCleanThisFunctionUpLater() {
  //---------------------------------------------------------------------------------------
  // ------------------------------- Step 1: Create The Map -------------------------------
  //---------------------------------------------------------------------------------------
  // All parameter options such as attributionControl, minZoom, style, etc... are found here... https://docs.mapbox.com/mapbox-gl-js/api/#map

  //Activate Mapbox Map
    mapboxgl.accessToken = keys.mapbox;
    map = new mapboxgl.Map({
        container: 'map', // container id
        style: keys.style,
        //style: 'mapbox://styles/mapbox/streets-v11',
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
        accessToken: keys.mapbox,    
    })

  //Adds Mapbox Search Box
    geocoder = new MapboxGeocoder({
      accessToken: keys.mapbox,
      mapboxgl: mapboxgl,
      marker: {
        color: "teal",
      },
      placeholder: "Where to?",
      bbox: [-111.2,32, -110.6, 32.5],
      // types: 'country,region,place,postcode,locality,neighborhood'
      // proximity: {
      //   longitude: -110,
      //   latitude: 32
      // } 
    });

  // Shrinks Attribution to a small hover icon for displays 640px or less
    map.addControl(new mapboxgl.AttributionControl({
        compact: true,   
        }));

  //Add User-Geolocate Button
    geolocate = new mapboxgl.GeolocateControl({
        accessToken: mapboxgl.accessToken,
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true, //Keep as False. When True, it automatically updates results in buggy behavior
                                  //Bugginess is from geolocate.on("geolocate", ...) command, which as a result
                                  //Will only fire at the very end of the javascript, and throws a lot of things
                                  //out of order
        showAccuracyCircle: true,
    })
      
  document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
  document.getElementById('mapViewControls').appendChild(geolocate.onAdd(map)); //Manually locate the draw tool inside the mapViewControls DIV id
  //document.getElementById('mapViewControls').appendChild(draw.onAdd(map)); //Manually locate the draw tool inside the mapViewControls DIV id
  document.getElementById('mapViewControls').appendChild(zoom.onAdd(map)); //Manually locate the draw tool inside the mapViewControls DIV id


  //Add Data layers so map isn't empty
    map.on('load', function(){
      map.setLayoutProperty('hawks-v2-bb9wvv', 'visibility', 'visible');
      map.setLayoutProperty('lshs-hawkroads-v2-ddpdin copy 1', 'visibility', 'visible');
      map.setLayoutProperty('lshs-hawkroads-v2-ddpdin', 'visibility', 'visible');
      map.setLayoutProperty('tnr-v9-7p9y6s copy', 'visibility', 'visible');
      map.setLayoutProperty('tnr-v9-7p9y6s', 'visibility', 'visible');
      // map.setLayoutProperty('theloop-b2gq5f', 'visibility', 'visible');
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
        ['tnr-v9-7p9y6s',
        'tnr-v9-7p9y6s copy', 
        'lshs-hawkroads-v2-ddpdin',
        'lshs-hawkroads-v2-ddpdin copy 1'
        //'tnr-v4-apmebo',
        //'tnr-v3-9wi26p',
        //'tnr-v2-06s5zd',
        //'tnr-v1-c7wnkt'
        ],
        'Safest Bicycle Streets'); //Button Name

    toggleLayer('hawks',
        ['hawks-v2-bb9wvv'],
        'Signalled Crosswalks');

    toggleLayer('theloop', 
        ['theloop-b2gq5f'
        ], 
        'The Loop Pedestrian Path');

    toggleLayer('osmbikes',
        ['osm-bicycleinfras', 
        //'hs_main_inner'
        ],
        'City Bicycle Lanes'); //Button Name

    //Toggle All LS Original Road Network
    toggleLayer('lowstress',
        ['ls-v3-cj14ge', 
        'ls-v3-cj14ge copy 1'], 'Low Stress Roads');

    toggleLayer('highstress',
        ['hs-v2-7bxiun', 
        'hs-v2-7bxiun copy'],
        'High Stress Roads');

    //Toggle Satellite Layer
    toggleLayer ('satellite', 
      ['mapbox-satellite',           
      'lshs-hawkroads-v2-ddpdin copy 2', 
      'tnr-v9-7p9y6s copy 1'
      ], 'Satallite Baselayer');

    //Toggle Annotation
    toggleLayer('annotation',
        ['country-label',
        'state-label', 
        // 'settlement-label', 
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

    //Toggle Streetlights
    toggleLayer('streetlights', 
      ['hs-streetlights-4qsd4j copy 2', 
      'hs-streetlights-4qsd4j copy 1', 
      'hs-streetlights-4qsd4j copy', 
      'hs-streetlights-4qsd4j',
      'ls-streetlights-4od5h2 copy',
      'ls-streetlights-4od5h2'], 
      'Street Lights')

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
              //This can probably be written more efficienty - If Satallite Base has just been turned on, reset pathway color, and recolor lines
              if (name === 'Satallite Baselayer' && visibility === 'none') {
                    satallitemode = true;
                    setPathwayColor();
                  for (i=1;i<=AllMarkers.length-1;i++) {
                    map.setPaintProperty(AllMarkers[i].layer,'line-color', pathwayscolor);
                    map.setPaintProperty(AllMarkers[i].layer,'line-opacity', 1);
                  }
              } else if (name === 'Satallite Baselayer' && visibility === 'visible') {
                    satallitemode = false;
                    setPathwayColor();
                  for (i=1;i<=AllMarkers.length-1;i++) {
                    map.setPaintProperty(AllMarkers[i].layer,'line-color', pathwayscolor);
                    map.setPaintProperty(AllMarkers[i].layer,'line-opacity', 0.9);
                  }
              }
              if (name === 'Street Lights' && visibility === 'none') {
                    nighttimemode = true;
                    setPathwayColor();
                  for (i=1;i<=AllMarkers.length-1;i++) {
                    map.setPaintProperty(AllMarkers[i].layer,'line-color', pathwayscolor);
                    map.setPaintProperty(AllMarkers[i].layer,'line-opacity', 1);
                  }
              } else if (name === 'Street Lights' && visibility === 'visible') {
                    nighttimemode = false;
                    setPathwayColor();
                for (i=1;i<=AllMarkers.length-1;i++) {
                    map.setPaintProperty(AllMarkers[i].layer,'line-color', pathwayscolor);
                    map.setPaintProperty(AllMarkers[i].layer,'line-opacity', 0.9);
                  }
              }
            }
      };
      var layers = document.getElementById('toolbar');
      layers.appendChild(link);
  }

  document.getElementById('tnrv5').setAttribute('class', 'active');        
  document.getElementById('hawks').setAttribute('class', 'active');        
  // document.getElementById('theloop').setAttribute('class', 'active');      

  //---------------------------------------------------------------------------------------
  // --------------------------- Step 3: Create Custom Controls -----------------------------
  //---------------------------------------------------------------------------------------

//API Library here - https://kenwheeler.github.io/slick/
$('#bottomControl').slick({
  // slidesToShow: 2, Covered in responsive section
  // slidesToScroll: 2,
  dots: false,
  draggable: true,
  touchThreshold: 20,
  edgeFriction:0.01,
  infinite: false,
  variableWidth: false, //variable width slides (default false)
  speed: 300,
  autoplay:false,
    autoplaySpeed:8000, //8 seconds
  arrows:true,
  nextArrow: '<i class="TPArrows fa fa-2x fa-arrow-circle-right"></i>',
  prevArrow: '<i class="TPArrows fa fa-2x fa-arrow-circle-left"></i>',
  responsive: [
    {
      breakpoint: 1081,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }

    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
});

}