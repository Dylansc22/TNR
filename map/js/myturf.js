//This is loading of 500kb a Turf build directly into the browers - that's not very lightweight...
//I may want load just the bits I need, see instructions to do so
//http://turfjs.org/getting-started
var bbox = turf.bbox(features);

getParks()
  .then(function(json) {
    // Add your own result handling here
    console.log("mission mother fucking accomplished");
    console.log(json);
  })
  .catch(function(err) {
    console.log("oh shit error occured here it comes!");
    console.error(err.message);
  });

//So this is an asyncronus function, meaning idfk at all when it will be done, but when it does finish successfully (ie response)
//continue onward. If it fails, then 
async function getParks() {
  //https://developer.mozilla.org/en-US/docs/Web/API/Response
  const response = await fetch ('js/Mapbodfx_Parks_minify.geojson');
  const data = await response.json();
  console.log(data);
}