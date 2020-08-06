//This is loading of 500kb a Turf build directly into the browers - that's not very lightweight...
//I may want load just the bits I need, see instructions to do so
//http://turfjs.org/getting-started
console.log("turf has loaded");
// getParks()
//   .then(function(json) {
//     // Add your own result handling here
//     console.log("mission mother fucking accomplished");
//     console.log(json);
//   })
//   .catch(function(err) {
//     console.log("oh shit error occured here it comes!");
//     console.error(err.message);
//   });

//So this is an asyncronus function, meaning idfk at all when it will be done, but when it does finish successfully (ie response)
//continue onward. If it fails, then 
let getParks = async function() {
  //https://developer.mozilla.org/en-US/docs/Web/API/Response
  const response = await fetch ('js/Mapbodfx_Parks_minify.geojson');
  const data = await response.json();
  console.log(data);
}

safeturfValues = async () => {
  //Pull Parks into work environment
    const response = await fetch ('js/Mapbox_Parks_minify.geojson');
    const polygonParks = await response.json();
    const response2 = await fetch ('js/GH_AvoidArea_minify.geojson');
    const polygonHSRoads = await response2.json();
      //Do the Turf work
      for (i = AllMarkers.length-1; i < AllMarkers.length; i++) {
        let AtoBLineSegment = AllMarkers[i].safeRoute.paths[0].points;
        let WarningMarkers = turf.lineIntersect(AtoBLineSegment, polygonHSRoads).features;
        //If warning markers is not [], ie if there *are* intersect point(s)... do the following for loops:
        if (WarningMarkers.length !== 0){
          for (j=0;j<WarningMarkers.length;j++){
            let from = WarningMarkers[j].geometry.coordinates;
            let options = {units: 'kilometers'}; //can be degrees, radians, miles, or kilometers
            for (k=WarningMarkers.length-1;k>0;k--) {
              let to = WarningMarkers[k].geometry.coordinates;
              let distance = turf.distance(from, to, options);
              if (distance !== 0 && distance < 0.05){
                WarningMarkers.splice(k,1);
              }
            }
          }
          let temp = [];
          WarningMarkers.forEach(item => {
            temp.push(item.geometry.coordinates);
          });
          AllMarkers[i].warning = temp;
        }
      }
}

dangerturfValues = async () => {
  //Pull Parks into work environment
    const response = await fetch ('js/Mapbox_Parks_minify.geojson');
    const polygonParks = await response.json();
    const response2 = await fetch ('js/GH_AvoidArea_minify.geojson');
    const polygonHSRoads = await response2.json();
      //Do the Turf work
      for (i = AllMarkers.length-1; i < AllMarkers.length; i++) {
        let AtoBLineSegment = AllMarkers[i].dangerousRoute.paths[0].points;
        let WarningMarkers = turf.lineIntersect(AtoBLineSegment, polygonHSRoads).features;
        //If warning markers is not [], ie if there *are* intersect point(s)... do the following for loops:
        if (WarningMarkers.length !== 0){
          for (j=0;j<WarningMarkers.length;j++){
            let from = WarningMarkers[j].geometry.coordinates;
            let options = {units: 'kilometers'}; //can be degrees, radians, miles, or kilometers
            for (k=WarningMarkers.length-1;k>0;k--) {
              let to = WarningMarkers[k].geometry.coordinates;
              let distance = turf.distance(from, to, options);
              if (distance !== 0 && distance < 0.05){
                WarningMarkers.splice(k,1);
              }
            }
          }
          let temp = [];
          WarningMarkers.forEach(item => {
            temp.push(item.geometry.coordinates);
          });
          AllMarkers[i].warning = temp;
        }
      }
}


  turfCircles = () => {
    if (typeof(AllMarkers[AllMarkers.length-1].warning) !== 'undefined') {
      for (i=AllMarkers.length-1;i<AllMarkers.length;i++){
        map.addSource('dangerzonesource' + AllMarkers[i].id, { 
          'type': 'geojson', 
          'data': {
            'type':'Feature',
            'geometry': {
              'type':'MultiPoint',
              'coordinates': AllMarkers[i].warning,
            }
          }
        });
        map.addLayer({
          'id': 'dangerzoneID' + AllMarkers[i].id,
          'type': 'circle',
          'source': 'dangerzonesource' + AllMarkers[i].id,
          'layout': {},
          'paint': {
            'circle-color': 'brown',
            'circle-opacity': 0.2,
            'circle-radius': {
              "type": "exponential",
              "base": 1.5,
              "stops": [
                //I actually have no idea how this actually works, but the sizing seems decent, haha. 
                [0, 1 * Math.pow(2, (9 - 13))], //[0, baseWidth * Math.pow(2, (0 - baseZoom))],
                [24, 25 * Math.pow(2, (24 - 18))] //[0, baseWidth * Math.pow(2, (0 - baseZoom))],
              ]
            },
            'circle-stroke-color':'brown',
            'circle-stroke-opacity':1,
            'circle-stroke-width':2,
            'circle-pitch-alignment':'map',
          }
        });  

      map.on('click', 'dangerzoneID' + AllMarkers[i].id, function(e) {
        if (zoomed === false) {
          zoomed = true;
          map.flyTo({
            center: e.lngLat,
            bearing: 30,
            pitch:45,
            zoom: 18,
            speed: 1.7, // make the flying slow
            // curve: 1, // change the speed at which it zooms out
          });
        //Turn on satallite layer if it is off
        if (satallitemode === false) {
          document.getElementById("satellite").click();
        } 
        //turn on annotations if they are off
        if (map.getLayoutProperty('road-label', 'visibility') === 'none') {
          document.getElementById("annotation").click();
        } 
        for (i=1;i<=AllMarkers.length-1;i++) {
          map.setPaintProperty(AllMarkers[i].layer,'line-opacity', 0.4);
        }
        }//If I'm already zoomed in, on click will cause a zoom out.
        else if (zoomed === true) {
          zoomed = false;
          zoomToFullRoute();
            // map.flyTo({
            //   center: [-110.93182, 32.23156], 
            //   zoom: 12.826,
            //   pitch: 0,
            //   bearing: 0,
            //   speed: 1.7, // make the flying slow
            //   curve: 1, // change the speed at which it zooms out
            // });
            //Shut off the Satallite layer if it is on.
            if (satallitemode === true) {
              document.getElementById("satellite").click();
            } 
            //Shut off Annotations if they are on
            if (map.getLayoutProperty('road-label', 'visibility') === 'visible') {
              document.getElementById("annotation").click();
            }
        }
      });
      // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
      map.on('mouseenter', 'dangerzoneID'+ AllMarkers[i].id, function() {
        console.log("mouse went in");
        cursor = "insideWarningBubble";
        map.getCanvas().style.cursor = 'pointer';
      });
       
      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'dangerzoneID'+ AllMarkers[i].id, function() {
        cursor = "outsideWarningBubble";
        map.getCanvas().style.cursor = '';
      });
      }
     }               
  } //end turfCircles



  turfDot = () => {
    if (typeof(AllMarkers[AllMarkers.length-1].warning) !== 'undefined'){
      for (i=AllMarkers.length-1;i<AllMarkers.length;i++){
        map.addLayer({
          'id': 'dangerzonedotID' + AllMarkers[i].id,
          'type': 'circle',
          'source': 'dangerzonesource' + AllMarkers[i].id,
          'layout': {},
          'paint': {
            'circle-color': 'brown',
            'circle-opacity': 1,
            'circle-radius': {
              'stops': [[12,3], [14, 4],[20, 8] ]
            },
            'circle-stroke-color':'black',
            'circle-stroke-opacity':1,
            'circle-stroke-width':1,
            'circle-pitch-alignment':'map',
          }
        });  
      }
    }
  }


turfDanger = async () => {
  if (safe == true) {
    await safeturfValues();
  } else {
    await dangerturfValues();
  }
    await turfCircles();
    await turfDot();
}

danger = function(){
  turfValues();
  turfCircles();
  
}