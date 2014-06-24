require("./providers.js");
require("./RTFeatureProvider.js");
require("../../lib/atmosphere-jquery/jquery.atmosphere.js");


/**
 * Base class for layer data providers capabla of receiving updates to the features
 * retrieved initially from a Real Time source.
 * @class
 * @abstract
 * @extends SMC.providers.RTFeatureProvider
 * @param {SMC.providers.AtmosphereRTFeatureProvider~options} options - The configuration for the class
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.providers.AtmosphereRTFeatureProvider = SMC.providers.RTFeatureProvider.extend(
    /** @lends SMC.providers.AtmosphereRTFeatureProvider# */
    {
        /**
         * @typedef {Object} SMC.providers.AtmosphereRTFeatureProvider~options
         * @property {string} topic="" - The default topic value.
         */
        options: {
            topic: ""
        },

        /**
         * Socket
         * @property {string} socket - The default socket value.
         * @default null
         */
        socket: null,

        /**
         * Initialize the object with the option parameter
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
                url: this.options.url,
                contentType: "application/json",
                logLevel: 'debug',
                transport: 'websocket',
                trackMessageLength: true,
                fallbackTransport: 'long-polling'
            };

            var self = this;
            request.onOpen = function(response) {
                self.fireEvent("socketOpened", self.socket);
            };

            request.onMessage = function(response) {
                self._onMessage(response);
            };

            request.onClose = function(response) {};

            request.onError = function(response) {
                console.debug(response);
            };

            this.socket = $.atmosphere.subscribe(request);
        },

        _onMessage: function(response) {
            var featuresAdded = [];
            var featuresDeleted = [];
            var featuresModified = [];
            for (var i = 0; i < response.messages.length; i++) {
                var message = JSON.parse(response.messages[i]);
                for (var j = 0; j < message.featureCollection.features.length; j++) {
                    var feature = message.featureCollection.features[j];
                    switch (message.action) {
                        case "ADD":
                            featuresAdded.push(feature);
                            break;
                        case "DELETE":
                            featuresDeleted.push(feature);
                            break;
                        case "MODIFY":
                            featuresModified.push(feature);
                            break;
                        default:
                            throw new Error("SMC.providers.AtmosphereRTFeatureProvider::_onMessage: Unsupported action " + message.action);
                    }

                }
            }


            this.onFeaturesLoaded(featuresAdded);
            this.onFeaturesDeleted(featuresDeleted);
            this.onFeaturesModified(featuresModified);
        }
    }
);
