require("./markers.js");
require("./MarkerLayer.js");
require("../../providers/AtmosphereRTFeatureProvider.js");


/**
 * Marker layer able to retrieve and update its markers from an Atmosphere
 * real time source.
 * @class
 
 * @extends SMC.layers.markers.MarkerLayer
 * @mixes SMC.providers.WFSFeatureProvider
 *
 * @author Luis Román (marcos@emergya.com)
 */
SMC.layers.markers.AtmosphereRTMarkerLayer = SMC.layers.markers.MarkerLayer.extend(
    /** @lends SMC.layers.markers.AtmosphereRTMarkerLayer# */
    {
        includes: SMC.Util.deepClassInclude([SMC.providers.AtmosphereRTFeatureProvider]),

        initialize: function(options) {
            SMC.layers.markers.MarkerLayer.prototype.initialize.call(this, options);
            SMC.providers.AtmosphereRTFeatureProvider.prototype.initialize.call(this, options);
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

        /**
         * Implementations of FeatureProvider must contain an override of this method, so features can be loaded from their source.
         * @abstract
         */
        doFeaturesLoading: function() {
            return $.Deferred();
        },


    });
/**
 * API factory method for ease creation of atmosphere powered realtime marker layers.
 * @params {Object} options - Options for the marker layer and Atmosphere provider.
 */
SMC.atmosphereRTMarkerLayer = function(options) {
    return new SMC.layers.markers.AtmosphereRTMarkerLayer(options);
};
