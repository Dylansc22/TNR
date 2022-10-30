mapboxgl.accessToken =
  "pk.eyJ1IjoiZHlsYW5jIiwiYSI6Im53UGgtaVEifQ.RJiPqXwEtCLTLl-Vmd1GWQ";
var start = [-110.9, 32.236];
var end = [-110.8, 32.2];
var otherend = [-110.88, 32.23];

var yourrideMap = new mapboxgl.Map({
  container: "yourride",
  style: "mapbox://styles/dylanc/ck911k4gg0rqu1ilnr0o0dk1m",
  center: start /*[-110.93475, 32.22396],*/,
  zoom: 12,
  pitch: 35,
  bearing: 5,
  minZoom: 12 /*zooming out to 11.99, the TNR_v9 tileset disappears, nature of the beast of how that file size is uploaded, I can fix this but it takes a lot of backend mapbox studio work*/,
  attributionControl: false,
  interactive: false,
});

//Load data layers on the "make your own route" map that on the homepage.
yourrideMap.on("load", function () {
  yourrideMap.setLayoutProperty("theloop-b2gq5f", "visibility", "visible");
  yourrideMap.setLayoutProperty("tnr_main_inner", "visibility", "visible");
  yourrideMap.setLayoutProperty("tnr_main_outer", "visibility", "visible");
  yourrideMap.setLayoutProperty("hawkroadscase", "visibility", "visible");
  yourrideMap.setLayoutProperty("hawk_roads", "visibility", "visible");
  yourrideMap.setLayoutProperty("hawkdotsgeojson", "visibility", "visible");
});

var beforeMap = new mapboxgl.Map({
  container: "before",
  style: "mapbox://styles/dylanc/cjudps4181wa71fo221zf5efk",
  center: start /*[-110.93475, 32.22396],*/,
  zoom: 12,
  pitch: 35,
  bearing: 5,
  minZoom: 12,
  attributionControl: false,
  /*interactive: false,*/
});

var afterMap = new mapboxgl.Map({
  container: "after",
  style: "mapbox://styles/dylanc/ck3ndggsc0w3z1cnvziay4jzi",
  center: start /*[-110.93475, 32.22396],*/,
  zoom: 12,
  pitch: 35,
  bearing: 5,
  minZoom: 12 /*zooming out to 11.99, the TNR_v9 tileset disappears, nature of the beast of how that file size is uploaded, I can fix this but it takes a lot of backend mapbox studio work*/,
  attributionControl: false,
  /*interactive: false,*/
});

var map = new mapboxgl.Compare(beforeMap, afterMap, {
  // Set this to enable comparing two maps by mouse movement:
  // mousemove: true
});

mapvar.doubleClickZoom.disable();
mapvar.scrollZoom.disable();
mapvar.dragPan.disable();
mapvar.touchZoomRotate.disable();

var isAtStart = true;

function fly() {
  // depending on whether we're currently at point a or b, aim for
  // point a or b
  var target = isAtStart ? end : start;

  mapvar.flyTo({
    // These options control the ending camera position: centered at
    // the target, at zoom level 9, and north up.
    center: target,
    zoom: 13,
    bearing: -20,

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: 0.03, // make the flying slow
    curve: 0.1, // change the speed at which it zooms out

    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.
    easing: function (t) {
      return t;
    },
  });
  beforeMap.flyTo({
    // These options control the ending camera position: centered at
    // the target, at zoom level 9, and north up.
    center: otherend,
    zoom: 14,

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: 0.06, // make the flying slow
    curve: 0.1, // change the speed at which it zooms out

    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.
    easing: function (t) {
      return t;
    },
  });
  afterMap.flyTo({
    // These options control the ending camera position: centered at
    // the target, at zoom level 9, and north up.
    center: otherend,
    zoom: 14,

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: 0.06, // make the flying slow
    curve: 0.1, // change the speed at which it zooms out

    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.
    easing: function (t) {
      return t;
    },
  });
} //End fly() Program

fly();
mapvar.on("load", function () {
  mapvar.setLayoutProperty("osm-bicycleinfras-5z6khj", "visibility", "visible");
  mapvar.setLayoutProperty("theloop-b2gq5f", "visibility", "visible");
});

mapvar.on("load", function () {
  // We use D3 to fetch the JSON here so that we can parse and use it separately
  // from GL JS's use in the added source. You can use any request method (library
  // or otherwise) that you want.
  d3.json("landing.json", function (err, data) {
    if (err) throw err;

    // save full coordinate list for later
    var coordinates = data.features[0].geometry.coordinates;

    // start by showing just the first coordinate
    data.features[0].geometry.coordinates = [coordinates[0]];

    // add it to the map
    mapvar.addSource("trace", { type: "geojson", data: data });
    mapvar.addLayer({
      id: "trace",
      type: "line",
      source: "trace",
      paint: {
        "line-color": "#3985dd",
        "line-opacity": 0.75,
        "line-width": 5,
      },
    });

    // setup the viewport
    //mapvar.jumpTo({ 'center': coordinates[0], 'zoom': 14 });
    //mapvar.setPitch(30);

    // on a regular basis, add more coordinates from the saved list and update the map
    var i = 0;
    var timer = window.setInterval(function () {
      if (i < coordinates.length) {
        data.features[0].geometry.coordinates.push(coordinates[i]);
        mapvar.getSource("trace").setData(data);
        //mapvar.panTo(coordinates[i]);
        i++;
      } else {
        window.clearInterval(timer);
      }
    }, 100);
  });
});
