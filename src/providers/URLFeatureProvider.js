require("./FeaturesProvider.js");

/**
 * Base class to create a feature provider with url
 * @class
 * @mixes L.Mixin.Events
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.providers.URLFeatureProvider = SMC.providers.FeaturesProvider.extend({
/** @lends SMC.providers.URLFeatureProvider# */
	
	options: {
		/**
		 * URL path to represent the source features.
		 * @property {string} url - The default url to the feature provider
		 */
		url: null
	},
	/**
	 * Initialize the object with the params
	 * @param {string} url - url origin of features
	 */
	initialize: function(options){
		L.Util.setOptions(this, options);
	},

	/**
	 * Retrieves the features from its source.
	 * @fires SMC.providers.FeaturesProvider#featuresLoaded
	 */
	loadFeatures: function() {
		this.options.url = this.getWFSFeatureProviderURL();
		if(this.options.url != null){
			$.ajax({
				url: this.options.url,
				type: "GET",
				success: function(response) {
					if(response != null){

					}				
				},
			dataType: "json"
			});
		}
	},

	getWFSFeatureProviderURL: function(){
		throw new Error("FeaturesProvider::getWFSFeatureProviderURL must be implemented by derivate classes.");
	}
});