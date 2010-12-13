
function prepareSignMarker(marker, item) {

    var c = "<div class=\"infoWindow\"><img src=\"signpost.png\" /><p>" + item.msg.replace(/\n/g,"<br/>") + "</p></div>";
    var infowindow = new google.maps.InfoWindow({content: c
            });
    google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
            });

}


function SurfaceCaveControl(controlDiv, tiledir, type, map) 
{
  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('DIV');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to set to ' + type + ' mode';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('DIV');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = type;
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() 
  {
      var zoom = map.getZoom();
      var center = map.getCenter();
      var signStates = map.signStates;
      config['path'] = tiledir;
      markersInit = false;
      initialize(zoom, center, signStates);
  });
}

function drawMapControls() {

    // compass rose, in the top right corner
    var compassDiv = document.createElement('DIV');

    compassDiv.style.padding = '5px';

    var compassImg = document.createElement('IMG');
    compassImg.src="compass.png";
    compassDiv.appendChild(compassImg);
    
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(compassDiv);
    
    // Cave/Surface/Night controls
    //
    
    if (typeof(tilePathsCount)=="undefined") {
      var tilePathsCount = 0;
      for (k in tilePaths) if (tilePaths.hasOwnProperty(k)) tilePathsCount++;
    }
    
    //only draw controls if there are choices
    if (tilePathsCount > 0) {
      // Create the DIV to hold the cave/surface controls
      var surfaceControlDiv = document.createElement('DIV');
      var surfaceControl = {};
      
      // Create the appropriate controls
      for (label in tilePaths) {
	surfaceControl[label] = new SurfaceCaveControl(surfaceControlDiv, tilePaths[label], label, map);
      }
      
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(surfaceControlDiv);
    }
    
    /*
    //check which paths are defined in config.js (don't draw controls for what we don't have)
    var dayPathValid = (( typeof(config.dayPath)!="undefined" )&&(config.dayPath.length != 0) );
    var nightPathValid = (( typeof(config.nightPath)!="undefined" )&&(config.nightPath.length != 0) )
    var cavePathValid = (( typeof(config.cavePath)!="undefined" )&&(config.cavePath.length != 0) )
    
    //only draw controls if there are at least 2 choices
    if ( (dayPathValid + nightPathValid + cavePathValid) > 1 ) {
      // Create the DIV to hold the cave/surface controls
      var surfaceControlDiv = document.createElement('DIV');
      
      if (dayPathValid) {
	var surfaceControl = new SurfaceCaveControl(surfaceControlDiv, config.dayPath, 'Surface', map);
      }
      
      if (nightPathValid) {
	var nightControl = new SurfaceCaveControl(surfaceControlDiv, config.nightPath, 'Surface (night)', map);
      }
      
      if (cavePathValid) {
	var caveControl = new SurfaceCaveControl(surfaceControlDiv, config.cavePath, 'Cave', map);
      }
 
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(surfaceControlDiv);
    }
    */

    // signpost display control
    //

    var signControl = document.createElement("DIV");
    signControl.id = "signControl"; // let's let a style sheet do most of the styling here

    var controlBorder = document.createElement("DIV");
    controlBorder.id="top";
    signControl.appendChild(controlBorder);

    var controlText = document.createElement("DIV");

    controlBorder.appendChild(controlText);

    controlText.innerHTML = "Signposts";
    
    var dropdownDiv = document.createElement("DIV");


    $(controlText).click(function() {
            $(dropdownDiv).toggle();

            });


    dropdownDiv.id="dropDown";
    signControl.appendChild(dropdownDiv);
    dropdownDiv.innerHTML="";

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(signControl);



    for (label in signGroups) {
        var n = document.createElement("input");
        n.type="checkbox";
        
        n.checked = map.signStates[label];
        if (n.checked) {
	  jQuery.each(markerCollection[label], function(i,elem) {elem.setVisible(n.checked);});
        }

        $(n).data("label",label);
        jQuery(n).click(function(e) {
                var t = $(e.target);
                map.signStates[t.data("label")] = e.target.checked;
                jQuery.each(markerCollection[t.data("label")], function(i,elem) {elem.setVisible(e.target.checked);});
                });

        dropdownDiv.appendChild(n);
        var textNode = document.createElement("text");
        textNode.innerHTML = label + "<br/>";
        dropdownDiv.appendChild(textNode);

    }

    // add "others" 
    var n = document.createElement("input");
    n.type="checkbox";
    
    n.checked = map.signStates["__others__"];
    if (n.checked) {
      jQuery.each(markerCollection["__others__"], function(i,elem) {elem.setVisible(n.checked);});
    }
    
    $(n).data("label","__others__");
    jQuery(n).click(function(e) {
            var t = $(e.target);
            map.signStates[t.data("label")] = e.target.checked;
            jQuery.each(markerCollection[t.data("label")], function(i,elem) {elem.setVisible(e.target.checked);});
            });

    dropdownDiv.appendChild(n);
    var textNode = document.createElement("text");
    textNode.innerHTML = "Others<br/>";
    dropdownDiv.appendChild(textNode);
}

function initRegions() {
    if (regionsInit) { return; }

    regionsInit = true;

    for (i in regionData) {
        var region = regionData[i];
        var converted = new google.maps.MVCArray();
        for (j in region.path) {
            var point = region.path[j];
            converted.push(fromWorldToLatLng(point.x, point.y, point.z));
        }

        if (region.closed) {
            new google.maps.Polygon({clickable: false,
                    geodesic: false,
                    map: map,
                    strokeColor: region.color,
                    strokeOpacity: region.opacity,
                    strokeWeight: 2,
                    fillColor: region.color,
                    fillOpacity: region.opacity * 0.25,
                    zIndex: i,
                    paths: converted
                    });
        } else {
            new google.maps.Polyline({clickable: false,
                    geodesic: false,
                    map: map,
                    strokeColor: region.color,
                    strokeOpacity: region.opacity,
                    strokeWeight: 2,
                    zIndex: i,
                    path: converted
                    });
        }
    }
}



function initMarkers() {
    if (markersInit) { return; }

    markersInit = true;

    for (i in markerData) {
        var item = markerData[i];

        // a default:
        var iconURL = '';
        if (item.type == 'spawn') { 
            // don't filter spawn, always display

            iconURL = 'http://google-maps-icons.googlecode.com/files/home.png';
            var converted = fromWorldToLatLng(item.x, item.y, item.z);
            var marker = new google.maps.Marker({position: converted,
                    map: map,
                    title: item.msg, 
                    icon: iconURL
                    });

            continue;
        }

        var matched = false;
        for (label in signGroups) {
            var pattern = signGroups[label];
	    
	    markerCollection[label] = new Array();

            var r = item.msg.match(pattern);
            if (r) {
                matched = true;

                if (item.type == 'sign') { iconURL = 'signpost_icon.png';}

                var converted = fromWorldToLatLng(item.x, item.y, item.z);
                var marker = new google.maps.Marker({position: converted,
                        map: map,
                        title: item.msg, 
                        icon: iconURL,
                        visible: false
                        });
                markerCollection[label].push(marker);

                if (item.type == 'sign') {
                    prepareSignMarker(marker, item);
                }

            }


        }

        if (!matched) {
            // is this signpost doesn't match any of the groups in config.js, add it automatically to the "__others__" group
            if (item.type == 'sign') { iconURL = 'signpost_icon.png';}

            var converted = fromWorldToLatLng(item.x, item.y, item.z);
            var marker = new google.maps.Marker({position: converted,
                    map: map,
                    title: item.msg, 
                    icon: iconURL,
                    visible: false
                    });
            if (markerCollection["__others__"]) {
                markerCollection["__others__"].push(marker);
            } else {
                markerCollection["__others__"] = [marker];
            }

            if (item.type == 'sign') {
                prepareSignMarker(marker, item);
            }
        }


    }
}



function initialize(zoom, center, signStates) {
    
    if(!zoom) {
      zoom = config.defaultZoom;
    }
    
    if(!center) {
      center = new google.maps.LatLng(0.5, 0.5);
    }
    
    if(typeof(signStates) == "undefined") {
      signStates = {};
      for (label in signGroups) {
        signStates[label] = false;
      }
      signStates["__others__"] = false;
    }
    
    var mapOptions = {
        zoom: zoom,
        center: center,
        navigationControl: true,
        scaleControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeId: 'mcmap'
    };
    map = new google.maps.Map(document.getElementById("mcmap"), mapOptions);
    
    map.signStates = signStates;

    if(config.debug) {
        map.overlayMapTypes.insertAt(0, new CoordMapType(new google.maps.Size(config.tileSize, config.tileSize)));

        google.maps.event.addListener(map, 'click', function(event) {
                console.log("latLng; " + event.latLng.lat() + ", " + event.latLng.lng());

                var pnt = map.getProjection().fromLatLngToPoint(event.latLng);
                console.log("point: " + pnt);

                var pxx = pnt.x * config.tileSize * Math.pow(2, config.maxZoom);
                var pxy = pnt.y * config.tileSize * Math.pow(2, config.maxZoom);
                console.log("pixel: " + pxx + ", " + pxy);
                });
    }

    // Now attach the coordinate map type to the map's registry
    map.mapTypes.set('mcmap', MCMapType);

    // We can now set the map to use the 'coordinate' map type
    map.setMapTypeId('mcmap');


    // initialize the markers and regions
    initMarkers();
    initRegions();
    drawMapControls();



}


  // our custom projection maps Latitude to Y, and Longitude to X as normal,
  // but it maps the range [0.0, 1.0] to [0, tileSize] in both directions
  // so it is easier to position markers, etc. based on their position
  // (find their position in the lowest-zoom image, and divide by tileSize)
  function MCMapProjection() {
    this.inverseTileSize = 1.0 / config.tileSize;
  }
  
  MCMapProjection.prototype.fromLatLngToPoint = function(latLng) {
    var x = latLng.lng() * config.tileSize;
    var y = latLng.lat() * config.tileSize;
    return new google.maps.Point(x, y);
  };

  MCMapProjection.prototype.fromPointToLatLng = function(point) {
    var lng = point.x * this.inverseTileSize;
    var lat = point.y * this.inverseTileSize;
    return new google.maps.LatLng(lat, lng);
  };
  
  // helper to get map LatLng from world coordinates
  // takes arguments in X, Y, Z order
  // (arguments are *out of order*, because within the function we use
  // the axes like the rest of Minecraft Overviewer -- with the Z and Y
  // flipped from normal minecraft usage.)
  function fromWorldToLatLng(x, z, y)
  {
    // the width and height of all the highest-zoom tiles combined, inverted
    var perPixel = 1.0 / (config.tileSize * Math.pow(2, config.maxZoom));
    
    // This information about where the center column is may change with a different
    // drawing implementation -- check it again after any drawing overhauls!
    
    // point (0, 0, 127) is at (0.5, 0.0) of tile (tiles/2 - 1, tiles/2)
    // so the Y coordinate is at 0.5, and the X is at 0.5 - ((tileSize / 2) / (tileSize * 2^maxZoom))
    // or equivalently, 0.5 - (1 / 2^(maxZoom + 1))
    var lng = 0.5 - (1.0 / Math.pow(2, config.maxZoom + 1));
    var lat = 0.5;
    
    // the following metrics mimic those in ChunkRenderer.chunk_render in "chunk.py"
    
    // each block on X axis adds 12px to x and subtracts 6px from y
    lng += 12 * x * perPixel;
    lat -= 6 * x * perPixel;
    
    // each block on Y axis adds 12px to x and adds 6px to y
    lng += 12 * y * perPixel;
    lat += 6 * y * perPixel;
    
    // each block down along Z adds 12px to y
    lat += 12 * (128 - z) * perPixel;

    // add on 12 px to the X coordinate and 18px to the Y to center our point
    lng += 12 * perPixel;
    lat += 18 * perPixel;
    
    return new google.maps.LatLng(lat, lng);
  }
  
  var MCMapOptions = {
    getTileUrl: function(tile, zoom) {
      var url = config.path;
      if(tile.x < 0 || tile.x >= Math.pow(2, zoom) || tile.y < 0 || tile.y >= Math.pow(2, zoom)) {
        url += '/blank';
      } else if(zoom == 0) {
        url += '/base';
      } else {
        for(var z = zoom - 1; z >= 0; --z) {
          var x = Math.floor(tile.x / Math.pow(2, z)) % 2;
          var y = Math.floor(tile.y / Math.pow(2, z)) % 2;
          url += '/' + (x + 2 * y);
        }
      }
      url = url + '.' + config.fileExt;
      if(config.cacheMinutes > 0) {
        var d = new Date();
        url += '?c=' + Math.floor(d.getTime() / (1000 * 60 * config.cacheMinutes));
      }
      return(url);
    },
    tileSize: new google.maps.Size(config.tileSize, config.tileSize),
    maxZoom:  config.maxZoom,
    minZoom:  0,
    isPng:    !(config.fileExt.match(/^png$/i) == null)
  };
  
  var MCMapType = new google.maps.ImageMapType(MCMapOptions);
  MCMapType.name = "MC Map";
  MCMapType.alt = "Minecraft Map";
  MCMapType.projection = new MCMapProjection();
  
  function CoordMapType() {
  }
  
  function CoordMapType(tileSize) {
    this.tileSize = tileSize;
  }
  
  CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
    var div = ownerDocument.createElement('DIV');
    div.innerHTML = "(" + coord.x + ", " + coord.y + ", " + zoom + ")";
    div.innerHTML += "<br />";
    div.innerHTML += MCMapOptions.getTileUrl(coord, zoom);
    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.style.fontSize = '10';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px';
    div.style.borderColor = '#AAAAAA';
    return div;
  };
