require("./URLFeatureProvider.js");


/**
 * Base class to create a Solr provider
 * @class
 * @extends SMC.providers.URLFeatureProvider
 * @mixes L.Mixin.Events
 * @param {SMC.providers.SolrHistoryProvider~options} options - The configuration for the class
 *
 */
SMC.providers.SolrHistoryProvider = SMC.providers.URLFeatureProvider.extend(
    /** @lends SMC.providers.SolrHistoryProvider# */
    {
        _featuresForLayer: {},
        features: [],
       /**
        * @typedef {Object} SMC.providers.SolrHistoryProvider~options
        * @property {SMC.providers.SolrHistoryProvider~requestParams} requestParams - Default solr request parameters
        * @property {string} serverURL=null - The solr server url path parameter
        * @property {string} timeField='time' - The field for define history layers
        * @property {string} geomField='location' - The geometry field 
        * @property {string} time=500 - Time for slider in milliseconds 
        */
        options: {
            /** @typedef {Object} SMC.providers.SolrHistoryProvider~requestParams - Default solr request parameters
             * @property {string} q="*:*" - Main query for the request
             * @property {string} fq=null - Filter query that will be used to restrict the set of documents that will be returned
             * @property {string} sort=null - Order for the returned documents
             * @property {string} fl=null - Parameter for to specify a set of fields to return
             * @property {string} df=null - Parameter that override the default field defined in Solr schema xml
             * @property {string} rows=null - Parameter for specify the maximun number of documents returned
             * @property {string} wt='json' - Default solr output format parameter
             * @property {string} indent=true - Default indenting the response      
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
            geomField: 'location',
            time: 500
            
            
        },
        /**
         * Initialize the class with options parameter
         * @param {object} options - default options
         */
        initialize: function(options) {
            L.Util.setOptions(this, options);
        },
        /**
         * Send Solr request to get the group layers
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
         * @returns {object} Object with the Solr params to send
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
        /**
         * Send Solr request to get the features
         */
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

                   
                   for(var j in values){
                    var features = [];
                        for(var k in allFeatures){
                            if(allFeatures[k].properties[self.options.timeField] == values[j]){
                                features.push(allFeatures[k]);

                            }

                        }

                        self._featuresForLayer[values[j]] = features;
                       
                   }
                   console.log(self._featuresForLayer);
                   //override tree node for layer
                   var node = document.getElementById('node_'+self._leaflet_id);
                   if(node){
                     node.parentNode.appendChild(self.createNodeHTML());
                     node.parentNode.removeChild(node);
                   }
   
                }

            });
          
            
        }

});
/**
 * API factory method for ease creation of Solr features providers.
 * @params {Object} options - Options to initialize the Solr provider
 */
SMC.wfsProvider = function(options) {
    return new SMC.providers.WFSProvider(options);
};
