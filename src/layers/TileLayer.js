require("./layers");
require("./SingleLayer.js");

/**
 * Wrapper for [Leaflet's WMS layer]{@link http://leafletjs.com/reference.html#tilelayer}
 * so its integrated in the SMC's viewer layer architecture.
 *
 * @class
 * @extends L.TileLayer
 * @mixes SMC.layers.SingleLayer
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.TileLayer = L.TileLayer.extend(
    /** @lends SMC.layers.TileLayer# */
    {

        includes: [SMC.layers.SingleLayer]
    });

/**
 * API factory method for ease creation of tile layers.
 * @params {String} url - The url the tiles are retrieved from
 * @params {Object} options - Options for the layer.
 */
SMC.tileLayer = function(url, options) {
    return new SMC.layers.TileLayer(url, options);
};
