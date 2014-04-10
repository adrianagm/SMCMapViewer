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
	 * @param {object} options - default options
	 */
	initialize: function(options) {
		L.Util.setOptions(this, options);
	},

	/**
	 * Send request to get the features
	 * @returns {object} Deferred object from jQuery
	 */
	doFeaturesLoading: function() {
		if (this.options.url != null) {
			return $.ajax({
				url: this.options.url,
				type: "GET",
				dataType: "jsonp"
			});
		}
		return $.Deferred();
	},

	getWFSFeatureProviderURL: function() {
		throw new Error("FeaturesProvider::getWFSFeatureProviderURL must be implemented by derivate classes.");
	}
});