require("./WFSProvider");
/**
 * Base class to create a WFS-T provider
 * @class
 * @extends SMC.providers.WFSProvider
 * @mixes L.Mixin.Events
 * @param {SMC.providers.WFSTProvider~options} options - The configuration for the class
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.providers.WFSTProvider = SMC.providers.WFSProvider.extend(
	/** @lends SMC.providers.WFSTProvider# */
	{
        includes: SMC.Util.deepClassInclude([SMC.providers.WFSProvider]),
		/**
         * Initialize the class with options parameter
         * @param {object} options - default options
         */
        initialize: function(options) {
            SMC.providers.WFSProvider.prototype.initialize.call(this, options);
        },
        /**
         * Method to prepare WFS-T request payload to insert a geometry
         * @private
         */
        _insert: function(geometry){
        	throw new Error("SMC.providers.WFSTProvider::_insert: must be implemented in derivate classes.");
        },
        /**
         * Method to prepare WFS-T request payload to update a geometry
         * @private
         */
        _update: function(geometry){
        	throw new Error("SMC.providers.WFSTProvider::_update: must be implemented in derivate classes.");
        },
        /**
         * Method to prepare WFS-T request payload to delete a geometry
         * @private
         */
        _delete: function(geometry){
        	throw new Error("SMC.providers.WFSTProvider::_delete: must be implemented in derivate classes.");
        },
        /**
         * Method to send WFS-T request
         * @private
         */
        _sendRequest: function(options){
        	throw new Error("SMC.providers.WFSTProvider::_sendRequest: must be implemented in derivate classes.");
        },
	}
);
 /**
 * API factory method for ease creation of wfs features providers.
 * @params {Object} options - Options to initialize the WFS provider
 */
SMC.wfstProvider = function(options) {
    return new SMC.providers.WFSTProvider(options);
};