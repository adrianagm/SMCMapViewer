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
    /** @lends SMC.providers.RTProvider# */
    {


        /**
         * Initialize the object with the params
         * @param {object} options - object with need parameters
         */
        initialize: function(options) {
            SMC.providers.URLFeatureProvider.prototype.initialize.apply(this, arguments);
            L.Util.setOptions(this, options);
        },

        loadFeatures: function() {
            SMC.providers.URLFeatureProvider.prototype.loadFeatures.call(this);
            this._createSubscription();
        },

        _createSubscription: function() {
            throw new Error("SMC.providers.RTFeatureProvider::_createSubscription: must be implemented in derivate classes.");
        },


        onFeaturesModified: function(features) {
            throw new Error("SMC.providers.RTFeatureProvider::onFeaturesModified must be implemented by derivate classes.");
        },

        onFeaturesDeleted: function(features) {
            throw new Error("SMC.providers.RTFeatureProvider::onFeaturesDeleted must be implemented by derivate classes.");
        }

    });
