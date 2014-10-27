require("./FeaturesProvider.js");

/**
 * Base class to create a feature provider with url
 * @class
 * @extends SMC.providers.FeaturesProvider
 * @param {SMC.providers.URLFeatureProvider~options} options - The configuration for the class
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.providers.URLFeatureProvider = SMC.providers.FeaturesProvider.extend(
    /** @lends SMC.providers.URLFeatureProvider# */
    {

        /**
         * @typedef {Object} SMC.providers.URLFeatureProvider~options
         * @property {string} url=null - The default url to the feature provider
         */
        options: {
            url: null,
            dataType: "jsonp"
        },
        /**
         * Initialize the class with options parameter
         * @param {object} options - default options
         */
        initialize: function(options) {
            SMC.providers.FeaturesProvider.prototype.initialize.apply(this, arguments);
            L.Util.setOptions(this, options);
        },

        /**
         * Send request to get the features
         * @returns {object} Deferred object from jQuery
         */
        doFeaturesLoading: function() {
            if (this.options.url) {
                return $.ajax({
                    url: this.options.url,
                    type: "GET",
                    dataType: this.options.dataType
                });
            }
            return $.Deferred();
        }
    }
);
