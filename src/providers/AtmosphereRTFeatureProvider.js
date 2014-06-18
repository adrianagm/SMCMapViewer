require("./providers.js");
require("./RTFeatureProvider.js");
require("../../lib/atmosphere-jquery/jquery.atmosphere.js");


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

    socket: null,


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
    },

    _createSubscription: function() {
        var request = {
            url : this.options.url,
            contentType : "application/json",
            logLevel : 'debug',
            transport : 'websocket',
            trackMessageLength : true,
            fallbackTransport : 'long-polling'
        }

        var self = this;
        request.onOpen = function(response) {
            self.fireEvent("socketOpened", self.socket);
        };

        request.onMessage = function(response) {

            var features = [];
            for(var i=0; i < response.messages.length; i++) {
                features.push(JSON.parse(response.messages[i]).featureCollection);
            }

            self.onFeaturesLoaded(features);
        };

        request.onClose = function(response) {
        }

        request.onError = function(response) {
            console.debug(response);
        };

        this.socket = $.atmosphere.subscribe(request);
    },



});
