window.addEventListener("load", doEverything());//switch to everythingfunction2 when ready to make the leap to the cleaner code

let parametersGHsafe = {
  host: "http://localhost:8989",
  vehicle: "bike",
  elevation: false,
  details: ["road_class", "distance"]
}

let parametersGHdangerous = {
  key: ghAPI,
  vehicle: "bike",
  elevation: false,
  details: ["road_class", "distance"]
}

let parameters = parametersGHsafe;

let myPOI = new POI();
let AllPOIs = new AllPOIsconstructor();
let myRoute = new Route();
let counter = 0;

let myIsochrone = new Isochrone();

// var request = require('superagent');
// var Promise = require("bluebird");
// var GHUtil = require("./../../js/GHUtil");
// var ghUtil = new GHUtil();

function AllPOIsconstructor(){}; //Empty Constructor to hold the AllPOIs 

function POI(){
  
  //Method
  this.onDragEnd = function () {
    // alert('I just dragged marker-'+this.id+'.');
    let marker = this;
    let currentMarkerPosition = Object.keys(AllPOIs).indexOf(marker.id.toString());
    let subsequentMarkerPosition = currentMarkerPosition + 1;
    let priorMarkerPosition = currentMarkerPosition - 1;
    let nextmarker = AllPOIs[Object.keys(AllPOIs)[subsequentMarkerPosition]];
    let priormarker = AllPOIs[Object.keys(AllPOIs)[priorMarkerPosition]];
      if (currentMarkerPosition == 0) {
        //Marker is first marker, and doesn't have a layer assigned to it. The mext marker (nextid) does.
          let nextmarker = AllPOIs[Object.keys(AllPOIs)[subsequentMarkerPosition]];
          map.removeLayer(nextmarker.layer);
          map.removeSource(nextmarker.source);
          delete myRoute.geojson[nextmarker.id];
          myRoute.calculateGHArray(marker,nextmarker);
      }
      else if (currentMarkerPosition == Object.keys(AllPOIs).length-1) {
        //Marker is last marker, and there is no subsequent marker (ie no nextid) 
          let priormarker = AllPOIs[Object.keys(AllPOIs)[priorMarkerPosition]];
          map.removeLayer(marker.layer);
          map.removeSource(marker.source);
          delete myRoute.geojson[marker.id];
          myRoute.calculateGHArray(priormarker,marker);
      }
      else {
        //Marker is a "bridge marker" and has a marker before and after it.
          let nextmarker = AllPOIs[Object.keys(AllPOIs)[subsequentMarkerPosition]];
          let priormarker = AllPOIs[Object.keys(AllPOIs)[priorMarkerPosition]];
          map.removeLayer(marker.layer);
          map.removeSource(marker.source);
          map.removeLayer(nextmarker.layer);
          map.removeSource(nextmarker.source);
          delete myRoute.geojson[marker.id];
          myRoute.calculateGHArray(priormarker,marker);
          myRoute.calculateGHArray(marker,nextmarker);
      }
  }

  this.Delete = function(_marker) {
    let id = _marker.id;
    delete AllPOIs[id];
  }

  this.GetPosition = function () {
  }

  this.PriorMarker = function(_marker) {
    let id = _marker.id;
    let currentMarkerPosition = Object.keys(AllPOIs).indexOf(id.toString()); //Find where the unique ID of the current marker, occurs in the ALLPOIs list
    let priorMarkerPosition = currentMarkerPosition - 1; //Move one prior from that current marker
    let priorid = Object.keys(AllPOIs)[priorMarkerPosition];
    return AllPOIs[priorid]; //Return that Marker Object
  }

  this.SubsequentMarker = function (_marker) {
    let id = _marker.id;
    let currentMarkerPosition = Object.keys(AllPOIs).indexOf(id.toString()); //Find where the unique ID of the current marker, occurs in the ALLPOIs list
    let subsequentMarkerPosition = currentMarkerPosition + 1; //Move one prior from that current marker
    let subsequentid = Object.keys(AllPOIs)[subsequentMarkerPosition];
    return AllPOIs[subsequentid]; //Return that Marker Object
  }

  this.AddPOI = function(e){
    let marker = new mapboxgl.Marker({
      //This doesn't work and I don't understand why >> scale: 0.75, - https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker
      // element: el,
      draggable: true,
      color: 'grey',
    })
    marker.setLngLat(e.lngLat);
    marker.addTo(map);
    marker.id = counter;
    marker.source = "source" + marker.id.toString();
    marker.layer = "layer" + marker.id.toString();
    AllPOIs[counter] = marker;
    counter++;
    if (Object.keys(AllPOIs).length >= 2) {
      let startPOI = myPOI.PriorMarker(marker);
      myRoute.calculateGHArray(startPOI, marker);
    }
    //     If I would like to have marker delete be held inside of a popup use this code         marker.setPopup(new mapboxgl.Popup().setHTML("<h6>Undo</h6>"))
    //     If I would like to have marker delete be held inside of a popup use this code         marker.togglePopup(); // toggle popup open or closed


    //give the markers behavior for being dragged
      marker.on('dragend', myPOI.onDragEnd);

    //give the markers behavior for being dragged
      marker.getElement().addEventListener('click', function(e){
        let id = marker.id;
        let markerPosition = Object.keys(AllPOIs).indexOf(id.toString());
        let numberOfPOIs = Object.keys(AllPOIs).length - 1;
        if (markerPosition == 0 && numberOfPOIs == 0){
          myPOI.Delete(marker);
          e.stopPropagation();
        }
        else if (0 < markerPosition && markerPosition < numberOfPOIs) {
          let startPOI = myPOI.PriorMarker(marker);
          let endPOI = myPOI.SubsequentMarker(marker);
          myRoute.RemoveRoute(marker);
          myPOI.Delete(marker);
          myRoute.calculateGHArray(startPOI, endPOI);
          e.stopPropagation();
        }
        else if (markerPosition == 0 && markerPosition != numberOfPOIs) {
          let nextid = myPOI.SubsequentMarker(marker);
          myRoute.RemoveRoute(marker);
          myPOI.Delete(marker);
          e.stopPropagation();
        }
        else if (markerPosition == numberOfPOIs) {
          myRoute.RemoveRoute(marker);
          myPOI.Delete(marker);
          e.stopPropagation();
        }
        else {
          alert("somehow you clicked something that broke something... I say just refresh the page and start over =P");                           //Stop all other code, ie, stop map.on("click") from trying to put down a new marker
        }
        myPOI.Delete(this);
        marker.remove();
        delete AllPOIs[marker.id];                           //remove marker
        e.stopPropagation();                                //Stop all other code, ie, stop map.on("click") from trying to put down a new marker
    });
  }
} //end POI Constructor

function Route(){
  //Parameters
    this.markAs = '';
    this.POIs = {}; 
    this.startPoint = this.POIs[0]; 
    this.endPoint = this.POIs[this.POIs.length-1];
    this.geojson = {}
    this.safe = true;

  //Methods
    this.calculateGHArray = function(_startPOI, _endPOI){
      let startPOI = _startPOI;
      let endPOI = _endPOI;
      let ghRouting = new GraphHopper.Routing(parameters);

      ghRouting.addPoint(new GHInput(startPOI.getLngLat().lat, startPOI.getLngLat().lng));
      ghRouting.addPoint(new GHInput(endPOI.getLngLat().lat, endPOI.getLngLat().lng));
      ghRouting.doRequest()
        .then(function(json) {
          // Add your own result handling here
          AllPOIs[endPOI.id].geojson = json; //***This needs to be fixed. I shouldn't refer to the instance of the object, but the this.geojson doesn't work because this is currently referring to the window. 
          myRoute.showOnMap(endPOI);
          //myRoute.zoomToRoute();
        })
        .catch(function(err) {
          console.error(err.message);
        });
    };

    this.showOnMap = function(_marker){
      let marker = _marker;
      map.addSource(marker.source, { type: 'geojson', data: AllPOIs[marker.id].geojson.paths[0].points });
      map.addLayer({
        "id": marker.layer,
        "type": "line",
        "source": marker.source,
        "paint": {
          "line-color": "brown", //"#4f7ba4",
          "line-opacity": 0.75,
          "line-width": 3
        }
      });
    }

    this.RemoveRoute = function(_marker) {
      let marker = AllPOIs[_marker.id];
      let currentMarkerPosition = Object.keys(AllPOIs).indexOf(marker.id.toString());
      let subsequentMarkerPosition = currentMarkerPosition + 1;
      let nextmarker = AllPOIs[Object.keys(AllPOIs)[subsequentMarkerPosition]];  
      if (currentMarkerPosition == 0) {
        //Marker is first marker, and doesn't have a layer assigned to it. The mext marker (nextid) does.
          delete myRoute.geojson[marker.id];
          map.removeLayer(nextmarker.layer);
          map.removeSource(nextmarker.source);
      }
      else if (currentMarkerPosition == Object.keys(AllPOIs).length-1) {
        //Marker is last marker, and there is no subsequent marker (ie no nextid) 
          delete myRoute.geojson[marker.id];
          let subsequentMarkerPosition = currentMarkerPosition + 1;
          let nextid = Object.keys(AllPOIs)[subsequentMarkerPosition];
          map.removeLayer(marker.layer);
          map.removeSource(marker.source);
      }
      else {
        //Marker is a "bridge marker" and has a marker before and after it.
          delete myRoute.geojson[marker.id];
          let subsequentMarkerPosition = currentMarkerPosition + 1;
          let nextid = Object.keys(AllPOIs)[subsequentMarkerPosition];
          map.removeLayer(marker.layer);
          map.removeSource(marker.source);
          map.removeLayer(nextmarker.layer);
          map.removeSource(nextmarker.source);
      }
    }

    this.zoomToRoute = function(){
      let boundary = []
      boundary[0] = this.geojson.paths[0].bbox[0] - 0.008;
      boundary[1] = this.geojson.paths[0].bbox[1] - 0.008;
      boundary[2] = this.geojson.paths[0].bbox[2] + 0.008;
      boundary[3] = this.geojson.paths[0].bbox[3] + 0.008;
      map.fitBounds(boundary);
    }

    this.ToggleSafeRouting = function(){
      if (myRoute.safe == true) {
        myRoute.safe = false;
      }
      else {
        myRoute.safe = true;
      }
      if (myRoute.safe == true) {
        myRoute.ClearAllRoutes();
        parameters = parametersGHsafe;
        myRoute.RouteAll();
      }
      else if (myRoute.safe == false) {
        myRoute.ClearAllRoutes();
        parameters = parametersGHdangerous;
        myRoute.RouteAll();
      }
    } 

    this.ClearAllMarkers = function(){
      let allPOIvalues = Object.values(AllPOIs);
      for (i = 0; i < allPOIvalues.length; i++ ) {
        crosshair.undoLastMarker();
      } 
    }

    this.RouteAll = function(){
      let allPOIvalues = Object.values(AllPOIs);
      for (i = 0; i < allPOIvalues.length-1; i++ ) {
        myRoute.calculateGHArray(AllPOIs[i],AllPOIs[i+1])
      } 
    }

    this.ClearAllRoutes = function(){
      let allPOIvalues = Object.values(AllPOIs);
      for (i = 1; i < allPOIvalues.length; i++ ) {
        map.removeLayer(AllPOIs[i].layer);
        map.removeSource(AllPOIs[i].source);
      } 
    }
}

function Isochrone(){
  let IsochroneActive = false;

    let isoMarker = new mapboxgl.Marker({
      //This doesn't work and I don't understand why >> scale: 0.75, - https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker
      // element: el,
      draggable: true,
    })
    isoMarker.setLngLat({lng: -110.92, lat: 32.222});
    isoMarker.addTo(map);

  this.generate = function() {
    if (IsochroneActive == false){
      IsochroneActive = true;
    }
    else {
      IsochroneActive = false;
      map.removeLayer('maine0');
      map.removeSource('maine0');
      map.removeLayer('maine1');
      map.removeSource('maine1');
      map.removeLayer('maine2');
      map.removeSource('maine2');
    }

    isoMarker.on('dragend', myIsochrone.regenerate);

    if (IsochroneActive == true) {
            // alert("yo, isochrone coming attcha");
            var ghIsochrone = new GraphHopper.Isochrone({
              key: ghAPI, 
              host: myHostAddress, 
              vehicle: "bike"});


                var pointStr = isoMarker.getLngLat().lat + "," + isoMarker.getLngLat().lng // var pointStr = e.latlng.lat + "," + e.latlng.lng;

                    ghIsochrone.doRequest({point: pointStr, buckets: 3, time_limit: 1000})
                        .then(function (json) {
                            ABC = json;
                            console.log(ABC);
                            map.addSource('maine0', {
                              'type': 'geojson',
                              'data': ABC.polygons[0]
                            });
                            map.addLayer({
                              'id': 'maine0',
                              'type': 'fill',
                              'source': 'maine0',
                              'layout': {},
                              'paint': {
                                'fill-color': '#088',
                                'fill-opacity': 0.4
                              }
                            });
                            map.addSource('maine1', {
                              'type': 'geojson',
                              'data': ABC.polygons[1]
                            });
                            map.addLayer({
                              'id': 'maine1',
                              'type': 'fill',
                              'source': 'maine1',
                              'layout': {},
                              'paint': {
                                'fill-color': '#058',
                                'fill-opacity': 0.4
                              }
                            });
                            map.addSource('maine2', {
                              'type': 'geojson',
                              'data': ABC.polygons[2]
                            });
                            map.addLayer({
                              'id': 'maine2',
                              'type': 'fill',
                              'source': 'maine2',
                              'layout': {},
                              'paint': {
                                'fill-color': '#028',
                                'fill-opacity': 0.4
                              }
                            });

        //Use this is how I had routes to the map. use this as a guide for how i should add isochrone polygons to the map
              //               map.addSource(marker.source, { type: 'geojson', data: AllPOIs[marker.id].geojson.paths[0].points });
              // map.addLayer({
              //   "id": marker.layer,
              //   "type": "line",
              //   "source": marker.source,
              //   "paint": {
              //     "line-color": "brown", //"#4f7ba4",
              //     "line-opacity": 0.75,
              //     "line-width": 3
              //   }
              // });


                        })
                        .catch(function (err) {
                            $('#isochrone-response').text("An error occured: " + err.message);
                        });
      }

    }

  this.regenerate = function (){
    map.removeLayer('maine0');
    map.removeSource('maine0');
    map.removeLayer('maine1');
    map.removeSource('maine1');
    map.removeLayer('maine2');
    map.removeSource('maine2');
    myIsochrone.generate();
  } 
}


  GraphHopperIsochrone = function (args) {
    this.time_limit = 2000;
    this.distance_limit = 0;
    this.buckets = 3;
    this.vehicle = "bike";
    this.point = [];
    this.host = "https://graphhopper.com/api/1";
    this.debug = false;
    this.basePath = '/isochrone';
    this.timeout = 30000;
    this.reverse_flow = false;

    ghUtil.copyProperties(args, this);
  };

  GraphHopperIsochrone.prototype.getParametersAsQueryString = function (args) {
      var qString = "point=" + args.point;
      qString += "&time_limit=" + args.time_limit;
      qString += "&distance_limit=" + args.distance_limit;
      qString += "&buckets=" + args.buckets;
      qString += "&vehicle=" + args.vehicle;
      qString += "&reverse_flow=" + args.reverse_flow;

      if (args.debug)
          qString += "&debug=true";

      return qString;
  };

  GraphHopperIsochrone.prototype.doRequest = function (reqArgs) {
      var that = this;

      return new Promise(function(resolve, reject) {
          var args = ghUtil.clone(that);
          if (reqArgs)
              args = ghUtil.copyProperties(reqArgs, args);

          var url = args.host + args.basePath + "?" + that.getParametersAsQueryString(args) + "&key=" + args.key;

          request
              .get(url)
              .accept('application/json')
              .timeout(args.timeout)
              .end(function (err, res) {
                  if (err || !res.ok) {
                      reject(ghUtil.extractError(res, url));
                  } else if (res) {
                      resolve(res.body);
                  }
              });
      });
  };







//Add a marker on mouse click, and create a route if two or more markers exist
  map.on('click', function(e) {
    myPOI.AddPOI(e);
  });


  // function onDragEnd() {
  //   // alert('I just dragged marker-'+this.id+'.');
  //   let marker = AllPOIs[currentMarkerPosition];
  //   let currentMarkerPosition = Object.keys(AllPOIs).indexOf(marker.id.toString());
  //   let subsequentMarkerPosition = currentMarkerPosition + 1;
  //   let priorMarkerPosition = currentMarkerPosition - 1;
  //   let nextmarker = AllPOIs[Object.keys(AllPOIs)[subsequentMarkerPosition]];
  //   let priormarker = AllPOIs[Object.keys(AllPOIs)[priorMarkerPosition]];
  //     if (currentMarkerPosition == 0) {
  //       //Marker is first marker, and doesn't have a layer assigned to it. The mext marker (nextid) does.
  //         let nextmarker = AllPOIs[Object.keys(AllPOIs)[subsequentMarkerPosition]];
  //         map.removeLayer(nextmarker.layer);
  //         map.removeSource(nextmarker.source);
  //         delete myRoute.geojson[nextmarker.id];
  //         myRoute.calculateGHArray(marker,nextmarker);
  //     }
  //     else if (currentMarkerPosition == Object.keys(AllPOIs).length-1) {
  //       //Marker is last marker, and there is no subsequent marker (ie no nextid) 
  //         let priormarker = AllPOIs[Object.keys(AllPOIs)[priorMarkerPosition]];
  //         map.removeLayer(marker.layer);
  //         map.removeSource(marker.source);
  //         delete myRoute.geojson[marker.id];
  //         myRoute.calculateGHArray(priormarker,marker);
  //     }
  //     else {
  //       //Marker is a "bridge marker" and has a marker before and after it.
  //         let nextmarker = AllPOIs[Object.keys(AllPOIs)[subsequentMarkerPosition]];
  //         let priormarker = AllPOIs[Object.keys(AllPOIs)[priorMarkerPosition]];
  //         map.removeLayer(marker.layer);
  //         map.removeSource(marker.source);
  //         map.removeLayer(nextmarker.layer);
  //         map.removeSource(nextmarker.source);
  //         delete myRoute.geojson[marker.id];
  //         myRoute.calculateGHArray(priormarker,marker);
  //         myRoute.calculateGHArray(marker,nextmarker);
  //     }
  // }


function MobileMarkers() {
  this.ToggleCrosshair = function(){
    //If I want a crosshair instead of the Marker
    // create a HTML element for each feature
    // var el = document.createElement('div');
    // el.className = 'crosshair';
    if (typeof centerdot !== 'undefined') {
      centerdot.remove();
      delete centerdot;
    }
    else {
      centerdot = new mapboxgl.Marker({
      //element: el, if I want a crosshair instead of the marker
      draggable: false,
      color: 'brown',
      scale: 0.5,
      })

      centerdot.setLngLat(map.getCenter())
      centerdot.addTo(map);

      map.on('move', function(e) {
        if (typeof centerdot != 'undefined') {
          centerdot.setLngLat(map.getCenter());
        }
      });
    }
    
  }

  this.DropCrosshairMarker = function(){
    map.on('click', function() {
      let marker = new mapboxgl.Marker({
        draggable: true,
        color: 'blue',
      })

      marker.setLngLat(map.getCenter())
      marker.addTo(map);
    });

  }
  this.AddMarker = function(e){
    let marker = new mapboxgl.Marker({
      //This doesn't work and I don't understand why >> scale: 0.75, - https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker
      // element: el,
      draggable: true,
      color: 'grey',
    })
    marker.setLngLat(map.getCenter());
    marker.addTo(map);
    marker.id = counter;
    marker.source = "source" + marker.id.toString();
    marker.layer = "layer" + marker.id.toString();
    AllPOIs[counter] = marker;
    counter++;
    if (Object.keys(AllPOIs).length >= 2) {
      let startPOI = myPOI.PriorMarker(marker);
      myRoute.calculateGHArray(startPOI, marker);
    }
    //     If I would like to have marker delete be held inside of a popup use this code         marker.setPopup(new mapboxgl.Popup().setHTML("<h6>Undo</h6>"))
    //     If I would like to have marker delete be held inside of a popup use this code         marker.togglePopup(); // toggle popup open or closed


    //give the markers behavior for being dragged
      marker.on('dragend', myPOI.onDragEnd);

    //give the markers behavior for being dragged
      marker.getElement().addEventListener('click', function(e){
        let id = marker.id;
        let markerPosition = Object.keys(AllPOIs).indexOf(id.toString());
        let numberOfPOIs = Object.keys(AllPOIs).length - 1;
        if (markerPosition == 0 && numberOfPOIs == 0){
          myPOI.Delete(marker);
          e.stopPropagation();
        }
        else if (0 < markerPosition && markerPosition < numberOfPOIs) {
          let startPOI = myPOI.PriorMarker(marker);
          let endPOI = myPOI.SubsequentMarker(marker);
          myRoute.RemoveRoute(marker);
          myPOI.Delete(marker);
          myRoute.calculateGHArray(startPOI, endPOI);
          e.stopPropagation();
        }
        else if (markerPosition == 0 && markerPosition != numberOfPOIs) {
          let nextid = myPOI.SubsequentMarker(marker);
          myRoute.RemoveRoute(marker);
          myPOI.Delete(marker);
          e.stopPropagation();
        }
        else if (markerPosition == numberOfPOIs) {
          myRoute.RemoveRoute(marker);
          myPOI.Delete(marker);
          e.stopPropagation();
        }
        else {
          alert("somehow you clicked something that broke something... I say just refresh the page and start over =P");                           //Stop all other code, ie, stop map.on("click") from trying to put down a new marker
        }
        myPOI.Delete(this);
        marker.remove();
        delete AllPOIs[marker.id];                           //remove marker
        e.stopPropagation();                                //Stop all other code, ie, stop map.on("click") from trying to put down a new marker
    });
  }

  this.undoLastMarker = function(){
    let numberofPOIs = Object.keys(AllPOIs).length - 1;
    let lastmarkeridstring = Object.keys(AllPOIs)[numberofPOIs];
    let lastmarker = AllPOIs[Number(lastmarkeridstring)];
    if (Object.keys(AllPOIs).length == 1) {
      myPOI.Delete(lastmarker);
      lastmarker.remove()
    }
    else if (Object.keys(AllPOIs).length != 1) {
      myRoute.RemoveRoute(lastmarker);
      myPOI.Delete(lastmarker);
      lastmarker.remove()
    }
  }
}

let crosshair = new MobileMarkers();

//Add Button Behavior for Crosshair Routing
  document.getElementById("drawRoute").addEventListener("click", crosshair.ToggleCrosshair);
  document.getElementById("dropCrosshairMarker").addEventListener("click", crosshair.AddMarker);
  document.getElementById("undoCrosshairMarker").addEventListener("click", crosshair.undoLastMarker);
  document.getElementById("cancelCrosshairMarker").addEventListener("click", function() { myRoute.ClearAllMarkers;crosshair.ToggleCrosshair();});
  document.getElementById("isochroneButton").addEventListener("click", myIsochrone.generate);
  document.getElementById("routerToggle").addEventListener("click", myRoute.ToggleSafeRouting);

  $(function() {
      $('#routerToggle').change(function() {
        myRoute.ToggleSafeRouting();
      });
    });













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
    // document.getElementById("drawRoute").addEventListener("click", drawUsingPoints);

}

function drawUsingPoints(){
  //Clear off the screen before drawing a route 
    if (checkRouteOnScreen()) {
      //Route already exists on map
        removeRouteLayerAndSource();
        clearWCoordinates();
    }

  wasRouteDrawnOrSearched = "drawn";

  //Documentation: https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/MODES.md
  // document.body.style.cursor = "crosshair"; not working. I just wrote a css class that changes it to crosshair permanently for now..
    var LotsOfPointsMode = {};

  // When the mode starts this function will be called.
  // The `opts` argument comes from `draw.changeMode('lotsofpoints', {count:7})`.
  // The value returned should be an object and will be passed to all other lifecycle functions
    LotsOfPointsMode.onSetup = function(opts) {
      var state = {};
      state.count = opts.count || 0;
      return state;
    };

  // Whenever a user clicks on the map, Draw will call `onClick`
    LotsOfPointsMode.onClick = function(state, e) {
      // `this.newFeature` takes geojson and makes a DrawFeature
      var point = this.newFeature({
        type: 'Feature',
        properties: {
          count: state.count
        },
        geometry: {
          type: 'Point',
          coordinates: [e.lngLat.lng, e.lngLat.lat]
        }
      });
      this.addFeature(point); // puts the point on the map
      
      nodecount = draw.getAll().features.length
      if (nodecount > 1) {
        var startPoint = draw.getAll().features[nodecount-2].geometry.coordinates;
        var endPoint = draw.getAll().features[nodecount-1].geometry.coordinates;
        W.coordinates[0] = startPoint;
        W.coordinates[1] = endPoint;
        generateRoute();
        console.log(R);
        console.log("I think R should be defined here");
        
      }
    };

  // Whenever a user clicks on a key while focused on the map, it will be sent here
    LotsOfPointsMode.onKeyUp = function(state, e) {
      if (e.keyCode === 27) return this.changeMode('simple_select');
    };

  // This is the only required function for a mode.
  // It decides which features currently in Draw's data store will be rendered on the map.
  // All features passed to `display` will be rendered, so you can pass multiple display features per internal feature.
  // See `styling-draw` in `API.md` for advice on making display features
    LotsOfPointsMode.toDisplayFeatures = function(state, geojson, display) {
      display(geojson);
    };

  //Parameters of MapboxDraw Tool
    draw = new MapboxDraw({
        displayControlsDefault: true, //default true - but I want custom controls (just points and trash)
        accessToken: "pk.eyJ1IjoiZHlsYW5jIiwiYSI6Im53UGgtaVEifQ.RJiPqXwEtCLTLl-Vmd1GWQ",
        defaultMode: 'lots_of_points',
        modes: Object.assign({
          lots_of_points: LotsOfPointsMode,
        }, MapboxDraw.modes),
        clickBuffer: 20, //default 2 - for mouse: # of pixels buffer around vertex that will respond to click
        touchBuffer: 25, //default 25 - Same as above but for touch
        // keybindings: true, //default true
        // touchEnabled: true, //default true
        // boxSelect: true, //default true
        // controls: {
        // //   point: true,
        //   trash: true,
        // //   line_string: true
        // },
        //styles examples : https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/EXAMPLES.md
        styles: [
            {
              'id': 'regular-points-halo-rim',
              'type': 'circle',
              'filter': ['all',
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['==', 'active', 'false']],
              'paint': {
                'circle-radius': 10,
                'circle-color': '#4f7ba4'
              }
            },
            {
              'id': 'regular-points-halo',
              'type': 'circle',
              'filter': ['all',
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['==', 'active', 'false']],
              'paint': {
                'circle-radius': 9,
                'circle-color': '#f9f9f9'
              }
            },
            {
              'id': 'regular-points',
              'type': 'circle',
              'filter': ['all',
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['==', 'active', 'false']],
              'paint': {
                'circle-radius': 6,
                'circle-color': '#4f7ba4'
              }
            },
            {
              'id': 'highlight-selected-points-halo-rim',
              'type': 'circle',
              'filter': ['all',
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['==', 'active', 'true']],
              'paint': {
                'circle-radius': 14,
                'circle-color': '#bc5050'
              }
            },
            {
              'id': 'highlight-selected-points-halo',
              'type': 'circle',
              'filter': ['all',
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['==', 'active', 'true']],
              'paint': {
                'circle-radius': 13,
                'circle-color': '#f9f9f9'
              }
            },
            {
              'id': 'highlight-selected-points',
              'type': 'circle',
              'filter': ['all',
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['==', 'active', 'true']],
              'paint': {
                'circle-radius': 9,
                'circle-color': '#bc5050'
              }
            },
        ]
      });

  // Add the Draw control to your map
    map.addControl(draw);
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
        newRouteLayer(R, draw.getAll().features.length);
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