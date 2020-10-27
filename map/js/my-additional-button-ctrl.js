/* --------------------------------------------------------------------------------------
This code probably poorly written and can be eventually consolidated into my-map.js (the 
main js file for the web-app), but if I copy-paste this to the bottom of the my-map.js 
file, the User-Interface behavior doesn't work. My guess is this is likely due to the 
copy-pasting this massive $(docuemnt).ready function to the bottom of my-map.js, and this 
thing needs to load before my-map.js to work properly. 
-------------------------------------------------------------------------------------- */

//---------------------------------------------------------------------------------------
// ------------- Step 1: Additional Button Controls (StreetLight Mode) ------------------
//---------------------------------------------------------------------------------------
$(document).ready(function () {
  $("#sidebarCollapse").on("click", function () {
    $("#presentation").toggleClass("hideleft");
    $("#mapViewControls").toggleClass("hideright");
    $("#tutorialButton").toggleClass("tutorialSlideUp");
    // $('#astronauticon').toggleClass('fa-user-astronaut');
    // $('#astronauticon').toggleClass('fa-user');
    $("#sidebarCollapse").toggleClass("slideup420px");
    $("#bottomRightControls").toggleClass("shrink7left");
    $("#bottomLeftControls").toggleClass("shrink7right");
    $("#map").toggleClass("shrink8");
    $("#sheet").toggleClass("sheetZindex1");
    // $('#geocoder').toggleClass('hidetop');
    // $('#directionshere').toggleClass('directionsbuttonvisible');
    $("#bottomControl").toggleClass("hidebottom");
    // $('#isochroneButton').toggleClass('isochroneSlideUp');
    // $('#toolbar').toggleClass('hidebottom');
  });

  $(function () {
    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
  });
  //On Mobile - When tapping a button, the tooltip (ie "Draw", "Undo", "Drop Marker")
  //stays open because it holds the focus for touchscreen interaction, and there is no
  //simple workaround, so simplest hack is wrap all tooltips in a setTimeout function!
  $(function () {
    $(document).on("shown.bs.tooltip", function (e) {
      setTimeout(function () {
        $(e.target).tooltip("hide");
      }, 850); //0.85 seconds
    });
  });

  //Draw Tool Toggle
  $("#drawRoute").on("click", function () {
    $("#drawRoute").toggleClass("hideDrawRoute");
    $("#dropCrosshairMarker").toggleClass("drawSlideRight");
    $("#undoCrosshairMarker").toggleClass("undoSlideUp");
    $("#routeInfo").toggleClass("RouteInfoSlideRight");
    $("#freeDraw").toggleClass("secondaryPositionZ0");
    $("#swapButton").toggleClass("secondaryPositionZ1");
  });
  $("#cancelCrosshairMarker").on("click", function () {
    $("#drawRoute").toggleClass("hideDrawRoute");
    $("#dropCrosshairMarker").toggleClass("drawSlideRight");
    $("#undoCrosshairMarker").toggleClass("undoSlideUp");
    // $('#routeInfo').toggleClass('RouteInfoSlideRight');
    $("#freeDraw").toggleClass("secondaryPositionZ0");
    $("#swapButton").toggleClass("secondaryPositionZ1");
  });
  $("#swapButton").on("click", function () {
    //$('#freeDraw').toggleClass('secondaryPositionZ0');
    $("canvas").toggleClass("mousecrosshair");
    $("#cancelCrosshairMarker").toggleClass("secondaryPositionZ0");
    $("#dropCrosshairMarker").toggleClass("undoSlideUp");
    $("#dropCrosshairMarker").toggleClass("drawSlideRight");

    // $('dropCrosshairMarker').toggleClass('undoSlideUp');
  });
  $("#CO2Button").on("click", function () {
    // $('#bottomLeftControls').toggleClass('displayCO2Box');
    $("#CO2Box").toggleClass("displayCO2Box");
  });
  $(".mapboxgl-ctrl-geocoder--button").on("click", function () {
    $("#directionshere").toggleClass("directionsbuttonvisible");
  });

  Nightmode = false;
  $("#streetlights").on("click", function () {
    Nightmode = !Nightmode;
    if (Nightmode == true) {
      //In a smarter way to write this code.
      // Preset all the colors as variables,
      //Make an array of all the layers IDs that need to be changed to a given color variable
      //Write a ForEach ID in ID Array, change line-color or change the fill-color to variable

      //Set nighttime colors
      //Default Map Layers
      let nightRoad = "#3d3d3d";
      let nightRoadCase = "#242424";
      let nightTunnelCase = "#454545";
      let nightWater = "#1f1f1f";
      let nightWaterShadow = "#050505";
      let nightAeroway = "#404040";
      let nightLand = "#292929";
      let nightParks = "#252727";
      let nightBuildings = "#2b2b2b";
      let nightLandCover = "#282929";
      //TNR Layers
      let nightTNR = "#737168";
      let nightHawks = "#d7af65"; //'white'//'#d7af65';
      let nightHawksCase = "black"; //'#292929';

      //Set color of default layers
      map.setPaintProperty("road-motorway-trunk", "line-color", nightRoad);
      map.setPaintProperty("road-primary", "line-color", nightRoad);
      map.setPaintProperty("road-secondary-tertiary", "line-color", nightRoad);
      map.setPaintProperty("road-street", "line-color", nightRoad);
      map.setPaintProperty("road-minor", "line-color", nightRoad);
      map.setPaintProperty("road-major-link", "line-color", nightRoad);
      map.setPaintProperty("road-construction", "line-color", nightRoad);
      map.setPaintProperty(
        "road-motorway-trunk-case",
        "line-color",
        nightRoadCase
      );
      map.setPaintProperty("road-major-link-case", "line-color", nightRoadCase);
      map.setPaintProperty("road-primary-case", "line-color", nightRoadCase);
      map.setPaintProperty(
        "road-secondary-tertiary-case",
        "line-color",
        nightRoadCase
      );
      map.setPaintProperty("road-street-case", "line-color", nightRoadCase);
      map.setPaintProperty("road-street-low", "line-color", nightRoad);
      map.setPaintProperty("road-minor-case", "line-color", nightRoadCase);
      map.setPaintProperty("road-minor-low", "line-color", nightRoad);

      map.setPaintProperty("bridge-rail", "line-color", nightRoad);
      map.setPaintProperty("road-rail", "line-color", nightRoad);

      map.setPaintProperty(
        "tunnel-motorway-trunk",
        "line-color",
        nightRoadCase
      );
      map.setPaintProperty(
        "tunnel-primary-secondary-tertiary",
        "line-color",
        nightRoadCase
      );
      map.setPaintProperty("tunnel-street-minor", "line-color", nightRoadCase);
      map.setPaintProperty("tunnel-major-link", "line-color", nightRoadCase);
      map.setPaintProperty("tunnel-consturction", "line-color", nightRoadCase);
      map.setPaintProperty(
        "tunnel-motorway-trunk-case",
        "line-color",
        nightTunnelCase
      );
      map.setPaintProperty(
        "tunnel-major-link-case",
        "line-color",
        nightTunnelCase
      );
      map.setPaintProperty(
        "tunnel-primary-secondary-tertiary-case",
        "line-color",
        nightTunnelCase
      );
      map.setPaintProperty(
        "tunnel-street-minor-case",
        "line-color",
        nightTunnelCase
      );
      map.setPaintProperty(
        "tunnel-street-minor-low",
        "line-color",
        nightRoadCase
      );

      map.setPaintProperty("bridge-motorway-trunk-2", "line-color", nightRoad);
      map.setPaintProperty("bridge-major-link-2", "line-color", nightRoad);
      map.setPaintProperty(
        "bridge-motorway-trunk-2-case",
        "line-color",
        nightRoadCase
      );
      map.setPaintProperty(
        "bridge-major-link-2-case",
        "line-color",
        nightRoadCase
      );
      map.setPaintProperty("bridge-motorway-trunk", "line-color", nightRoad);
      map.setPaintProperty(
        "bridge-primary-secondary-tertiary",
        "line-color",
        nightRoad
      );
      map.setPaintProperty("bridge-street-minor", "line-color", nightRoad);
      map.setPaintProperty("bridge-major-link", "line-color", nightRoad);
      map.setPaintProperty("bridge-construction", "line-color", nightRoad);
      map.setPaintProperty(
        "bridge-motorway-trunk-case",
        "line-color",
        nightRoadCase
      );
      map.setPaintProperty(
        "bridge-major-link-case",
        "line-color",
        nightRoadCase
      );
      map.setPaintProperty(
        "bridge-primary-secondary-tertiary-case",
        "line-color",
        nightRoadCase
      );
      map.setPaintProperty(
        "bridge-street-minor-case",
        "line-color",
        nightRoadCase
      );
      map.setPaintProperty("bridge-street-minor-low", "line-color", nightRoad);

      map.setPaintProperty("building", "fill-color", nightBuildings);
      map.setPaintProperty("building-outline", "line-color", nightWater);
      map.setPaintProperty("aeroway-line", "line-color", nightAeroway);
      map.setPaintProperty("aeroway-polygon", "fill-color", nightAeroway);
      map.setPaintProperty("land-structure-line", "line-color", nightLand);
      map.setPaintProperty("land-structure-polygon", "fill-color", nightLand);

      map.setPaintProperty("water", "fill-color", nightWater);
      map.setPaintProperty("waterway", "line-color", nightWater);
      map.setPaintProperty("water-shadow", "fill-color", nightWaterShadow);
      map.setPaintProperty("waterway-shadow", "line-color", nightWaterShadow);

      map.setPaintProperty("landuse", "fill-color", nightParks);
      map.setPaintProperty("national-park", "fill-color", nightParks);
      map.setPaintProperty("landcover", "fill-color", nightLandCover);
      map.setPaintProperty("land", "background-color", nightLand);

      //Sec color of TNR layers
      map.setPaintProperty("tnr-v9-7p9y6s copy", "line-color", nightTNR);
      map.setPaintProperty("tnr-v9-7p9y6s", "line-color", nightRoadCase);
      map.setPaintProperty("hawks-v2-bb9wvv", "circle-color", nightHawks);
      map.setPaintProperty(
        "hawks-v2-bb9wvv",
        "circle-stroke-color",
        nightHawksCase
      );
      map.setPaintProperty(
        "lshs-hawkroads-v2-ddpdin copy 1",
        "line-color",
        nightTNR
      );
      map.setPaintProperty("lshs-hawkroads-v2-ddpdin", "line-color", nightTNR);
      map.setPaintProperty("hs-v2-7bxiun copy", "line-color", nightTNR);
      map.setPaintProperty("ls-v3-cj14ge copy 1", "line-color", nightTNR);

      //Add Streetlights
      map.setLayoutProperty("ls-streetlights-4od5h2", "visibility", "visible");
      map.setLayoutProperty(
        "ls-streetlights-4od5h2 copy",
        "visibility",
        "visible"
      );
      map.setLayoutProperty("hs-streetlights-4qsd4j", "visibility", "visible");
      map.setLayoutProperty(
        "hs-streetlights-4qsd4j copy",
        "visibility",
        "visible"
      );
      map.setLayoutProperty(
        "hs-streetlights-4qsd4j copy 1",
        "visibility",
        "visible"
      );
      map.setLayoutProperty(
        "hs-streetlights-4qsd4j copy 2",
        "visibility",
        "visible"
      );

      //Hide TP Roads, but Keep Hawks on
      // map.setLayoutProperty("tnr-v9-7p9y6s copy", "visibility", "none");
      // map.setLayoutProperty("tnr-v9-7p9y6s", "visibility", "none");
      // map.setLayoutProperty(
      //   "lshs-hawkroads-v2-ddpdin copy 1",
      //   "visibility",
      //   "none"
      // );
      // map.setLayoutProperty("lshs-hawkroads-v2-ddpdin", "visibility", "none");
      // map.setLayoutProperty('hawks-v2-bb9wvv', 'visibility', 'none');

      //Remove all Cul-de-sacs because of that bug where for some reason I cannot change their color (not even in mapbox studio)
      map.setLayoutProperty("turning-feature", "visibility", "none");
      map.setLayoutProperty("turning-feature-outline", "visibility", "none");
    } else if (Nightmode == false) {
      //Set daytime colors
      //Default Map Layers
      let lightRoad = "#ffffff";
      let lightRoadCase = "#d9d9d9";
      let lightTunnelCase = "#e0e6e6";
      let lightWater = "#cad2d3";
      let lightWaterShadow = "#b5bebf";
      let lightAeroway = "#f7f7f7";
      let lightLand = "#f9f9f6"; //F1F3F3
      let lightParks = "#eceeed";
      let lightBuildings = "#47484d";
      let lightLandCover = "#e3e3e3";
      //TNR Layers
      let lightTNR = "#e6e6e6";
      let lightTNRCase = "#828283";
      let lightHawks = "#e4c790";
      let lightHawksStroke = "#b3b3b3";

      //Set color of default layers
      map.setPaintProperty("road-motorway-trunk", "line-color", lightRoad);
      map.setPaintProperty("road-primary", "line-color", lightRoad);
      map.setPaintProperty("road-secondary-tertiary", "line-color", lightRoad);
      map.setPaintProperty("road-street", "line-color", lightRoad);
      map.setPaintProperty("road-minor", "line-color", lightRoad);
      map.setPaintProperty("road-major-link", "line-color", lightRoad);
      map.setPaintProperty("road-construction", "line-color", lightRoad);
      map.setPaintProperty(
        "road-motorway-trunk-case",
        "line-color",
        lightRoadCase
      );
      map.setPaintProperty("road-major-link-case", "line-color", lightRoadCase);
      map.setPaintProperty("road-primary-case", "line-color", lightRoadCase);
      map.setPaintProperty(
        "road-secondary-tertiary-case",
        "line-color",
        lightRoadCase
      );
      map.setPaintProperty("road-street-case", "line-color", lightRoadCase);
      map.setPaintProperty("road-street-low", "line-color", lightRoad);
      map.setPaintProperty("road-minor-case", "line-color", lightRoadCase);
      map.setPaintProperty("road-minor-low", "line-color", lightRoad);

      map.setPaintProperty("bridge-rail", "line-color", lightRoad);
      map.setPaintProperty("road-rail", "line-color", lightRoad);

      map.setPaintProperty(
        "tunnel-motorway-trunk",
        "line-color",
        lightRoadCase
      );
      map.setPaintProperty(
        "tunnel-primary-secondary-tertiary",
        "line-color",
        lightRoadCase
      );
      map.setPaintProperty("tunnel-street-minor", "line-color", lightRoadCase);
      map.setPaintProperty("tunnel-major-link", "line-color", lightRoadCase);
      map.setPaintProperty("tunnel-consturction", "line-color", lightRoadCase);
      map.setPaintProperty(
        "tunnel-motorway-trunk-case",
        "line-color",
        lightTunnelCase
      );
      map.setPaintProperty(
        "tunnel-major-link-case",
        "line-color",
        lightTunnelCase
      );
      map.setPaintProperty(
        "tunnel-primary-secondary-tertiary-case",
        "line-color",
        lightTunnelCase
      );
      map.setPaintProperty(
        "tunnel-street-minor-case",
        "line-color",
        lightTunnelCase
      );
      map.setPaintProperty(
        "tunnel-street-minor-low",
        "line-color",
        lightRoadCase
      );

      map.setPaintProperty("bridge-motorway-trunk-2", "line-color", lightRoad);
      map.setPaintProperty("bridge-major-link-2", "line-color", lightRoad);
      map.setPaintProperty(
        "bridge-motorway-trunk-2-case",
        "line-color",
        lightRoadCase
      );
      map.setPaintProperty(
        "bridge-major-link-2-case",
        "line-color",
        lightRoadCase
      );
      map.setPaintProperty("bridge-motorway-trunk", "line-color", lightRoad);
      map.setPaintProperty(
        "bridge-primary-secondary-tertiary",
        "line-color",
        lightRoad
      );
      map.setPaintProperty("bridge-street-minor", "line-color", lightRoad);
      map.setPaintProperty("bridge-major-link", "line-color", lightRoad);
      map.setPaintProperty("bridge-construction", "line-color", lightRoad);
      map.setPaintProperty(
        "bridge-motorway-trunk-case",
        "line-color",
        lightRoadCase
      );
      map.setPaintProperty(
        "bridge-major-link-case",
        "line-color",
        lightRoadCase
      );
      map.setPaintProperty(
        "bridge-primary-secondary-tertiary-case",
        "line-color",
        lightRoadCase
      );
      map.setPaintProperty(
        "bridge-street-minor-case",
        "line-color",
        lightRoadCase
      );
      map.setPaintProperty("bridge-street-minor-low", "line-color", lightRoad);

      map.setPaintProperty("building", "fill-color", lightBuildings);
      map.setPaintProperty("building-outline", "line-color", lightWater);
      map.setPaintProperty("aeroway-line", "line-color", lightAeroway);
      map.setPaintProperty("aeroway-polygon", "fill-color", lightAeroway);
      map.setPaintProperty("land-structure-line", "line-color", lightLand);
      map.setPaintProperty("land-structure-polygon", "fill-color", lightLand);

      map.setPaintProperty("water", "fill-color", lightWater);
      map.setPaintProperty("waterway", "line-color", lightWater);
      map.setPaintProperty("water-shadow", "fill-color", lightWaterShadow);
      map.setPaintProperty("waterway-shadow", "line-color", lightWaterShadow);

      map.setPaintProperty("landuse", "fill-color", lightParks);
      map.setPaintProperty("national-park", "fill-color", lightParks);
      map.setPaintProperty("landcover", "fill-color", lightLandCover);
      map.setPaintProperty("land", "background-color", lightLand);

      //Sec color of TNR layers
      map.setPaintProperty("tnr-v9-7p9y6s", "line-color", lightTNRCase);
      map.setPaintProperty("tnr-v9-7p9y6s copy", "line-color", lightTNR);
      map.setPaintProperty(
        "lshs-hawkroads-v2-ddpdin copy 1",
        "line-color",
        lightTNR
      );
      map.setPaintProperty(
        "lshs-hawkroads-v2-ddpdin",
        "line-color",
        lightTNRCase
      );
      map.setPaintProperty(
        "hawks-v2-bb9wvv",
        "circle-stroke-color",
        lightHawksStroke
      );
      map.setPaintProperty("hs-v2-7bxiun copy", "line-color", lightTNR);
      map.setPaintProperty("ls-v3-cj14ge copy 1", "line-color", lightTNR);
      map.setPaintProperty("hawks-v2-bb9wvv", "circle-color", lightHawks);

      //Remove Streetlights
      map.setLayoutProperty("ls-streetlights-4od5h2", "visibility", "none");
      map.setLayoutProperty(
        "ls-streetlights-4od5h2 copy",
        "visibility",
        "none"
      );
      map.setLayoutProperty("hs-streetlights-4qsd4j", "visibility", "none");
      map.setLayoutProperty(
        "hs-streetlights-4qsd4j copy",
        "visibility",
        "none"
      );
      map.setLayoutProperty(
        "hs-streetlights-4qsd4j copy 1",
        "visibility",
        "none"
      );
      map.setLayoutProperty(
        "hs-streetlights-4qsd4j copy 2",
        "visibility",
        "none"
      );

      //Show TP Road Layers
      // map.setLayoutProperty("tnr-v9-7p9y6s copy", "visibility", "visible");
      // map.setLayoutProperty("tnr-v9-7p9y6s", "visibility", "visible");
      // map.setLayoutProperty(
      //   "lshs-hawkroads-v2-ddpdin copy 1",
      //   "visibility",
      //   "visible"
      // );
      // map.setLayoutProperty(
      //   "lshs-hawkroads-v2-ddpdin",
      //   "visibility",
      //   "visible"
      // );
      // map.setLayoutProperty('hawks-v2-bb9wvv', 'visibility', 'visible');

      //Add all Cul-de-sacs because of that bug where for some reason I cannot change their color (not even in mapbox studio)
      map.setLayoutProperty("turning-feature", "visibility", "visible");
      map.setLayoutProperty("turning-feature-outline", "visibility", "visible");
    }
  });
});
