
  var config = {
    path:        'tiles',  //path to tiles displayed on load
    fileExt:     '{imgformat}',
    tileSize:     384,
    defaultZoom:  1,
    maxZoom:      {maxzoom},
    cacheMinutes: 0, // Change this to have browsers automatically request new images every x minutes
    debug:        false
  };


// define a list of pattern-label pairs.  Each label will appear
// in the 'Signposts' control, allowing your users to quickly enable
// or disable certain labels.  See below for some examples:
var signGroups = {
//    "Directions": /^#Direction/i,
//    "Big Dig": /big\s*dig/i,
//    "Warnings": /warning/i,
};

// define a list of render-label pairs.  Each label will appear
//  as a separate button in the top-right for changing which render
//  is currently viewed.
// The right value is the path to the tiles for each render
//
// Leave this empty to disable the render-switching buttons
var tilePaths = {
  "Surface":		'tiles',
  "Surface (Night)":	'night/tiles',
//  "Caves":		'cave/tiles'
}

// Please leave the following variables here:
var markerCollection = {}; // holds groups of markers

var map;

var markersInit = false;
var regionsInit = false;
