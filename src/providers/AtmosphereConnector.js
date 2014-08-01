require("./providers.js");
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
SMC.providers.AtmosphereConnector = L.Class.extend(
    /** @lends SMC.providers.AtmosphereRTFeatureProvider# */
    {

        includes: [L.Mixin.Events],

        /**
         * @typedef {Object} SMC.providers.AtmosphereRTFeatureProvider~options
         * @property {string} topic="" - The default topic value.
         */
        options: {
            url: "",
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
            L.Util.setOptions(this, options);
        },

        _createSubscription: function() {
            if (!this.options.url) {
                throw new Error("SMC.providers.AtmosphereConnector::_createSubscription: A valid url field is required to be included in the options argument");
            }

            var request = {
                url: this.options.url + (this.options.topic ? ("/" + this.options.topic) : ""),
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

            request.onClose = function(response) {
                self.fireEvent("socketClosed", self.socket);
            };

            request.onError = function(response) {
                console.debug(response);
            };

            this.socket = $.atmosphere.subscribe(request);
        },

        _onMessage: function(response) {
            throw new Error("SMC.providers.AtmosphereConnector::_createSubscription must be implemented in derivate classes.");
        }
    }
);
