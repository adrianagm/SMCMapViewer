
/**
 * The map viewer component of SMC. 
 * Extends Leaflet's map component to include our needed functionality.
 * @class The map viewer component of SMC.
 */
SMC.Map = L.Map.extend({});

SMC.map = function(element,options) { return new SMC.Map(element, options);};