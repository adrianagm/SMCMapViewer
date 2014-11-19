require("./URLFeatureProvider.js");


/**
 * Base class to create a WFS provider
 * @class
 * @extends SMC.providers.URLFeatureProvider
 * @mixes L.Mixin.Events
 * @param {SMC.providers.WFSProvider~options} options - The configuration for the class
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.providers.SolrHistoryProvider = SMC.providers.URLFeatureProvider.extend(
    /** @lends SMC.providers.WFSProvider# */
    {
        _aggregatingLayers: {},
        features: [],
       /**
        * @typedef {Object} SMC.providers.WFSProvider~options
        * @property {SMC.providers.WFSProvider~requestParams} requestParams - Default wfs request parameters
        * @property {string} serverURL=null - The wfs server url path parameter
        * @property {string} bbox=null - The bbox parameter
        */
        options: {
            /** @typedef {Object} SMC.providers.WFSProvider~requestParams - Default wfs request parameters
             * @property {string} service="wfs" - Default wfs service
             * @property {string} version="1.1.0" - Default wfs version
             * @property {string} request="GetFeature" - Default wfs request
             * @property {string} typeName="namespace:featuretype" - Default wfs typename
             * @property {string} featureID=null - Default wfs feature id
             * @property {string} count=null - Default wfs count parameter
             * @property {string} maxFeatures=null - Default wfs max features parameter
             * @property {string} sortBy=null - Default wfs sort by parameter
             * @property {string} propertyName=null - Default wfs property name parameter
             * @property {string} srsName="EPSG:4326" - Default wfs coordinate reference system parameter
             * @property {string} cqlFilter=null - Default wfs cql filter parameter
             * @property {string} outputFormat="text/javascript" - Default wfs output format parameter
             * @property {string} format_options=null - Default wfs format options parameter
             */
            requestParams:{
               q:'*:*',
               fq:null,
               sort: null,
               fl: null,
               df: null,
               rows: null,
               wt: 'json',
               indent: true,
              
              
            },
            serverURL: null,
            timeField: 'time',
            geomField: 'location'
            
            
        },
        /**
         * Initialize the class with options parameter
         * @param {object} options - default options
         */
        initialize: function(options) {
            L.Util.setOptions(this, options);
        },
        /**
         * Send WFS request to get the features
         * @returns {object} Deferred object from jQuery
         */
        doFeaturesLoading: function() {
        	
            var self = this;

       
            $.ajax({
                url: this.options.serverURL + "?json.wrf=?&group=true&group.field=" + this.options.timeField,
                data: this.getParamsFromOptions(),
                dataType:'jsonp',
                success: function(result){
                   var numRows = result.grouped[self.options.timeField].matches;
                   var values = [];
                   var groups =result.grouped[self.options.timeField].groups;
                   for(var i in groups){
                        values.push(groups[i].groupValue);
                        //self._aggregatingLayers[groups[i].groupValue] = new SMC.layers.geometry.GeometryLayer(self.options);
                   }

                   self.doLayersGroupLoading(numRows, values);
          
                }
            });
            
        },

        /**
         * Get params from options attributes
         * @returns {object} Object with the wfs params to send
         */
        getParamsFromOptions: function() {
            var params = {};
            for (var option in this.options.requestParams) {
                
                if(this.options[option]){
                     params[option] = this.options[option];
                }
                else if (this.options.requestParams[option] !== null){
                    params[option] = this.options.requestParams[option];
                }
                

            }
            return params;
        },

        doLayersGroupLoading:function(rows, values){
            var self = this; 
            this.options.requestParams.rows = rows;
            var allFeatures = [];
             $.ajax({
                url: this.options.serverURL + "?json.wrf=?",
                data: this.getParamsFromOptions(),
                dataType:'jsonp',
                success: function(result){
                   var docs = result.response.docs;
       
                   for(var i in docs){
                        var f = {};

                        f.geometry = JSON.parse(docs[i][self.options.geomField]);
                        f.properties = {};
                        for(var p in docs[i]){
                            if(p == self.options.geomField){
                                continue;
                            }
                            f.properties[p] = docs[i][p];
                        }
                       allFeatures.push(f);

                   }
                   //self.onFeaturesLoaded(features);
                   
                   for(var j in values){
                    var features = [];
                        for(var k in allFeatures){
                            if(allFeatures[k].properties[self.options.timeField] == values[j]){
                                features.push(allFeatures[k]);

                            }

                        }
                        self._aggregatingLayers[values[j]] = new SMC.layers.geometry.GeometryLayer(self.options);
                       
                       // self._aggregatingLayers[values[j]].options.date = self.options.timeField;
                        self._aggregatingLayers[values[j]].options.label = values[j];
                        self._aggregatingLayers[values[j]].features = features;
                        self._aggregatingLayers[values[j]].override = true;
                        self._aggregatingLayers[values[j]].addTo(self._map);
                   }
                   console.log(self._aggregatingLayers);
                   
                   
   
                }

            });
          
            
        }

});
/**
 * API factory method for ease creation of wfs features providers.
 * @params {Object} options - Options to initialize the WFS provider
 */
SMC.wfsProvider = function(options) {
    return new SMC.providers.WFSProvider(options);
};
