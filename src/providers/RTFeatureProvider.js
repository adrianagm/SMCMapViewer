require("./providers.js");
require("./URLFeatureProvider.js");


/**
 * Base class for layer data providers capabla of receiving updates to the features
 * retrieved initially from a Real Time source.

 * @class
 * @abstract
 * @extends SMC.providers.URLFeatureProvider
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.providers.RTFeatureProvider = SMC.providers.URLFeatureProvider.extend(
    /** @lends SMC.providers.RTFeatureProvider# */
    {
        
        /**
         * Initialize the object with options parameter
         * @param {object} options - default options
         */
        initialize: function(options) {
            SMC.providers.URLFeatureProvider.prototype.initialize.apply(this, arguments);
            L.Util.setOptions(this, options);
        },
        /**
         * Retrieves the features from its source
         * @fires SMC.providers.FeaturesProvider#featuresLoaded
         */
        loadFeatures: function() {
            SMC.providers.URLFeatureProvider.prototype.loadFeatures.call(this);
            this._createSubscription();
        },
        /**
         * Method to create a subcription
         * @abstract
         * @private
         */
        _createSubscription: function() {
            throw new Error("SMC.providers.RTFeatureProvider::_createSubscription: must be implemented in derivate classes.");
        },

        /**
         * Method to execute when a feature have been modified. Implementations of RTFeatureProvider must contain an override of this method
         * @abstract
         * @param {object} features - Features to be modified 
         */
        onFeaturesModified: function(features) {
            throw new Error("SMC.providers.RTFeatureProvider::onFeaturesModified must be implemented by derivate classes.");
        },

        /**
         * Method to execute when a feature have been deleted. Implementations of RTFeatureProvider must contain an override of this method
         * @abstract
         * @param {object} features - Features to be deleted 
         */
        onFeaturesDeleted: function(features) {
            throw new Error("SMC.providers.RTFeatureProvider::onFeaturesDeleted must be implemented by derivate classes.");
        }

    });
