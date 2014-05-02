require("./layers");
require("./SingleLayer.js");


/**
 * Wrapper for [Leaflet's WMS layer]{@link http://leafletjs.com/reference.html#tilelayer-wms } so its integrated in the SMC's viewer layer architecture.
 *
 * @class
 * @extends L.TileLayer.WMS
 * @mixes SMC.layers.SingleLayer
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.WMSLayer = L.TileLayer.WMS.extend(
    /** @lends SMC.layers.WMSLayer# */
    {

        includes: [SMC.layers.SingleLayer]
    });

/**
 * API factory method for ease creation of WMS layers.
 * @params {String} url - The url the tiles are retrieved from
 * @params {Object} options - Options for the layer.
 */
SMC.wmsLayer = function(url, options) {
    return new SMC.layers.WMSLayer(url, options);
};
