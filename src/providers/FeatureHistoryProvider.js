/**
 * Base class for layer data providers getting a historical set of features, grouped by the time point
 * the features' values are present.
 * @class
 * @abstract
 * @extends L.Class
 * @mixes L.Mixin.Events
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.providers.FeatureHistoryProvider = L.Class.extend(
	/** @lends SMC.providers.FeatureHistoryProvider# */
	{

		includes: L.Mixin.Events,

		/**
		 * Retrieves the feature history from its source.
		 * @fires SMC.providers.FeatureHistoryProvider#featureHistoryLoaded
		 */
		loadFeatures: function() {
			var tis = this;
			this.doFeatureHistoryLoading(function(features) {
				tis.onFeaturesLoaded(features);

				/**
				 * Features loaded event.
				 *
				 * @event SMC.providers.FeatureHistoryProvider#featureHistoryLoaded
				 * @property {SMC.providers.Feature[]} features - The loaded features.
				 */
				tis.fire("featureHistoryLoaded", features);
			});
		},


		/**
		 * Implementations of FeatureHistoryProvider must contain an override of this method, so feature histore can be loaded from their source.	
		 * @abstract
		 * @param {SMC.providers.FeatureHistoryProvider~doFeatureHistoryLoadCallback} callback - Callback that handles the loading end. Must be called by implementations before the method ends.
		 */
		doFeatureHistoryLoading: function(callback) {
			throw new Error("FeatureHistoryProvider::doFeatureHistoryLoading must be implemented by derivate classes.");
		},

		/**
		 * Implementations or users of FeatureHistoryProvider must provide an implementation of this class so the retrieved features history can be used.
		 * @abstract
		 * @param {SMC.providers.FeatureHistory} featureHistory - The feature history retrieved by the provider.
		 */
		onFeatureHistoryLoaded: function(featureHistory) {
			throw new Error("FeatureHistoryProvider::onFeatureHistoryLoaded must be implemented by derivate classes.");
		}

		/**
		 * Callback needed to be called as finishing step of feature history loading.
		 * @callback SMC.providers.FeatureHistoryProvider~doFeatureHistoryLoadCallback
		 * @param {SMC.providers.FeatureHistory} featureHistory - The feature history retrieved.
		 */

	}
);