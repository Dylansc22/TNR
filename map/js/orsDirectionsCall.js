window.addEventListener("load", function() {

  //Main Variable Declarations & Make two Dragable Mapbox Markers 
    var hostAddress = "http://localhost:8080/ors";
    
    var startMarker = new mapboxgl.Marker({
      draggable: true,
      color: '#139900',
      })
    startMarker.setLngLat([-110.92214973449706, 32.221700917377224])
    startMarker.addTo(map);

    var endMarker = new mapboxgl.Marker({
      draggable: true,
      color: '#660000',
      });
    endMarker.setLngLat([-110.92714973449706, 32.229700917377224])
    endMarker.addTo(map);

    //Generation initial route for the two markers 
    gimmeDirections();


  //This re-calculates directions once a marker being 'done' being dragged around.
  //I probably don't need the if-else statement, and could just remove the directions immediately
  //but I'm keeping it in for now, as an added logical check, behavior is working as I want it to
  //But yea, before it calc's the directions, it checks if directions are already loaded on screen
  //if directions are loaded on screen, it removes them, then re-calc's the directions
    function onDragEnd() {
      var lng = this.getLngLat().lng; //I dont think I need this anymore
      var lat = this.getLngLat().lat; //I dont think I need this anymore
      // console.log("lng:" + lng);
      // console.log("lat:" + lat);
      if (map.isSourceLoaded("testdirections")) {
        map.removeLayer("AnyIdThatIWant");
        map.removeSource("testdirections");
        gimmeDirections();
      }
      //I dont think it will ever reach this else command, since 'testdirections' will always be loaded beforehand
      else {
        gimmeDirections();
      }
    }
    
  //This initiates the above function. i.e. Anytime a Marker is dragged, run the onDragEnd Function
    endMarker.on('dragend', onDragEnd);
    startMarker.on('dragend', onDragEnd);

  //This calls the OpenRouteService Cycling Routing Algorthm API
  //and calculates the route based on the start and end Mapbox Markers       
    function gimmeDirections (){
      var RouterToggleStatus = document.getElementById('routerToggle').checked //Either True or False, Depending on routerToggle state

      //if statement - if Toggle Condition is True (i.e. Router Toggle Button is on Tucson Pathways)
      //Run the orsDirections with custom API graph parameters
      if (RouterToggleStatus) {
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
          coordinates: [Object.values(startMarker.getLngLat()), Object.values(endMarker.getLngLat())],
          profile: "cycling-regular",
          preference: "recommended", //fastest, shortest, recommended
          extra_info: ["waytype", "steepness"], //“steepness”, “suitability”, “surface”, “waycategory”, “waytype”, “tollways”, “traildifficulty”, “roadaccessrestrictions”
          format: "geojson",
          units: "mi" //km, mi, m
        })
        //Sets the directions as a json 
          .then(function(json) {
            X = json;
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
              map.addSource('testdirections', { type: 'geojson', data: X });
              map.addLayer({
                "id": "AnyIdThatIWant",
                "type": "line",
                "source": "testdirections",
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
            coordinates: [Object.values(startMarker.getLngLat()), Object.values(endMarker.getLngLat())],
            profile: "cycling-regular",
            preference: "recommended", //fastest, shortest, recommended
            extra_info: ["waytype", "steepness"], //“steepness”, “suitability”, “surface”, “waycategory”, “waytype”, “tollways”, “traildifficulty”, “roadaccessrestrictions”
            format: "geojson",
            units: "mi" //km, mi, m
        })
                //Sets the directions as a json 
          .then(function(json) {
            X = json;
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
              map.addSource('testdirections', { type: 'geojson', data: X });
              map.addLayer({
                "id": "AnyIdThatIWant",
                "type": "line",
                "source": "testdirections",
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

    };

    //When routerToggle is clicked (i.e. toggled), re-run gimmeDirections
      $(function() {
          $('#routerToggle').change(function() {
            map.removeLayer("AnyIdThatIWant");
            map.removeSource("testdirections");
            gimmeDirections();
          })
        })
});  //End window.addEventListener("load")