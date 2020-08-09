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
  // console.log(data);
}



calculateMarkerDangerZone = async (_marker) => {
  let marker = _marker;
  const response = await fetch ('js/GH_AvoidArea_minify.geojson');
  const HSRoads = await response.json();
  
  if (safe === true) { 
    var currentRoute = marker.safeRoute.paths[0].points; 
  } 
  else if (safe === false) { 
    var currentRoute = marker.dangerousRoute.paths[0].points;
  }

  //Calculate All Intersects beteween High Stress Road and individual marker's geojson-route 
  let intersects = turf.lineIntersect(currentRoute, HSRoads).features;

  //Route can cross High Stress road multiple times in a small clustered space
  //(i.e. a route cross 4 times: in-out in-out on a two lane road)
  //I need to delete that excess of four crossings down to 1 (the first crossing)
  //Remove excess clusters of intersect-points when the geojson pathway
  // has multiple crossings with high-stress road in a tight space.
  if (intersects.length > 1) {
    intersects = trimIntersects(intersects);
  }
  //Finally, if intersects exist save them to the marker.
  if (intersects !== 'undefined') {
      let multipointgeojson = { 
          'type': 'geojson', 
          'data': {
            'type':'Feature',
            'geometry': {
              'type':'MultiPoint',
              'coordinates':[],
            }
          }
      }
    intersects.forEach(geojson => {
      multipointgeojson.data.geometry.coordinates.push(geojson.geometry.coordinates);
    });
    marker.warning = multipointgeojson;
  }
}

trimIntersects = (_intersects) => {
  let trimmed = _intersects;
  let options = {units: 'kilometers'}; //can be degrees, radians, miles, or kilometers
  
  //Example below to explain the nested for loops:
  //the 1st for loop moves up the * up through the array
  //the 2nd for loop moves down the array checking each turf-distance against *
  // * 0 0 0 ------- 0 ----- 0 0 ---   start at * and iterate through 0's starting at the end.
  // X ------------- * ----- 0 0 ---   3 deleted (via splice). now at *. ignore X (behind you and technically already checked in prior step), and iterate through o
  // X ------------- X ----- * 0 ---   none deleted. now at *. ignore X's. 
  // X ------------- X ----- X -----   1 deleted. Now complete
  trimmed.forEach(point => {
    for (k = trimmed.length -1; k > trimmed.indexOf(point); k--) {
      let comparePoint = trimmed[k];
      let distance = turf.distance(point, comparePoint, options);
      if (distance < 0.05) {
        trimmed.splice(k,1);
        }
      }
    });
  return trimmed;
} //trimIntersects

displayMarkerDangerZone = (_marker) => {
  let marker = _marker;
  if (typeof(marker.warning) !== 'undefined') {
    //Add center dot
    map.addSource('dangersource' + marker.id, marker.warning);
    map.addLayer({
      'id': 'dangerdot' + marker.id,
      'type': 'circle',
      'source': 'dangersource' + marker.id,
      'layout': {},
      'paint': {
        'circle-color': 'brown',
        'circle-opacity': 1,
        'circle-radius': {
          'stops': [
            [0, 5 * Math.pow(2, (0 - 23.5))],
            [24, 5 * Math.pow(2, (24 - 23.5))] 
            //[0, baseWidth * Math.pow(2, (0 - baseZoom))],
            //set the line-width at different zooms, 
            //specifically the minzoom and maxzoom. By using the exponential 
            //type with base set to 2 the line width function should 
            //interpolate between these zooms in a way that the line covers 
            //the same geographic area as you zoom in and out.
          ]
        },
        'circle-stroke-color':'black',
        'circle-stroke-opacity':1,
        'circle-stroke-width':1,
        'circle-pitch-alignment':'map',
      }
    }); 
    //Add radial circle
    map.addLayer({
      'id': 'dangercircle' + marker.id,
      'type': 'circle',
      'source': 'dangersource' + marker.id,
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

      map.on('click', 'dangercircle' + marker.id, (e) => {
        if (zoomed == false) {
          zoomed = true;
          map.flyTo({
            center: e.lngLat,
            bearing: 30,
            pitch:45,
            zoom: 18,
            speed: 1.7, // make the flying slow
            // curve: 1, // change the speed at which it zooms out
          });
          //Turn on Satallite and Annotations Layers, if they are off
            if (satallitemode === false) { document.getElementById("satellite").click(); } 
            if (map.getLayoutProperty('road-label', 'visibility') === 'none') {  document.getElementById("annotation").click(); } 
          //Geojson pathway route always appears as a layer *on top of* the map layers
          //so I need to turn the line-opacity down to 0.4, so you can read the street names
          //that appear undernearthe the bike  
          for (j=1;j<=AllMarkers.length-1;j++) {
            map.setPaintProperty(AllMarkers[j].layer,'line-opacity', 0.4);
          }
          e.stopPropagation();
        } else if (zoomed == true) {
          zoomed = false;
          zoomToFullRoute();
            if (satallitemode === true) { document.getElementById("satellite").click();} 
            //Shut off Annotations if they are on
            if (map.getLayoutProperty('road-label', 'visibility') === 'visible') { document.getElementById("annotation").click(); }
          e.stopPropagation();
        }
      });
      // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
      map.on('mouseenter', 'dangercircle'+ marker.id, function() {
        cursor = "insideWarningBubble";
        map.getCanvas().style.cursor = 'pointer';
      });
       
      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'dangercircle'+ marker.id, function() {
        cursor = "outsideWarningBubble";
        map.getCanvas().style.cursor = '';
      });
    } 
} //end displayMarkerDangerZone

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