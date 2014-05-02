require("./MarkerLayer.js");
require("../../providers/WFSProvider.js");


/**
 * Layer for all SMC map viewer's WFS layers rendered using markers.
 * @class
 * @abstract
 * @extends SMC.layers.markers.MarkerLayer
 * @mixes SMC.providers.WFSFeatureProvider
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.layers.markers.WFSMarkerLayer = SMC.layers.markers.MarkerLayer.extend(
    /** @lends SMC.layers.markers.WFSMarkerLayer# */
    {
        includes: SMC.Util.deepClassInclude([SMC.providers.WFSProvider]),

        initialize: function(options) {
            SMC.layers.markers.MarkerLayer.prototype.initialize.call(this, options);
            SMC.providers.WFSProvider.prototype.initialize.call(this, options);
        },

        /**
         * Method to load the features into marker layer
         */
        onFeaturesLoaded: function(features) {
            this.addMarkerFromFeature(features);
        },

        load: function() {
            this.loadFeatures();
        },

        createNodeHTML: function() {
            return this.options.label || this.options.typeName;
        }

    });
/**
 * API factory method for ease creation of wfs features providers.
 * @params {Object} options - Options for wfs the provider.
 */
SMC.wfsMarkerLayer = function(options) {
    return new SMC.layers.markers.WFSMarkerLayer(options);
};
