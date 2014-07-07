require("./TiledGeometryLayer.js");
require("../../providers/WFSProvider.js");
/**
 * Base class for layers using a WFS provider to get the features
 *
 * @class
 * @abstract
 * @extends SMC.layers.geometry.TiledGeometryLayer
 * @mixes SMC.providers.WFSProvider
 * @param {SMC.layers.geometry.TiledGeometryLayer~options} options - The configuration for the class
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.geometry.WFSTiledGeometryLayer = SMC.layers.geometry.TiledGeometryLayer.extend(
    /** @lends SMC.layers.geometry.WFSTiledGeometryLayer# */
    {

        includes: SMC.Util.deepClassInclude([SMC.providers.WFSProvider]),

        /**
         * Initialize the object with the params
         * @param {object} options - object with need parameters
         */
        initialize: function(options) {
            SMC.layers.geometry.TiledGeometryLayer.prototype.initialize.call(this, options);
            SMC.providers.WFSProvider.prototype.initialize.call(this, options);
            L.Util.setOptions(this, options);
            this.setZIndex(1000);
        },

        /**
         * Method to load a tile on the map
         * @param {Object} bbox - bounding box of the tile to load
         */
        loadTile: function(bbox){
            return this.doFeaturesLoading(bbox);
        },

        /**
         * Method to create an HTML node for the name of the layer.
         * @returns {String} HTML code representing the code to be added to the layer's entry in the layer tree.
         */
        createNodeHTML: function() {
            return this.options.label || this.options.typeName;
        }
    }
);

/**
 * API factory method for easy creation of wfs tiled geometry layer.
 * @params {Object} options - Options to initialize the WFS tiled 
 */
SMC.wfsTiledGeometryLayer = function(options) {
    return new SMC.layers.geometry.WFSTiledGeometryLayer(options);
};