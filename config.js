
  var config = {
    //path:        'tiles',  //path to tiles displayed on load.  Unused if mapTypeOptions provided below
    defaultMapType:   0, //index of the map type (as defined in mapTypeOptions below) to load by default
    fileExt:     '{imgformat}',
    tileSize:     384,
    defaultZoom:  1,
    maxZoom:      {maxzoom},
    cacheMinutes: 0, // Change this to have browsers automatically request new images every x minutes
    customMapControl: false,
    debug:        false
  };


/* signGroups -- A list of signpost groups.  A signpost can fall into zero, one, or more than one
 * group.  See below for some examples.
 *
 * Required: 
 *     label : string.  Displayed in the drop down menu control.
 *     match : function.  Applied to each marker (from markers.js).  It is returns true if the marker
 *                        Should be part of the group.
 *
 * Optional:
 *     checked : boolean.  Set to true to have the group visible by default
 */
var signGroups = [
//    {label: "'To'", checked: false, match: function(s) {return s.msg.match(/to/)}},
//    {label: "Storage", match: function(s) {return s.msg.match(/storage/i) || s.msg.match(/dirt/i) || s.msg.match(/sand/)}},
//    {label: "Below Sealevel", match: function(s) { return s.y<64;}},   
    {label: "All", match: function(s) {return true}}
];

/* mapTypeOptions -- A list of map types to create.  These are generally separate renders of the
 * world to switch between.  Each entry is used to provide an ImageMapTypeOptions as defined
 * in the Google Maps API. See below for some examples.
 * Note that the controls won't appear if only one map type is presented here.
 *
 * Required:
 *     name : string.  Displayed in the MapControl.
 *     path : string.  Path to the tiles directory
 *
 * Optional:
 *     alt : string.  Displayed when moused over in the MapControl.
 *     unlisted: boolean.  Set to true to prevent listing this MapType in the MapTypeControl.  Useful for overlays.
 *
 *     Any other parameters as defined in ImageMapTypeOptions.  However, the following parameters
 *     are added during initialization and are unnecessary here:
 *         getTileUrl(), isPng(), maxZoom, minZoom, tileSize
 *
 */
var mapTypeOptions = [
   {name: "Day", path: 'tiles', alt: "Surface at full lighting"},
//   {name: "Night", path: 'night/tiles', alt: "Surface at night"},
//   {name: "Caves", path: 'cave/tiles'}
]

// Please leave the following variables here:
var markerCollection = {}; // holds groups of markers

var map;

var markersInit = false;
var regionsInit = false;
var mapTypesInit = false;