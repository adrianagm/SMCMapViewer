require("./SMC.js");
require("./Util.js");
require("./LayerLoader.js");

/**
 * The map viewer component of SMC.
 * Extends [Leaflet's map component]{@link http://leafletjs.com/reference.html#map-class}
 * to include our needed functionality.
 *
 * @class The map viewer component of SMC.
 * @extends L.Map
 * @mixes SMC.LayerLoader
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.Map = L.Map.extend(
	/** @lends SMC.Map# */
	{
	
		
	}, [SMC.LayerLoader]);

/**
 * API factory method for creating SMCViewer's Maps.
 * @method
 * @param {(HTMLElement|String)} element - The id of the element the map will be created in
 * @param {Object} options - Configuration for the map
 */
SMC.map = function(element, options) {
	return new SMC.Map(element, options);
};