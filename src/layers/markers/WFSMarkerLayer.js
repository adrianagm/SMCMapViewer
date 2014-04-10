require("./MarkerLayer.js");
require("../../providers/WFSProvider.js");

/**
 * Layer for all SMC map viewer's WFS layers rendered using markers.
 * @class
 * @abstract
 * @mixes SMC.providers.WFSFeatureProvider
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
 SMC.layers.markers.WFSMarkerLayer = SMC.layers.markers.MarkerLayer.extend({
 	/** @lends SMC.layers.markers.WFSMarkerLayer# */

 	provider: null,

 	initialize: function(options){
 		SMC.layers.markers.MarkerLayer.prototype.initialize.call(this, options);
 		this.provider = new SMC.providers.WFSProvider(options);
 		this.provider.on("featuresLoaded", this.onFeaturesLoaded, this);
 	},

 	/**
	 * Method to load the features into marker layer
	 */
 	onFeaturesLoaded: function(features){
 		this.addMarkerFromFeature(features);
 	},

 	load: function(){
 		this.provider.loadFeatures();
 	}
 });
 /**
 * API factory method for ease creation of wfs features providers.
 * @params {Object} options - Options for wfs the provider.
 */
SMC.wfsMarkerLayer = function(options) {
	return new SMC.layers.markers.WFSMarkerLayer(options);
};