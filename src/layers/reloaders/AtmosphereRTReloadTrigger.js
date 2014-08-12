require("./reloaders.js");
require("./ReloadTrigger.js");
require("../../providers/AtmosphereConnector.js");
require("../../../lib/atmosphere-jquery/jquery.atmosphere.js");

/**
 * Implementation of a SMC viewer's layer reload trigger using Atmosphere pub/sub javascript client, so we reload layers
 * when a notification is received.
 *
 * @class
 * @extends SMC.layers.reloaders.ReloadTrigger
 * @mixes SMC.providers.AtmosphereConnector
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.reloaders.AtmosphereRTReloadTrigger = SMC.layers.reloaders.ReloadTrigger.extend(
    /** @lends SMC.layers.reloaders.TimerReloadTrigger# */
    {

        /**
         * Initialize the object with the params
         * @param {object} options - default options
         */
        initialize: function(options) {
            SMC.layers.reloaders.ReloadTrigger.prototype.initialize.call(this, options);
            SMC.providers.AtmosphereConnector.prototype.initialize.call(this, options);
            L.Util.setOptions(this, options);
        },

        /**
         * Implementation of the initTrigger method using setTimeout.
         */
        initTrigger: function() {
            this._createSubscription();
        },

        _onMessage: function(response) {
            console.debug(response);
            this._notifyReload();
        }

    }, [SMC.providers.AtmosphereConnector]);
