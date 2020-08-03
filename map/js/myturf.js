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

AllturfCrossings = [];
turfTest = async function() {
  //Pull Parks into work environment
    const response = await fetch ('js/Mapbox_Parks_minify.geojson');
    const polygonParks = await response.json();
    const response2 = await fetch ('js/GH_AvoidArea_minify.geojson');
    const polygonHSRoads = await response2.json();
      //Do the Turf work
      for (i = 1; i <= AllMarkers.length-1; i++) {
        let AtoBLineSegment = AllMarkers[i].geojson.paths[0].points;
        AllMarkers[i].warning = turf.lineIntersect(AtoBLineSegment, polygonHSRoads).features;
        // for (j=1;j<AllMarkers.length;j++) {
        //   let from = AllMarkers[j].warning.geometry.coordinates;
        //   let to = AllMarkers[j+1].warning.geometry.coordinates;
        //   let options = {units: 'kilometers'}; //can be degrees, radians, miles, or kilometers
        //   let distance = turf.distance(from, to, options); 
        //   if (distance < 0.05) {
        //     //delete j+1 marker or maybe splice HSintersects[j+1]???
        //   }
        // }
        // map.addSource('warningBubbles' + i.toString(), {
        //       'type': 'geojson',
        //       'data': HSintersects
        //     });
        // map.addLayer({
        //   'id': 'warningBubblesname',
        //   'type': 'circle',
        //   'source': 'warningBubbles' + i.toString(),
        //   'layout': {},
        //   'paint': {
        //     'circle-color': 'brown',
        //     'circle-opacity': 0.2,
        //     'circle-radius': 25,
        //     'circle-stroke-color':'red',
        //     'circle-stroke-opacity':1,
        //     'circle-stroke-width':1,
        //     'circle-translate-anchor':'viewport',

        //   }
        // });
        AllMarkers[i].warning.forEach(item => {
          let warningMarker = new mapboxgl.Marker({
            //element: el, if I want a crosshair instead of the marker
            draggable: false,
            color: 'brown', //'#363636',
            scale: 1,
          });
          warningMarker.setLngLat(item.geometry.coordinates); //item === HSintersects.feature[i] of array
          warningMarker.addTo(map);
        });
      }
}