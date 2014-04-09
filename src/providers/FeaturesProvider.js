require("./providers.js");

/**
 * Base class for layer data providers returning arrays of Features.
 * @class
 * @abstract
 * @mixes L.Mixin.Events
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.providers.FeaturesProvider = L.Class.extend(
/** @lends SMC.providers.FeaturesProvider# */
{

	includes: L.Mixin.Events,

	/**
	 * Retrieves the features from its source.
	 * @fires SMC.providers.FeaturesProvider#featuresLoaded
	 */
	loadFeatures: function() {
		var tis = this;
		this.doFeaturesLoading(function(features) {
			tis.onFeaturesLoaded(features);

			/**
			 * Features loaded event.
			 *
			 * @event SMC.providers.FeaturesProvider#featuresLoaded
			 * @property {SMC.providers.Feature[]} features - The loaded features.
			 */
			tis.fire("featuresLoaded", features);
		});
	},


	/**
	 * Implementations of FeatureProvider must contain an override of this method, so features can be loaded from their source.	
	 * @abstract
	 * @param {SMC.providers.FeaturesProvider~doFeaturesLoadingCallback} callback - Callback that handles the loading end. Must be called by implementations before the method ends.
	 */
	doFeaturesLoading: function(callback) {
		throw new Error("FeaturesProvider::doFeaturesLoading must be implemented by derivate classes.");
	},

	/**
	 * Implementations or users of FeatureProvider must provide an implementation of this class so retrieved features can be used.
	 * @abstract
	 * @param {Array<SMC.providers.Feature>} features - The features retrieved by the provider.
	 */
	onFeaturesLoaded: function(features) {
		throw new Error("FeaturesProvider::onFeaturesLoaded must be implemented by derivate classes.");
	}

	/**
	 * Callback needed to be called as finishing step of feature loading.
	 * @callback SMC.providers.FeaturesProvider~doFeaturesLoadingCallback
	 * @param {SMC.providers.Feature[]} features The features loaded.
	 */

});

/**
 * API factory method for ease creation of features providers.
 * @params {Object} options - Options for the provider.
 */
SMC.featuresProvider = function() {
	return new SMC.providers.FeaturesProvider();
};