require("../lib/leaflet/src/Leaflet.js");
require("../lib/leaflet/src/core/Util.js");
require("../lib/leaflet/src/core/Class.js");
require("../lib/leaflet/src/core/Events.js");
require("../lib/leaflet/src/core/Browser.js");
require("../lib/leaflet/src/core/Handler.js");
require("../lib/leaflet/src/geometry/Point.js");
require("../lib/leaflet/src/geometry/Bounds.js");
require("../lib/leaflet/src/geometry/Transformation.js");
require("../lib/leaflet/src/dom/DomUtil.js");
require("../lib/leaflet/src/geo/LatLng.js");
require("../lib/leaflet/src/geo/LatLngBounds.js");
require("../lib/leaflet/src/geo/projection/Projection.js");
require("../lib/leaflet/src/geo/projection/Projection.SphericalMercator.js");
require("../lib/leaflet/src/geo/projection/Projection.LonLat.js");
require("../lib/leaflet/src/geo/crs/CRS.js");
require("../lib/leaflet/src/geo/crs/CRS.Simple.js");
require("../lib/leaflet/src/geo/crs/CRS.EPSG3857.js");
require("../lib/leaflet/src/geo/crs/CRS.EPSG4326.js");

require("../lib/leaflet/src/map/Map.js");
require("./SMC.js");

/**
 * The map viewer component of SMC.
 * Extends [Leaflet's map component]{@link http://leafletjs.com/reference.html#map-class}
 * to include our needed functionality.
 *
 * @class The map viewer component of SMC.
 * @extends L.Map
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.Map = L.Map.extend(
	/** @lends SMC.Map# */
	{

	});

/**
 * API factory method for creating SMCViewer's Maps.
 * @method
 * @param {(HTMLElement|String)} element The id of the element the map will be created in
 * @param {object} options Configuration for the map
 */
SMC.map = function(element, options) {
	return new SMC.Map(element, options);
};