require("./providers.js");
require("./RTFeatureProvider.js");
var Atmosphere = require("../../lib/atmosphere/atmosphere.js");


/**
 * Base class for layer data providers capabla of receiving updates to the features
 * retrieved initially from a Real Time source.

 * @class
 * @abstract
 * @extends SMC.providers.RTFeatureProvider
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.providers.AtmosphereRTFeatureProvider = SMC.providers.RTFeatureProvider.extend({
    /** @lends SMC.providers.AtmosphereRTFeatureProvider# */

    options: {
        topic: ""
    },

    atmosphereConnector: null,


    /**
     * Initialize the object with the params
     * @param {object} options - default options
     */
    initialize: function(options) {
        SMC.providers.RTFeatureProvider.prototype.initialize.call(this, options);
        L.Util.setOptions(this, options);
        if (!options.topic) {
            throw new Error("SMC.providers.AtmosphereRTFeatureProvider::initialize: A valid topic field is required to be included in the options argument");
        }
    }

});
