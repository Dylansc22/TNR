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

turfValues = async function() {
  //Pull Parks into work environment
    const response = await fetch ('js/Mapbox_Parks_minify.geojson');
    const polygonParks = await response.json();
    const response2 = await fetch ('js/GH_AvoidArea_minify.geojson');
    const polygonHSRoads = await response2.json();
      //Do the Turf work
      for (i = 1; i < AllMarkers.length; i++) {
        let AtoBLineSegment = AllMarkers[i].geojson.paths[0].points;
        let WarningMarkers = turf.lineIntersect(AtoBLineSegment, polygonHSRoads).features;
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
        let temp = []
        WarningMarkers.forEach(item => {
          temp.push(item.geometry.coordinates);
        });
        AllMarkers[i].warning = {}
        AllMarkers[i].warning.type = "Feature";
        AllMarkers[i].warning.geometry = {};
        AllMarkers[i].warning.geometry.type = "MultiPoint";
        AllMarkers[i].warning.geometry.coordinates = temp;
      }
}


  turfCircles = function(){
    for (i=1;i<AllMarkers.length;i++){
      map.addSource('dangerzone' + AllMarkers[i].source, { type: 'geojson', data: AllMarkers[i].warning });
      map.addLayer({
        'id': 'dangerzoneID' + AllMarkers[i].id.toString(),
        'type': 'circle',
        'source': 'dangerzone' + AllMarkers[i].source,
        'layout': {},
        'paint': {
          'circle-color': 'brown',
          'circle-opacity': 0.2,
          'circle-radius': 30,
          'circle-stroke-color':'red',
          'circle-stroke-opacity':1,
          'circle-stroke-width':3,
          'circle-pitch-alignment':'map',
        }
      });  
    }
  }


turfDanger = async function() {
  try {
    await turfValues();
    await turfCircles();
  } catch (err) {
    console.error(err);
  }
};

danger = function(){
  turfValues();
  turfCircles();
}