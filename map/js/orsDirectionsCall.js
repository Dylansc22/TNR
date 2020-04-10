window.addEventListener("load", everythingfunction);

function everythingfunction() {
  funcrouting();
  funcdirectcall();
}

function funcdirectcall() {

  //ORS DIRECITONS CODE

      hostAddress = "http://localhost:8080/ors";

      geocoder.on('result', function(e) {
        document.getElementById("directionhere").classList.add("directionbuttonvisable");
        document.getElementById("directionhere").innerHTML = "Get Route to " + geocoder._typeahead.selected.text;
      });


      document.getElementById("directionhere").addEventListener("click", ComputeDirections);

        function ComputeDirections(){
          geolocate.trigger();
          //Set A location
          geolocate.on('geolocate', function(e) {
              lon = e.coords.longitude;
              lat = e.coords.latitude
              A = [lon, lat];
              setCoordinates_SearchBar();

              //For some reason geolocate.trigger() or maybe geolocate.on run twice
              //I think its like from geting your location, and then running again for the high accuracy location
              //So whats happening, is this gimmeDirections() is running twice, 
              //so the geojson is being returned once, and then rejected in console log the second time
              //saying "Source with that ID is already added!", really annoying... 
              // so the below 5 lines of code are checking if the layer is already added...
              //if so (which is is, its removing it, and then calcating through on the 2nd attempt.
              //kinda a weirdo fix, but eeeeeh, im sick of doing everything by best practices anyway.
              var mapLayer = map.getLayer('LayerName_CanBeAnything');
                if(typeof mapLayer !== 'undefined') {
                  // Remove map layer & source.
                  map.removeLayer('LayerName_CanBeAnything').removeSource('sourcename');
                }

              // displayMarkers(A,B);
              gimmeDirections(A,B);
          });
        };

        //Function Define
        function setCoordinates_SearchBar() {

          //Set B Lat/Long based on Searched POI from Geocoder Search Bar
            B = [geocoder.mapMarker._lngLat.lng, geocoder.mapMarker._lngLat.lat];
        }

        //Function Define
        function gimmeDirections (a,b){
          var RouterToggleStatus = document.getElementById('routerToggle').checked //Either True or False, Depending on routerToggle state

            //if statement - if Toggle Condition is True (i.e. Router Toggle Button is on Tucson Pathways)
            //Run the orsDirections with custom API graph parameters
            if (RouterToggleStatus == true) {
              let orsDirections = new Openrouteservice.Directions({
                host: hostAddress
              });
              orsDirections.calculate({
              // Various Paramaters for OpenRouteService Directions Calculation
                host: hostAddress, //turn this on for custom API
                extra_info: ["waytype"], //turn this on for custom API
                elevation: false, //turn this on for custom API
                preference: "fastest", //turn this on for custom API
                options: {
                  profile_params: {
                      weightings: {
                          green: 1
                      }
                  }
                },
                coordinates: [a, b],
                profile: "cycling-regular",
                preference: "recommended", //fastest, shortest, recommended
                extra_info: ["waytype", "steepness"], //“steepness”, “suitability”, “surface”, “waycategory”, “waytype”, “tollways”, “traildifficulty”, “roadaccessrestrictions”
                format: "geojson",
                units: "mi" //km, mi, m
              })
              //Sets the directions as a json 
                .then(function(json) {
                  var X = json;
                  var orsDistance = X.features[0].properties.segments[0].distance;
                  var orsDistance = orsDistance.toFixed(1); //round to tenth place
                  var orsReturnedSteps = X.features[0].properties.segments[0].steps
                  var summaryDirections = "";
                  for (i = 0; i < orsReturnedSteps.length; i++) {
                    summaryDirections += orsReturnedSteps[i].instruction + "<br />";
                  }
                  document.getElementById("exampleModalLongTitle2").innerHTML = "";
                  document.getElementById("exampleModalLongTitle2").innerHTML = orsDistance + " Miles";                  

                  document.getElementById("routeDirections").innerHTML = "";
                  document.getElementById("routeDirections").innerHTML = summaryDirections;
                  // console.log(JSON.stringify(json));

                  //Use Mapbox to visualize json directions on Map
                    map.addSource('sourcename', { type: 'geojson', data: X });
                    map.addLayer({
                      "id": "LayerName_CanBeAnything",
                      "type": "line",
                      "source": "sourcename",
                      "paint": {
                        "line-color": "black",
                        "line-opacity": 0.75,
                        "line-width": 3
                      }
                    });
                })
              //If error, throw error message
                .catch(function(err) {
                  console.error(err);
                });
            }
            //else - statement is False (i.e. Router Toggle is Button is on Regular Routing)
            //Run orsDirections with regular ORS Cycling API
            else {
              let orsDirections = new Openrouteservice.Directions({
                api_key: API.ors
              });

              orsDirections.calculate({
                // Various Paramaters for OpenRouteService Directions Calculation
                  // host: hostAddress, //turn this on for custom API
                  extra_info: ["waytype"], //turn this on for custom API
                  elevation: false, //turn this on for custom API
                  coordinates: [a, b],
                  profile: "cycling-regular",
                  preference: "recommended", //fastest, shortest, recommended
                  extra_info: ["waytype", "steepness"], //“steepness”, “suitability”, “surface”, “waycategory”, “waytype”, “tollways”, “traildifficulty”, “roadaccessrestrictions”
                  format: "geojson",
                  units: "mi" //km, mi, m
              })
                      //Sets the directions as a json 
                .then(function(json) {
                  var X = json;
                  var orsDistance = X.features[0].properties.segments[0].distance;
                  var orsDistance = orsDistance.toFixed(1); //round to tenth place
                  var orsReturnedSteps = X.features[0].properties.segments[0].steps
                  var summaryDirections = "";
                  for (i = 0; i < orsReturnedSteps.length; i++) {
                    summaryDirections += orsReturnedSteps[i].instruction + "<br />";
                  }
                  document.getElementById("exampleModalLongTitle2").innerHTML = "";
                  document.getElementById("exampleModalLongTitle2").innerHTML = orsDistance + " Miles";                  

                  document.getElementById("routeDirections").innerHTML = "";
                  document.getElementById("routeDirections").innerHTML = summaryDirections;
                  // console.log(JSON.stringify(json));

                  //Use Mapbox to visualize json directions on Map
                    map.addSource('sourcename', { type: 'geojson', data: X });
                    map.addLayer({
                      "id": "LayerName_CanBeAnything",
                      "type": "line",
                      "source": "sourcename",
                      "paint": {
                        "line-color": "black",
                        "line-opacity": 0.75,
                        "line-width": 3
                      }
                    });
                })
              //If error, throw error message
                .catch(function(err) {
                  console.error(err);
                });
            }
        } //gimmedirections end


      //------------------------------------------------------------------------
      //What: Marker Popup 'Directions to Here?'
      //Why: I need to enable users to interact with Search Marker for directions
      //How: 1. Add a Marker 
      //     2. Add a Popup 
      //     3. Put a Button in the Popup that Triggers Directions to Marker
      //Help: https://docs.mapbox.com/mapbox-gl-js/api/?size=n_10_n#marker
      //      https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/
      //      https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/

      //map.getCanvas().style.cursor = 'pointer';

      //load a geojson with a few coordinates
      


      // map.on('load', function() {
      //   map.addSource('places', {
      //     'type': 'geojson',
      //     'data': {
      //       'type': 'FeatureCollection',
      //       'features': [
      //         {
      //         'type': 'Feature',
      //         'properties': {
      //           'description':
      //           '<strong>Ballston Arts & Crafts Market</strong><p>The Ballston Arts & Crafts Market sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>',
      //           // 'icon': 'art-gallery'
      //         },
      //         'geometry': {
      //           'type': 'Point',
      //           'coordinates': [-110.93214973449706, 32.222700917377224]
      //         }
      //         },
      //         {
      //         'type': 'Feature',
      //         'properties': {
      //         'description':
      //         "<strong>Seersucker Bike Ride and Social</strong><p>Feeling dandy? Get fancy, grab your bike, and take part in this year's Seersucker Social bike ride from Dandies and Quaintrelles. After the ride enjoy a lawn party at Hillwood with jazz, cocktails, paper hat-making, and more. 11:00-7:00 p.m.</p>",
      //         // 'icon': 'bicycle'
      //         },
      //         'geometry': {
      //         'type': 'Point',
      //         'coordinates': [-110.94714973449706, 32.229700917377224]
      //         }
      //         }
      //     ]
      //     }
      //   });

      //     map.addLayer({
      //       'id': 'places_id',
      //       'source': 'places',
      //       'type': 'circle', //"type": "symbol"
      //       "paint": { "circle-radius": 10, "circle-color": "black" } //'layout': { 'icon-image': '{icon}-15','icon-allow-overlap': true}
      //   });

      //   // Create a popup, but don't add it to the map yet.
      //     var popup = new mapboxgl.Popup({
      //     closeButton: false,
      //     closeOnClick: false
      //     });
       
      //   map.on('mouseenter', 'places', function(e) {
      //   // Change the cursor style as a UI indicator.
      //   map.getCanvas().style.cursor = 'pointer';
       
      //   var coordinates = e.features[0].geometry.coordinates.slice();
      //   var description = e.features[0].properties.description;
       
      //   // Ensure that if the map is zoomed out such that multiple
      //   // copies of the feature are visible, the popup appears
      //   // over the copy being pointed to.
      //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      //   }
         
      //   // Populate the popup and set its coordinates
      //   // based on the feature found.
      //   popup
      //     .setLngLat(coordinates)
      //     .setHTML(description)
      //     .addTo(map);
      //   });
       
      //   map.on('mouseleave', 'places', function() {
      //     map.getCanvas().style.cursor = '';
      //     popup.remove();
      //   });



      //   // // add markers to map
      //   //   geojson.features.forEach(function(marker) {

      //   // // create a HTML element for each feature
      //   //   var el = document.createElement('div');
      //   //   el.className = 'marker';

      //   // // make a marker for each feature and add to the map
      //   //   new mapboxgl.Marker(el)
      //   //     .setLngLat(marker.geometry.coordinates)
      //   //     .addTo(map);
      //   //     });

      //     //create the popup
      //       var popup = new mapboxgl.Popup({ 
      //         offset: 25,
      //         className: 'mypopupclass'
      //       })
      //       .setText(
      //         'Construction on the Washington Monument began in 1848.'
      //       );
      //       //.setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>');

      //     // create DOM element for the marker (do I need this??)
      //       var el = document.createElement('div');
      //       el.id = 'Idontknowwherethisgoes';

      //         //create the marker
      //       var directionsMarker = new mapboxgl.Marker({
      //         draggable: false,
      //         color: 'black',
      //         })
      //       directionsMarker.setLngLat([-110.93714973449706, 32.227700917377224])
      //       directionsMarker.addTo(map);
      //       directionsMarker.setPopup(popup);
      // });

    //When routerToggle is clicked (i.e. toggled), re-run gimmeDirections
      $(function() {
          $('#routerToggle').change(function() {
            var mapLayer = map.getLayer('LayerName_CanBeAnything');
            if(typeof mapLayer !== 'undefined') {
              // Remove map layer & source.
              map.removeLayer('LayerName_CanBeAnything').removeSource('sourcename');
            }
            gimmeDirections(A,B);
          });
        });


      var SearchBarCloseButton = document.getElementsByClassName("mapboxgl-ctrl-geocoder--button");
      SearchBarCloseButton[0].addEventListener("click", function() {
        geolocate.trigger(); /*remove userlocation dot via (toggable) trigger()*/ 
        document.getElementById("directionhere").classList.remove("directionbuttonvisable"); /*remove Directions Here Button*/
        map.removeLayer("LayerName_CanBeAnything").removeSource("sourcename"); /*Remove geojson Layer and Source LineString Directions*/
      });
    }