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
		srsName: null,
		/**
		 * WFS CQL Filter parameter.
		 * @property {string} cqlFilter - The default wfs cql filter parameter.
		 */
		cqlFilter: null,
		/**
		 * WFS outputFormat parameter.
		 * @property {string} outputFormat - The default wfs output format parameter.
		 */
		outputFormat: "json",
		/**
		 * WFS serverURL parameter.
		 * @property {string} serverURL - The wfs server url path parameter.
		 */
		serverURL: null
	},
	/**
	 * Initialize the object with the params
	 * @param {string} options - object with need parameters
	 */
	initialize: function(options){
		L.Util.setOptions(this, options);
	},
	/**
	 * Retrieves the features from its source.
	 * @fires SMC.providers.FeaturesProvider#featuresLoaded
	 */
	loadFeatures: function() {
		this.options.url = this.getWFSFeatureProviderURL();
		if(this.options.url != null){
			$.ajax({
				url: this.options.url,
				type: "GET",
				success: function(response) {
					if(response != null){

					}				
				},
			dataType: "json"
			});
		}
	},

	/**
	 * Compose an url from WFS service parameters
	 */
	getWFSFeatureProviderURL: function(){
		var url = "";
		if(this.options.serverURL != null){
			url += this.options.serverURL 
			+ "?service=" + this.options.service 
			+ "&request=" + this.options.request 
			+ "&outputformat=" + this.options.outputFormat 
			+ "&version=" + this.options.version 
			+ "&typeName=" + this.options.typeName;
		}
		if(this.options.cqlFilter != null){
			url += "&" + this.options.cqlFilter;
		}
		return url;
	}
});
/**
 * API factory method for ease creation of wfs features providers.
 * @params {Object} options - Options for wfs the provider.
 */
SMC.wfsProvider = function(options) {
	return new SMC.providers.WFSFeatureProvider(options);
};