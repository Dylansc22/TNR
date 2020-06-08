window.addEventListener("load", doEverything());//switch to everythingfunction2 when ready to make the leap to the cleaner code

function doEverything(){
  loadParameters();
  illCleanThisFunctionUpLater();
  addAllbuttonfunctionality();
  //garbageTesting();
  //all my other code here
}

function loadParameters(){
    myHostAddress = "http://localhost:8989";
    myAPI = API.ors;
    ghAPI = API.graphhopper;
 
  // Various Paramaters for OpenRouteService Directions Calculation
    W = {
      coordinates: [], //create the coordinates array
      extra_info: ["waytype"], //turn this on for custom API
      elevation: false, //turn this on for custom API
      profile: "cycling-regular",
      preference: "shortest", //fastest, shortest, recommended
      extra_info: ["waytype", "steepness"], //“steepness”, “suitability”, “surface”, “waycategory”, “waytype”, “tollways”, “traildifficulty”, “roadaccessrestrictions”
      format: "geojson",
      units: "mi" //km, mi, m
    }
    W.coordinates[0] = []; //create the array in the array, that will hold the first coordinate
    W.coordinates[1] = [];
}

function addAllbuttonfunctionality(){
    //----------Search Bar------------//
    //When the geocoder (i.e. the search bar) is engaged/triggered/used/etc... dropdown the Button for Generating Directions
    geocoder.on('result', function(e) {
      document.getElementById("directionhere").classList.add("directionbuttonvisable");
      document.getElementById("directionhere").innerHTML = "Get Route to " + geocoder._typeahead.selected.text;
    });

    //----------Get Route Button ------------// 
    //When the 'Get Route' Button is Clicked, Get Directions
    document.getElementById("directionhere").addEventListener("click", SearchBarDirections);

    
    //----------Safe Route Toggle ------------//
    $(function() {
      $('#routerToggle').change(function() {
        if (checkRouteOnScreen()) {
          //route is on screen and subsequently source layer is loaded 
          removeRouteLayerAndSource();
        }
        generateRoute();
      })
    })

    //----------Draw Route------------//
    //document.getElementById("drawRoute").addEventListener("click", drawUsingPoints);
}

function checkRouteOnScreen(){
  if (typeof(map.getLayer('R_layer')) !== "undefined") {
    //layer exists
    return true
  }
  else {
    return false
  }
}

function SearchBarDirections(){ /*the new version of ComputerDirections()*/
  wasRouteDrawnOrSearched = "searched";
  nodecount = [];
  //Test if A Route is already on Screen
  if (checkRouteOnScreen()) {
    //Route already exists on map
      removeRouteLayerAndSource();
      clearWCoordinates();
  }
  findCurrentPosition(); //Saves the geotagged user position as a coordinate
  findTargetsPosition(); //Saves the searched POI as a coordinate
  //I eventually want generateRoute() to live here, but no matter what I do geolocate.on('geolocate', (...)) fires at the very end of the script
  //             so I have to have geolocate.on(){... generateRoute(){  newRouteLayer()}, and whatever else in there} 

}

function findCurrentPosition() {
  geolocate.trigger();
  geolocate.on('geolocate', function(e) {
    //THIS IS LIKE THE LAST THING EVER FIRED IN THE FUNCTION. THIS WILL NO MATTER
    //WHAT BE WHERE THE END OF THE JAVASCRIPT LIVES. 
    //DONT ASK ME BUT GEOLOCATE.ON IS LIKE THE VERY LAST THING TO FIRE NO MATTER WHAT!
      let lng = e.coords.longitude;
      let lat = e.coords.latitude;
      W.coordinates[0] = [lng, lat];
      generateRoute(); //THIS NEEDS TO BE HERE
    });

}

function findTargetsPosition(){
  //Set Finish Coordinates - geocoder was activated in the first few lines of addAllbuttonfunctionality 
  let lng = geocoder.mapMarker._lngLat.lng;
  let lat = geocoder.mapMarker._lngLat.lat 
  
  W.coordinates[1] = [lng, lat];
}

function coordinateChecker(){
  if (W.coordinates[0].length == 0) {
    console.log("W.coordinate[0] is undefined");
    findCurrentPosition();
  }
  else {
    console.log("W.coordinate[0] is finally definied");
    //generateRoute();
    }
}

function updatePoint(startOrFinish,longAndLat){
  if (startOrFinish == "start") {
    W.coordinates[0] = longAndLat;
  }
  if (startOrFinish == "finish") {
    W.coordinates[1] = longAndLat;
  }
  removeRouteLayerAndSource();
  generateRoute();
}

function generateRoute() {
  //First, check if 'Safe Routing' is On or Off
  let RouterToggleStatus = document.getElementById('routerToggle').checked //Either True or False, Depending on routerToggle state
  
  if (RouterToggleStatus == true) {
    generateSafeRoute();
  }
  else {
    generateDangerousRoute();
  }
}

function generateSafeRoute(){
  //Add necessary parameters to list of parameters needed for ORS Directions call
    W["preference"] = "recommended"; //I think it can't be recommended, needs to be fastest
    W["elevation"] = false; //Pretty sure it can't be true, needs to be false
    W["options"] = { //required for custom weighting
      profile_params: {
        weightings: { green: .5 }
      }
    };
    W["host"] = myHostAddress; //required to point to my online graphs

    console.log(JSON.stringify(W));
    console.log("Above is W - ORS routing Input Parameter");

    var ghRouting = new GraphHopper.Routing({
      //key: ghAPI,
      host: myHostAddress, //*** LOCALHOST DOESNT CURRENTLY WORK YET, THIS WONT COMPUTE 
      vehicle: "bike",
      elevation: false,
      details: ["road_class", "distance"]
    });

    //ghRouting.addPoint(new GHInput(startMarker._lngLat.lat, startMarker._lngLat.lng));
    //ghRouting.addPoint(new GHInput(endMarker._lngLat.lat, endMarker._lngLat.lng));
    ghRouting.addPoint(new GHInput(W.coordinates[0][1], W.coordinates[0][0]));
    ghRouting.addPoint(new GHInput(W.coordinates[1][1], W.coordinates[1][0]));

    ghRouting.doRequest()
      .then(function(json) {
        // Add your own result handling here
        //console.log(json);
        R = json;
        console.log(JSON.stringify(R));
        newRouteLayer(R);
      })
      .catch(function(err) {
        console.error(err.message);
      });
  };

function generateDangerousRoute(){
  //*** I need to write an if statement that checks if W["optoins"] & W["host"] exists
  //*** If it does exist, I need to delete those off of W before using it in the Directions call

  if (W.host == myHostAddress) {
    delete W.host;
    delete W.options;
    W.elevation = true;
    W.preference = "shortest";
  }

    var ghRouting = new GraphHopper.Routing({
      key: ghAPI,
      //host: myHostAddress,
      vehicle: "bike",
      elevation: false
    });

    //ghRouting.addPoint(new GHInput(startMarker._lngLat.lat, startMarker._lngLat.lng));
    //ghRouting.addPoint(new GHInput(endMarker._lngLat.lat, endMarker._lngLat.lng));
    ghRouting.addPoint(new GHInput(W.coordinates[0][1], W.coordinates[0][0]));
    ghRouting.addPoint(new GHInput(W.coordinates[1][1], W.coordinates[1][0]));



    ghRouting.doRequest()
      .then(function(json) {
        // Add your own result handling here
        //console.log(json);
        R = json;
        console.log(JSON.stringify(R));
        newRouteLayer(R);
      })
      .catch(function(err) {
        console.error(err.message);
      });
}

function newRouteLayer(e,f){
    f = f || []; // nodecount will be set either to nodecount or to [].
    //Use Mapbox to visualize json directions on Map
    map.addSource('R_source' + f.toString(), { type: 'geojson', data: e.paths[0].points });
    map.addLayer({
      "id": "R_layer"+ f.toString(),
      "type": "line",
      "source": "R_source" + f.toString(),
      "paint": {
        "line-color": "black", //"#4f7ba4",
        "line-opacity": 0.75,
        "line-width": 3
      }
    });

    var boundary = []
    boundary[0] = R.paths[0].bbox[0] - 0.008;
    boundary[1] = R.paths[0].bbox[1] - 0.008;
    boundary[2] = R.paths[0].bbox[2] + 0.008;
    boundary[3] = R.paths[0].bbox[3] + 0.008;
    map.fitBounds(boundary);
    
}

function amendToDrawnRoute(e){
  if (checkRouteOnScreen() && wasRouteDrawnOrSearched == "drawn") { //A part of the route is already on screen.
    // newR = {}
    // newR.type = "FeatureCollection";
    // newR.bbox = [Math.min(priorR.bbox[0],e.bbox[0]), Math.min(priorR.bbox[1],e.bbox[1]), Math.max(priorR.bbox[2],e.bbox[2]), Math.max(priorR.bbox[3],e.bbox[3])]
    // newR.features = [];
    // newR.features[0].bbox = newR.bbox;
    // newR.features[0].type = "Feature";
    // newR.features[0].properties.segments

    // map.addSource('R_source2', { type: 'geojson', data: e });
    // map.addLayer({
    //   "id": "R_layer",
    //   "type": "line",
    //   "source": "R_source2",
    //   "paint": {
    //     "line-color": "black",
    //     "line-opacity": 0.75,
    //     "line-width": 3
    //   }
    // });

    // newR.features = [priorR["features"], e["features"]];
    // newR.metadata = e.metadata;
    // newRouteLayer(newR);
    // prior_Rfeatures = map.getSource("R_source")._data.features[0];
    // new_Rfeatures = prior_Rfeatures.concat(R.features[0]);
    // newRouteLayer(new_R);
    // e.join(';'); //So amend to it..
  }
  else { //Otherwise this is the first 2 drawn points, and nothing is on screen yet. Thus NewRouteLayer, rather than 'amend' a route to literally nothing on screen yet. 
    newRouteLayer(e);
  }
}

function removeRouteLayerAndSource(){
  map.removeLayer("R_layer");
  map.removeSource("R_source");
}

function clearWCoordinates(){
  W.coordinates[0] = [];
  W.coordinates[1] = [];
}


//Work on this later
// var orsDistance = R.features[0].properties.segments[0].distance;
//       var orsDistance = orsDistance.toFixed(1); //round to tenth place
//       var orsReturnedSteps = R.features[0].properties.segments[0].steps
//       var summaryDirections = "";
//       for (i = 0; i < orsReturnedSteps.length; i++) {
//         summaryDirections += orsReturnedSteps[i].instruction + "<br />";
//       }
//       document.getElementById("exampleModalLongTitle2").innerHTML = "";
//       document.getElementById("exampleModalLongTitle2").innerHTML = orsDistance + " Miles";                  

//       document.getElementById("routeDirections").innerHTML = "";
//       document.getElementById("routeDirections").innerHTML = summaryDirections;
//       // console.log(JSON.stringify(json));