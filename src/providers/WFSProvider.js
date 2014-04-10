require("./URLFeatureProvider.js");

/**
 * Base class to create a WFS provider
 * @class
 * @mixes L.Mixin.Events
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.providers.WFSFeatureProvider = SMC.providers.URLFeatureProvider.extend({

	options: {
		/**
		 * WFS Service.
		 * @property {string} service - The default wfs service.
		 */
		service: "wfs",
		/**
		 * WFS Version.
		 * @property {string} version - The default wfs version.
		 */
		version: "1.1.0",
		/**
		 * WFS request.
		 * @property {string} request - The default wfs request.
		 */
		request: "GetFeature",
		/**
		 * WFS Type name.
		 * @property {string} typeName - The default wfs typename.
		 */
		typeName: "namespace:featuretype",
		/**
		 * WFS Feature identifier.
		 * @property {string} featureID - The default wfs feature id.
		 */
		featureID: null,
		/**
		 * WFS count parameter.
		 * @property {string} count - The default wfs count parameter.
		 */
		count: null,
		/**
		 * WFS maxFeatures parameter.
		 * @property {string} maxFeatures - The default wfs max features parameter.
		 */
		maxFeatures: null,
		/**
		 * WFS sortBy parameter.
		 * @property {string} sortBy - The default wfs sort by parameter.
		 */
		sortBy: null,
		/**
		 * WFS propertyName parameter.
		 * @property {string} propertyName - The default wfs property nanem parameter.
		 */
		propertyName: null,
		/**
		 * WFS bbox parameter.
		 * @property {string} bbox - The default wfs bounding box parameter.
		 */
		bbox: null,
		/**
		 * WFS srsName parameter.
		 * @property {string} srsName - The default wfs coordinate reference system parameter.
		 */
		srsName: "EPSG:4326",
		/**
		 * WFS CQL Filter parameter.
		 * @property {string} cqlFilter - The default wfs cql filter parameter.
		 */
		cqlFilter: null,
		/**
		 * WFS outputFormat parameter.
		 * @property {string} outputFormat - The default wfs output format parameter.
		 */
		outputFormat: "text/javascript",
		/**
		 * WFS serverURL parameter.
		 * @property {string} serverURL - The wfs server url path parameter.
		 */
		serverURL: null,
		/**
		 * WFS format_options parameter.
		 * @property {string} format_options - The wfs format options parameter.
		 */
		format_options: "callback:geojsonWFS"
	},
	/**
	 * Initialize the object with the params
	 * @param {object} options - object with need parameters
	 */
	initialize: function(options){
		L.Util.setOptions(this, options);
	},
	/**
	 * Send WFS request to get the features
	 * @returns {object} Deferred object from jQuery
	 */
	doFeaturesLoading: function() {
		if(this.options.serverURL != null){
			return $.ajax({
				url: this.options.serverURL,
				data: this.getParamsFromOptions(),
				jsonpCallback: "geojsonWFS",
				type: "GET",
				dataType: "jsonp",
				jsonp: false
			});
		}
		return $.Deferred();
	},

	/**
	 * Get params from options attributes
	 * @returns {object} Object with the wfs params to send
	 */
	getParamsFromOptions: function(){
		var params = {};
		for(option in this.options){
			if(this.options[option] != null){
				params[option] = this.options[option];
			}
		}
		return params;
	}
});
/**
 * API factory method for ease creation of wfs features providers.
 * @params {Object} options - Options for wfs the provider.
 */
SMC.wfsProvider = function(options) {
	return new SMC.providers.WFSFeatureProvider(options);
};