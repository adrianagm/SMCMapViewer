require("./providers.js");
require("./RTFeatureProvider.js");
require("./AtmosphereConnector.js");


/**
 * Base class for layer data providers capabla of receiving updates to the features
 * retrieved initially from a Real Time source.
 * @class
 * @abstract
 * @extends SMC.providers.RTFeatureProvider
 * @mixes SMC.providers.AtmosphereConnector
 * @param {SMC.providers.AtmosphereRTFeatureProvider~options} options - The configuration for the class
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.providers.AtmosphereRTFeatureProvider = SMC.providers.RTFeatureProvider.extend(
    /** @lends SMC.providers.AtmosphereRTFeatureProvider# */
    {
        includes: SMC.Util.deepClassInclude([SMC.providers.AtmosphereConnector]),

        /**
         * Initialize the object with the option parameter
         * @param {object} options - default options
         */
        initialize: function(options) {
            SMC.providers.RTFeatureProvider.prototype.initialize.call(this, options);
            SMC.providers.AtmosphereConnector.prototype.initialize.call(this, options);
            L.Util.setOptions(this, options);
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
