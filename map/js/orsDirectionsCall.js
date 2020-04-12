window.addEventListener("load", everythingfunction2);//switch to everythingfunction2 when ready to make the leap to the cleaner code

function everythingfunction() {
  illCleanThisFunctionUpLater();
  funcdirectcall();
}

function everythingfunction2(){

  loadParameters();
  illCleanThisFunctionUpLater();
  addAllbuttonfunctionality();
  //all my other code here
}

function loadParameters(){
    myHostAddress = "http://localhost:8080/ors";
    myAPI = API.ors;
 
  // Various Paramaters for OpenRouteService Directions Calculation
    W = {
      extra_info: ["waytype"], //turn this on for custom API
      elevation: false, //turn this on for custom API
      profile: "cycling-regular",
      preference: "recommended", //fastest, shortest, recommended
      extra_info: ["waytype", "steepness"], //“steepness”, “suitability”, “surface”, “waycategory”, “waytype”, “tollways”, “traildifficulty”, “roadaccessrestrictions”
      format: "geojson",
      units: "mi" //km, mi, m
    }
}

function addAllbuttonfunctionality(){
  //----------Search Bar------------//
    //When the geocoder (i.e. the search bar) is engaged/triggered/used/etc... dropdown the Button for Generating Directions
    geocoder.on('result', function(e) {
      document.getElementById("directionhere").classList.add("directionbuttonvisable");
      document.getElementById("directionhere").innerHTML = "Get Route to " + geocoder._typeahead.selected.text;
    });

    //When the 'Get Route' Button is Clicked, Get Directions
      document.getElementById("directionhere").addEventListener("click", SearchBarDirections);
    

    $(function() {
      $('#routerToggle').change(function() {
        if (checkRouteOnScreen()) {
          //route is on screen and subsequently source layer is loaded 
          map.removeLayer("LayerName_CanBeAnything");
          map.removeSource("routeSource");
        }
        generateRoute();
      })
    })
}

function checkRouteOnScreen(){
  if (typeof(map.getLayer('LayerName_CanBeAnything')) !== undefined) {
    //layer exists
    return true
  }
  else {
    return false
  }
}

function SearchBarDirections(){ /*the new version of ComputerDirections()*/
  findCurrentPosition(); //Saves the geotagged user position as a coordinate
  findTargetsPosition(); //Saves the searched POI as a coordinate
  //I eventually want generateRoute() to live here, but no matter what I do geolocate.on('geolocate', (...)) fires at the very end of the script
  //             so I have to have geolocate.on(){... generateRoute(){ addRouteLayer()}, and whatever else in there} 
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
      //addRouteLayer(); //This doesn't seem to work here...
    });

}

function findTargetsPosition(){
  //Set Finish Coordinates - geocoder was activated in the first few lines of addAllbuttonfunctionality 
  let lng = geocoder.mapMarker._lngLat.lng;
  let lat = geocoder.mapMarker._lngLat.lat 
  W["coordinates"] = []; //create the coordinates array
  W.coordinates[0] = []; //create the array in the array, that will hold the first coordinate
  W.coordinates[1] = [];
  W.coordinates[1] = [lng, lat];
}

function coordinateChecker(){
  if (W.coordinates[0].length == 0) {
    console.log("W.coordinate[0] is undefined");
    findCurrentPosition();
  }
  else 
    console.log("W.coordinate[0] is finally definied");
    //generateRoute();
}

function updatePoint(startOrFinish,longAndLat){
  if (startOrFinish == "start") {
    W.coordinates[0] = longAndLat;
  }
  if (startOrFinish == "finish") {
    W.coordinates[1] = longAndLat;
  }
  removeRouteLayer();
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
    W["preference"] = "fastest"; //I think it can't be recommended, needs to be fastest
    W["elevation"] = false; //Pretty sure it can't be true, needs to be false
    W["options"] = { //required for custom weighting
      profile_params: {
        weightings: { green: 1 }
      }
    };
    W["host"] = myHostAddress; //required to point to my online graphs

    console.log("Open Route Service Input Parameters");
    console.log(JSON.stringify(W));

    let orsDirections = new Openrouteservice.Directions({
      // api_key: myAPI,
      host: myHostAddress
    });

    orsDirections.calculate(W)
      .then(function(json) {
        if (typeof R !== 'undefined') { //Okay, reminder: R is my variable I use for the returned ORS geojson route
            delete R;                   //  If it is already defined, I need to delete it, so when it resaves in R = json
        }                                // It will do so as a global variable. If its already defined, it will only save locally, which is bad.
        R = json;
        console.log("Open Route Services Output Geojson")
        console.log(JSON.stringify(R));
        addRouteLayer(R);
      })
      .catch(function(err) {
          console.error(err);
      });
  };

function generateDangerousRoute(){
  //*** I need to write an if statement that checks if W["optoins"] & W["host"] exists
  //*** If it does exist, I need to delete those off of W before using it in the Directions call

  if (W.host == myHostAddress) {
    delete W.host;
    delete W.options;
    W.elevation = true;
    W.preference = "recommended";
  }

  orsDirections = new Openrouteservice.Directions({
    api_key: myAPI,
  });

  orsDirections.calculate(W)
    .then(function(json) {
        if (typeof R !== 'undefined') { //Okay, reminder: R is my variable I use for the returned ORS geojson route
            delete R;                   //  If it is already defined, I need to delete it, so when it resaves in R = json
        }                                // It will do so as a global variable. If its already defined, it will only save locally, which is bad.
        R = json;
        console.log("Open Route Services Output Geojson")
        console.log(JSON.stringify(R));
        addRouteLayer(R);
      })
      .catch(function(err) {
          console.error(err);
      });
}

function addRouteLayer(e){
    //Use Mapbox to visualize json directions on Map
    map.addSource('routeSource', { type: 'geojson', data: e });
    map.addLayer({
      "id": "LayerName_CanBeAnything",
      "type": "line",
      "source": "routeSource",
      "paint": {
        "line-color": "black",
        "line-opacity": 0.75,
        "line-width": 3
      }
    });
}

function removeRouteLayer(){
  map.removeSource("routeSource");
  map.removeLayer("routeSource");
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