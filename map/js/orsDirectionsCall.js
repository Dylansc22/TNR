window.addEventListener("load", doEverything());//switch to everythingfunction2 when ready to make the leap to the cleaner code

function doEverything(){
  illCleanThisFunctionUpLater();
}

// function OOP(){
  let parametersGHsafe = {
    host: "http://144.202.64.252:8989", //host: "http://localhost:8989",
    profile: "pathways1", // pathways1, pathways2, pathways3, pathways4, pathways5, co2car
    details: ["road_class", "distance"]
  }

  let parametersGHdangerous = {
    host: "http://144.202.64.252:8989", //host: "http://localhost:8989",
    profile: "pathways6", // pathways1, pathways2, pathways3, pathways4, pathways5, co2car
    details: ["road_class", "distance"]
  }

  let parametersCO2Car = {
    host: "http://144.202.64.252:8989", //host: "http://localhost:8989",
    profile: "co2car", // pathways1, pathways2, pathways3, pathways4, pathways5, co2car
  }

    //Other Parameters
    //Code does not like any parameter that isn't the profile
    //vehicle: "bike",
    //weighting: "shortest", // "custom", "shortest", "fastest"
    //turn_costs: false, 
    //elevation: false,
    // key: keys.graphhopper,
    //details: ["road_class", "distance"]


  let parameters = parametersGHsafe;
  AllMarkers = [];
  let counter = 0;
  let mode = "closed";
  let cursor = "outsideWarningBubble";
  let safe = true;
  let pathwayscolor = '#1c4358';
  let nighttimemode = false;
  let satallitemode = false;
  let zoomed = false;
  // let myIsochrone = new Isochrone();

  //Button Functionality
    let CO2 = {
      Measure: function() {
                  let sum = 0;
                  for (i = 1; i < AllMarkers.length; i++) {
                    let distanceMiles = AllMarkers[i].CO2geojson.paths[0].distance/5280;
                    let yourCarMPG = 25;
                    let poundsCO2ProducedPerGallonOfGas = 20;
                    let LbsofCO2 = distanceMiles * yourCarMPG / poundsCO2ProducedPerGallonOfGas;
                    sum = Math.round((sum + LbsofCO2)*10)/10;
                  }
                  return sum;
                },
      Display: function() {
                  // alert(CO2.Measure(AllPOIs));      
                  document.getElementById("offsetcalc").innerHTML = CO2.Measure();
                  document.getElementById("offsetunits").innerHTML = " lbs CO2";
                  document.getElementById("offsettext").innerHTML = "Offset from Atmosphere";
                }
    }

    let Search = {
      generateRoute: function(e){
        $('#directionshere').toggleClass('directionsbuttonvisible'); //I know this is super hacky to put button behavior in my routing function, but this was the only spot i could get it to work, and I'm lazy tonight
            if (AllMarkers.length>0) {
              for (i = AllMarkers.length; i>=0; i--){
                undoLastMarker();
              }
            }
            //So geolocate.trigger()is kinda a funky promise-resolve-fail-async thing, which I don't understand
            //So as a workaround, I allow 1000ms (1 sec), for the geolocate to finish, and *then* I set that coordinate as a marker position
            //And obviously set the searched location as a marker position as well.  
              geolocate.trigger();
              setTimeout(function(){
                mode = "geolocate";
                AddMarker();
                mode = "searched";
                AddMarker();
              }, 1000);

              //This I feel is the proper way to do the above code but I was never able to get it to work - stupid promise functions!
              // geolocate.on("geolocate", function(e){
              //   mode = "geolocate";
              //   AddMarker();
              //   mode = "searched";
              //   AddMarker();
              // });
                mode = "closed";
              setTimeout(function(){zoomToSearchedRoute()}, 2600);
      }
    }

    let zoomToSearchedRoute = () => {
        if (safe) {
            let boundary = []
            boundary[0] = AllMarkers[1].safeRoute.paths[0].bbox[0] - 0.008;
            boundary[1] = AllMarkers[1].safeRoute.paths[0].bbox[1] - 0.008;
            boundary[2] = AllMarkers[1].safeRoute.paths[0].bbox[2] + 0.008;
            boundary[3] = AllMarkers[1].safeRoute.paths[0].bbox[3] + 0.008;
            map.fitBounds(boundary);
          } else {
            let boundary = []
            boundary[0] = AllMarkers[1].dangerousRoute.paths[0].bbox[0] - 0.008;
            boundary[1] = AllMarkers[1].dangerousRoute.paths[0].bbox[1] - 0.008;
            boundary[2] = AllMarkers[1].dangerousRoute.paths[0].bbox[2] + 0.008;
            boundary[3] = AllMarkers[1].dangerousRoute.paths[0].bbox[3] + 0.008;
            map.fitBounds(boundary);
          }
      }

    let zoomToFullRoute = () => {
            let boundary = []
            let adjustment = 0.01
            let a = AllMarkers[0].getLngLat().lng;
            let b = AllMarkers[0].getLngLat().lat;
            let c = AllMarkers[AllMarkers.length-1].getLngLat().lng;
            let d = AllMarkers[AllMarkers.length-1].getLngLat().lat;
            if (a<c) {
              a = a - adjustment;
              c = c + adjustment;
            } else {
              c = c - adjustment;
              a = a + adjustment;
            }
            if (b<d) {
              b = b - adjustment;
              d = d + adjustment;
            } else {
              b = b + adjustment;
              d = d - adjustment;
            }
            boundary = [a,b,c,d];
            map.fitBounds(boundary);
            // map.zoomTo(map.getZoom() - 0.5);
    } 

    let setPathwayColor = () => {
      //this could probably be written more efficiently
        if (safe == true) {
          if (satallitemode == true && nighttimemode == false) {
            pathwayscolor = 'yellow';
          } 
          else if (nighttimemode == true && satallitemode == false) {
            pathwayscolor = 'silver';
          } else {
            pathwayscolor = '#1c4358';
            for (i=1;i<=AllMarkers.length-1;i++) {
              map.setPaintProperty(AllMarkers[i].layer,'line-color', pathwayscolor);
              map.setPaintProperty(AllMarkers[i].layer,'line-opacity', 0.9);
            }
          }
        }
        else if (safe == false){
          if (satallitemode == true && nighttimemode == false) {
            pathwayscolor = 'yellow';
          } 
          else if (nighttimemode == true && satallitemode == false) {
            pathwayscolor = 'silver';
          } else {
            pathwayscolor = '#8a2929';
            for (i=1;i<=AllMarkers.length-1;i++) {
              map.setPaintProperty(AllMarkers[i].layer,'line-color', pathwayscolor);
              map.setPaintProperty(AllMarkers[i].layer,'line-opacity', 0.9);
            }
          }
        }
    }

    let ToggleSafeRouting = async () => {
        if (safe == true) {
          safe = false;
          setPathwayColor();
          if (AllMarkers.length>0) {
            //Remove the safe route entirely
            for (n = AllMarkers.length - 1; n > 0; n-- ) {
              map.removeLayer(AllMarkers[n].layer);
              map.removeSource(AllMarkers[n].source);
              removeMarkerDangerZone(AllMarkers[n]);
            } 
            //re-add the dangerous route
            for (n=1;n<AllMarkers.length;n++){
              displayMarkerRoute(AllMarkers[n]);
              await calculateMarkerDangerZone(AllMarkers[n]);
              displayMarkerDangerZone(AllMarkers[n]);
            }
          }
        }
        else if (safe == false) {
          safe = true;
          setPathwayColor();
          if (AllMarkers.length>0) {
            //Remove the dangerous route entirely
            for (n = AllMarkers.length - 1; n > 0; n-- ) {
              map.removeLayer(AllMarkers[n].layer);
              map.removeSource(AllMarkers[n].source);
              removeMarkerDangerZone(AllMarkers[n]);
            } 
            //re-add the dangerous route
            for (n=1;n<AllMarkers.length;n++){
              displayMarkerRoute(AllMarkers[n]);
              await calculateMarkerDangerZone(AllMarkers[n]);
              displayMarkerDangerZone(AllMarkers[n]);
            }
          }
        }
    } 

  function undoLastMarker(){
    if (AllMarkers.length>0){
      let l = AllMarkers.length - 1;
      let lastmarker = AllMarkers[l];
      lastmarker.destoryMarkersRoute();
      lastmarker.vaporizeMarker();
      lastmarker.recount();
      CO2.Display();
    }
  }

  function setDrawMode(_mode) {
      mode = _mode;
  }

  function toggleDrawMode() {
    if(mode !== "drawing") {
      mode = "drawing";
      centerdot.remove();
      delete centerdot;
    } else {
      mode = "crosshair";
      centerdot = new mapboxgl.Marker({
        //element: el, if I want a crosshair instead of the marker
        draggable: false,
        color: 'brown', //'#363636',
        scale: 0.8,
        })

        centerdot.setLngLat(map.getCenter())
        centerdot.addTo(map);

        map.on('move', function(e) {
          if (typeof centerdot !== 'undefined') {
            centerdot.setLngLat(map.getCenter());
          }
        });
    }
  }

  function addCrosshair(){
    if (mode !== "crosshair") {
    setDrawMode("crosshair");
    centerdot = new mapboxgl.Marker({
        //element: el, if I want a crosshair instead of the marker
        draggable: false,
        color: 'brown', //'#363636',
        scale: 0.8,
        })

        centerdot.setLngLat(map.getCenter())
        centerdot.addTo(map);

        map.on('move', function(e) {
          if (typeof centerdot !== 'undefined') {
            centerdot.setLngLat(map.getCenter());
          }
        });
        
    } else {
      setDrawMode("closed");
      centerdot.remove();
      delete centerdot;
    }
  }

  AddMarker = async (e) => {
      let marker = new mapboxgl.Marker({
        //This doesn't work and I don't understand why >> scale: 0.75, - https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker
        // element: el,
        draggable: true,
        color: 'grey',
        scale: 0.75,
      });
      if (mode == "drawing") {
        marker.setLngLat(e.lngLat);
      } 
      else if (mode == "crosshair") {
        marker.setLngLat(map.getCenter());
      } 
      else if (mode == "geolocate") {
        let templat = geolocate._lastKnownPosition.coords.latitude;
        let templng = geolocate._lastKnownPosition.coords.longitude;
        marker.setLngLat({"lng":templng, "lat":templat});
      }
      else if (mode == "searched") {
        marker.setLngLat(geocoder.mapMarker.getLngLat());
        geocoder.clear();
      } 
      marker.addTo(map);
      marker.id = AllMarkers.length;
      AllMarkers[AllMarkers.length] = marker;
      marker.CO2geojson = {};
      marker.geojson = {};
      marker.uniqueID = counter.toString();
      marker.source = "source" + counter.toString();
      marker.layer = "layer" + counter.toString();
      counter++;

      //Click behavior for marker 
      marker.getElement().addEventListener('click', (e) =>{
        // alert("marker number " + marker.id + " is about to go bye-bye");
        let position = determineMarkerPosition(marker);
        if (position == "only") {
          marker.remove();
          marker.recount();
          e.stopPropagation();
        }
        //* is first Marker - Redraw M --^--- M ------ M
        else if (position == "first") {
          removeRouteandZone(AllMarkers[marker.id+1]);
          marker.remove();
          marker.recount();
          e.stopPropagation();
        } 
        //M is last Marker - Redraw M ----- M --^-- M 
        else if (position == "last") {
          removeRouteandZone(marker);
          marker.remove();
          marker.recount();
          e.stopPropagation();         
        }
        //M is a middle Marker - Redraw Both M --^-- M --^-- M 
        else {
          removeRouteandZone(marker);
          removeRouteandZone(AllMarkers[marker.id+1]);
          marker.remove();
          marker.recount(); 
          calculateRoute(AllMarkers[marker.id-1],AllMarkers[marker.id]);
          e.stopPropagation();
        }
         


        // removeRouteandZone(marker);
        // marker.destoryMarkersRoute.call(marker);
        // marker.vaporizeMarker.call(marker);
        // marker.recount.call(marker);
        // CO2.Display();

         //Stop Propagation so that a new marker isn't added on click
      });



      //Drag behavior for marker
      marker.on('dragend', () => {
        redrawMarkerRoute(marker);
      });

      marker.vaporizeMarker = function() {
        //Remove marker
        this.remove();
      } 
      marker.destoryMarkersRoute = function(){
        //M ----- M ------ M ------ M ------ M
        
        //M is the only Marker
        if (this.id == 0 && AllMarkers.length == 1) {
          return
        //There is no route to delete...
        //Sooo... Yea.... I guess... I don't need to write any code for here
        //Maybe write a short story about rocket ships of super intelligent dogs(?)  
        }
        //M is first Marker
        // M ------ is deleted
        else if (this.id == 0 && AllMarkers.length > 1) {
          AllMarkers[1].safeRoute = {};
          AllMarkers[1].dangerousRoute = {};
          AllMarkers[1].CO2geojson = {};          
          map.removeLayer(AllMarkers[1].layer);
          map.removeSource(AllMarkers[1].source);
          removeMarkerDangerZone(AllMarkers[1]);
        } 
        //M is last Marker
        // ------ M is deleted
        else if (this.id == AllMarkers.length - 1 && AllMarkers.length > 1) {
          //this is the last marker;
          map.removeLayer(this.layer);
          map.removeSource(this.source);
          removeMarkerDangerZone(this);
        }
        //M is a middle Marker
        //------ M ------ is deleted
        //M ---- - ---- M route is calculated
        else {
          map.removeLayer(this.layer);
          map.removeSource(this.source);
          map.removeLayer(AllMarkers[this.id+1].layer);
          map.removeSource(AllMarkers[this.id+1].source);
          removeMarkerDangerZone(this);
          removeMarkerDangerZone(AllMarkers[this.id+1])
        }
      }
      marker.recount = function(){
          AllMarkers.splice(this.id,1) //Remove the approprate marker from the Array
          for (i = this.id; i<AllMarkers.length; i++){ //Re-number the marker id's and poi id's to match their position in the array  
             //This is because there is never a layer0/source0/geojson0. Layers are associated when there are at least *two* markers. 
              AllMarkers[i].id = i; //return the Markers to match
            }
      }     

      //Generate route when 2 or more markers are on screen
      if (AllMarkers.length > 1){
        await calculateRoute(AllMarkers[AllMarkers.length-2], AllMarkers[AllMarkers.length-1]);
      }
  }



async function who() {
    setTimeout(() => {
      console.log('🤡');
    }, 2000);
}

async function what() {
    setTimeout(() => {
      console.log('lurks');
    }, 3000);
}

async function where() {
    setTimeout(() => {
      console.log('intheshadows');
    }, 5000);
}

  tester = async () => {
    try{
      await who();
      await what();
      await where();
    } catch {
      //
    }
  }

  calculateRoute = async (startMarker,endMarker) => {
    try {
      let promise_safegeojson = safeRouteCalc(startMarker,endMarker);
      let promise_dangerousgeojson = dangerousRouteCalc(startMarker,endMarker);
      let promise_Co2geojson = CO2RouteCalc(startMarker,endMarker);
      let AllRouteArray = [];

      await Promise.all([promise_safegeojson, promise_dangerousgeojson, promise_Co2geojson])
        .then(results => {
          AllRouteArray = results;
          // console.log(AllRouteArray);
        })
        .catch(error => {
          console.log("something went wrong in the route generation of the safe route, dangerous route, or CO2 Estimate");
        });

      //Add geojsons to AllMarkers Array of Objects
        endMarker.safeRoute = AllRouteArray[0];
        endMarker.dangerousRoute = AllRouteArray[1];
        endMarker.CO2geojson = AllRouteArray[2];
        AllMarkers[endMarker.id] = endMarker;
      //Visualize Data On Screen
        displayMarkerRoute(endMarker);
        CO2.Display();
        await calculateMarkerDangerZone(endMarker);
        displayMarkerDangerZone(endMarker);
    } catch (err) {
      console.error("our error", err)
    }
          // AllMarkers[AllMarkers.length-1].displayMarkerRoute();
          //Turf Stuff
              // await turfDanger();
              // await openCO2Box();
                  // if (safe) {
                  //   safeRouteCalc(_start,_end);
                  // } else {
                  //   dangerousRouteCalc(_start,_end);
                  // }
  }

  removeMarkerDangerZone = (marker) => {
    if (typeof(marker.warning) !== 'undefined') {
      map.removeLayer('dangerdot'+ marker.id);
      map.removeLayer('dangercircle'+ marker.id);
      map.removeSource('dangersource'+ marker.id);
    }
  }

  UndoButtonClicked = function(marker){
    marker.undoLastMarker();
  }

  undoLastMarker = function(marker){
    this.destoryMarkersRoute();
    this.vaporizeMarker();
    // marker.recount();
  }

  function determineMarkerPosition (_marker) {
    let marker = _marker;
    if (marker.id == 0 && AllMarkers.length == 1) { 
      return "only" 
    }
    else if (marker.id == 0 && AllMarkers.length > 1) { 
      return "first" 
    }
    else if (marker.id == AllMarkers.length - 1 && AllMarkers.length > 1) { 
      return "last" 
    }
    else { 
      return "middle" 
    }
  }

  function removeRouteandZone (_marker) {
    let marker = _marker;
    map.removeLayer(marker.layer);
    map.removeSource(marker.source)
    if (marker.warning.data.geometry.coordinates.length > 0) {
      map.removeLayer("dangerdot"+marker.id);
      map.removeLayer("dangercircle"+marker.id);
      map.removeSource("dangersource"+marker.id);
    }
  }

      redrawMarkerRoute = async function(_marker){
        let marker = _marker;
        let position = determineMarkerPosition(marker);
        //M ----- M ------ M ------ M ------ M
        //* is the only Marker - There is no route to redraw...
        if (position == "only") {
          return
        }
        //* is first Marker - Redraw M --^--- M ------ M
        else if (position == "first") {
          AllMarkers[1].safeRoute = {};
          AllMarkers[1].dangerousRoute = {};          
          AllMarkers[1].CO2geojson = {};
          removeRouteandZone(AllMarkers[1]);
          await calculateRoute(marker,AllMarkers[marker.id+1]);
        } 
        //M is last Marker - Redraw M ----- M --^-- M 
        else if (position == "last") {
          removeRouteandZone(marker);
          await calculateRoute(AllMarkers[marker.id-1],marker);         
        }
        //M is a middle Marker - Redraw Both M --^-- M --^-- M 
        else {
          removeRouteandZone(marker);
          removeRouteandZone(AllMarkers[marker.id+1]);
          await calculateRoute(AllMarkers[marker.id-1],marker);  
          await calculateRoute(marker,AllMarkers[marker.id+1]);       
        }
      }



      safeRouteCalc = (start,end) => {
          let ghRouting = new GraphHopper.Routing(parametersGHsafe);
          delete ghRouting.vehicle;
          ghRouting.addPoint(new GHInput(start.getLngLat().lat, start.getLngLat().lng));
          ghRouting.addPoint(new GHInput(end.getLngLat().lat, end.getLngLat().lng));
          return ghRouting.doRequest();
      }

      dangerousRouteCalc = (start,end) => {
          let ghRouting = new GraphHopper.Routing(parametersGHdangerous);
          delete ghRouting.vehicle;
          ghRouting.addPoint(new GHInput(start.getLngLat().lat, start.getLngLat().lng));
          ghRouting.addPoint(new GHInput(end.getLngLat().lat, end.getLngLat().lng));
          return ghRouting.doRequest();
      }

      CO2RouteCalc = (start,end) => {
        let ghRouting = new GraphHopper.Routing(parametersCO2Car);
        delete ghRouting.vehicle;
        ghRouting.addPoint(new GHInput(start.getLngLat().lat, start.getLngLat().lng));
        ghRouting.addPoint(new GHInput(end.getLngLat().lat, end.getLngLat().lng));
        return ghRouting.doRequest();
      }

      displayMarkerRoute = (marker) => {
        if (safe == true) {
          map.addSource(marker.source, { type: 'geojson', data: marker.safeRoute.paths[0].points });
        } else {
          map.addSource(marker.source, { type: 'geojson', data: marker.dangerousRoute.paths[0].points });
        }

        map.addLayer({
          "id": marker.layer,
          "type": "line",
          "source": marker.source,
          "paint": {
            "line-color": pathwayscolor,//"#FF6600" //, //"#4f7ba4",
            "line-dasharray": [2,1.5], //[dashes, gaps] measured in units of line-width
            "line-opacity": 0.9,
            "line-width": {
                "type": "exponential",
                "base": 1.5,
                "stops": [
                    [0, 4.5 * Math.pow(2, (0 - 9))], //[0, baseWidth * Math.pow(2, (0 - baseZoom))],
                    [24, 4.5 * Math.pow(2, (24 - 18))] //[0, baseWidth * Math.pow(2, (0 - baseZoom))],
                ]
            }
          }
        });
      }

      CrossCarefullyOnScreen = () => {

      }

      // marker.calculateRoute = (start, end) => {
      //     let CO2ghRouting = new GraphHopper.Routing(parametersCO2Car);
      //     delete CO2ghRouting.vehicle;

      //     CO2ghRouting.addPoint(new GHInput(start.getLngLat().lat, start.getLngLat().lng));
      //     CO2ghRouting.addPoint(new GHInput(end.getLngLat().lat, end.getLngLat().lng));
      //     CO2ghRouting.doRequest()
      //       .then(function(json) {
      //         // Add your own result handling here
      //         end.CO2geojson = json;
      //         CO2.Display();
      //       })
      //       .catch(function(err) {
              
      //         // alert("An error may have occured! No big deal - but remember this is a pre-alpha release.\n\n Most likely the error occured on the server, and may be down. Or the point you picked is outside my calculated area of my mapped bike-routing area!\n\n If this continues please reach out to dylan.cobean@gmail.com");
      //         console.error(err.message);
      //       });

      //     let ghRouting = new GraphHopper.Routing(parameters);
      //     delete ghRouting.vehicle;

      //     ghRouting.addPoint(new GHInput(start.getLngLat().lat, start.getLngLat().lng));
      //     ghRouting.addPoint(new GHInput(end.getLngLat().lat, end.getLngLat().lng));
      //     ghRouting.doRequest()
      //       .then(function(json) {
      //         // Add your own result handling here
      //         end.geojson = json; //***This needs to be fixed. I shouldn't refer to the instance of the object, but the this.geojson doesn't work because this is currently referring to the window. 
      //         map.addSource(end.source, { type: 'geojson', data: end.geojson.paths[0].points });
      //         map.addLayer({
      //           "id": end.layer,
      //           "type": "line",
      //           "source": end.source,
      //           "paint": {
      //             "line-color": pathwayscolor,//"#FF6600" //, //"#4f7ba4",
      //             "line-opacity": 0.9,
      //             "line-width": {
      //                 "type": "exponential",
      //                 "base": 1.5,
      //                 "stops": [
      //                     [0, 3.5 * Math.pow(2, (0 - 9))], //[0, baseWidth * Math.pow(2, (0 - baseZoom))],
      //                     [24, 3.5 * Math.pow(2, (24 - 18))] //[0, baseWidth * Math.pow(2, (0 - baseZoom))],
      //                 ]
      //             }
      //           }
      //         });
      //       })
      //       .catch(function(err) {
      //         alert("Ahhh crap! Something went wrong! And now I need to fix whatever this is too.\n\n Most likely my bicycle-routing server is down, or the point you picked is outside my calculated area of my mapped bike-routing area!");
      //         console.error(err.message);
      //       });
      // };
      moved = function(marker) {
        redrawMarkerRoute(marker);
        // if (marker.id !== 0 && marker.id !== AllMarkers.length-1) {
        //   // testFunction.call("apples","oranges");
        //   this.calculateRoute(AllMarkers[marker.id-1],marker);
        // }
        // if (marker.id !== 0 && marker.id !== AllMarkers.length-1) {
        //   marker.calculateRoute(AllMarkers[marker.id-1], AllMarkers[marker.id]); 
        //   marker.calculateRoute(AllMarkers[marker.id], AllMarkers[marker.id+1]);
        // }
        // else {
        //   alert("what else can go wrong?");
        // }
      }

      

  

  function Isochrone(){
    //Initialize a global variable that tracks if the Isochrone is active on screen. At the very start of the webpage loading, it is not active (false).
      IsochroneActive = false;

    //Methods

      //Isochrone Button Clicked
        this.IsochroneButtonClicked = function() {
          // alert("THIS keyword is coming next");
          // alert(this);
          this.ToggleIsochrone();
          if (IsochroneActive == true){
            this.generateIsochroneMarker();
            this.generateIsochronePolygon();
          }
          else if (IsochroneActive == false){
            this.removeIsochroneMarker();
            this.removeIsochronePolygon();
          }
        }

      //Generate a Isochrone Marker
        this.generateIsochroneMarker = function() {
          isoMarker = new mapboxgl.Marker({
            draggable: true,
            color: '#CF9A46',
            // scale: 0.75, - This doesn't work and I don't understand why - https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker
          });
          isoMarker.setLngLat(map.getCenter());
          isoMarker.addTo(map);
          isoMarker.on('dragend', myIsochrone.regenerate.bind(myIsochrone));
        }

      this.regenerate = function() {
        this.removeIsochronePolygon();
        this.generateIsochronePolygon();
      }

      this.generateIsochronePolygon = function() {
        if (IsochroneActive == true) {      
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
                      })
                    .catch(function (err) {
                        $('#isochrone-response').text("An error occured: " + err.message);
                    });
                  }
        else if (IsochroneActive == false) {
          alert("i think i should delete this, this will only pop up if an error occurs.");
        }
      }

      this.removeIsochroneMarker = function() {
        isoMarker.remove();
      }

      this.ToggleIsochrone = function() {
        IsochroneActive = !IsochroneActive;
        // This is an alternative longer form version of my code above
        // if (IsochroneActive == false){
        //   IsochroneActive = true;
        // }
        // else {
        //   IsochroneActive = false;
        // }
      }

      this.removeIsochronePolygon = function () {
        map.removeLayer('maine0');
        map.removeSource('maine0');
        map.removeLayer('maine1');
        map.removeSource('maine1');
        map.removeLayer('maine2');
        map.removeSource('maine2');
      }
  }

  //Should this be inside the isochrone function? I think it might need to be... or maybe not, idk, see if I can find it on google, because i dont think i wrote this code, I think I copied it from example code online. 
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

  //When the geocoder (i.e. the search bar) is engaged/triggered/used/etc... dropdown the Button for Generating Directions
    geocoder.on('result', function(e) {
      //geocoder.mapMarker.setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>")); // add popup
      document.getElementById("directionshere").classList.add("directionsbuttonvisible");
      document.getElementById("directionshere").innerHTML = "Get Route to " + geocoder._typeahead.selected.text;
    });

  //Specific Map Behavior
    map.on('click', function(e) {
      if (mode == "drawing" && cursor !== "insideWarningBubble") {
        AddMarker(e);
      }
    });

  function openCO2Box(){
    if (AllMarkers.length==2 && document.getElementById("CO2Box").classList.contains('displayCO2Box') == false) {
     $('#CO2Box').toggleClass('displayCO2Box');
    }
  }

  //Button Behavior
    document.getElementById("drawRoute").addEventListener("click", addCrosshair);
    document.getElementById("swapButton").addEventListener("click", function(){toggleDrawMode()});
    document.getElementById("dropCrosshairMarker").addEventListener("click", AddMarker);
    document.getElementById("undoCrosshairMarker").addEventListener("click", undoLastMarker);
    document.getElementById("directionshere").addEventListener("click", function(){Search.generateRoute()});
    document.getElementById("toggleSwitch").addEventListener("click", ToggleSafeRouting);
    // document.getElementById("cancelCrosshairMarker").addEventListener("click", function() { alert("IOU one function about canceling all routes")});
    // document.getElementById("isochroneButton").addEventListener("click", myIsochrone.IsochroneButtonClicked.bind(myIsochrone));
