require("./GeometryLayer.js");
require("../../providers/SolrHistoryProvider.js");


/**
 * Base class for layers using a WFS provider to get the features
 *
 * @class
 * @abstract
 * @extends SMC.layers.geometry.GeometryLayer
 * @mixes SMC.providers.WFSProvider
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.geometry.SolrGeometryHistoryLayer = SMC.layers.geometry.GeometryLayer.extend(
    /** @lends SMC.layers.geometry.WFSGeometryLayer# */
    {
        _historyLayers: {},
        _timer: null,
        _node: null,

        /**
         * Initialize the object with the params
         * @param {object} options - object with need parameters
         */
        initialize: function(options) {
           
            SMC.layers.geometry.GeometryLayer.prototype.initialize.call(this, options);
            SMC.providers.SolrHistoryProvider.prototype.initialize.call(this, options);

            //SMC.layers.history.DataHistoryLayer.prototype.initialize.call(this, arguments);
            
          // L.LayerGroup.prototype.initialize.call(this, options);
            L.Util.setOptions(this, options);
            this.setZIndex(1000);
        },


        /**
         * Method to load the features
         */
        load: function() {
           

        },
       /*addTo: function(map){
          
            map.off('layeradd');
            
        },*/


        createNodeHTML: function(){
            return SMC.layers.history.DataHistoryLayer.prototype.createNodeHTML.call(this, this.options);

        },
     

        getMap: function() {
            var map = this._map;
            return map;

        },

        _orderLayers: function() {
            return SMC.layers.history.DataHistoryLayer.prototype._orderLayers.call(this, this.options);

        },

        showTimeData: function(time) {
             SMC.layers.history.DataHistoryLayer.prototype.showTimeData.call(this, time);
        },

        _addTimeData: function(time) {
         SMC.layers.history.DataHistoryLayer.prototype._addTimeData.call(this, time);

        },

        _showLabel: function(sliderControlLabel) {
           SMC.layers.history.DataHistoryLayer.prototype._showLabel.call(this, sliderControlLabel);
        },

        _clickOnLayer: function(node) {
           SMC.layers.history.DataHistoryLayer.prototype._clickOnLayer.call(this, node);

        },

        _onPlayPause: function(node, time) {
           SMC.layers.history.DataHistoryLayer.prototype._onPlayPause.call(this, node, time);
        },

        onAdd: function(map) {
            SMC.layers.geometry.GeometryLayer.prototype.onAdd.call(this, map);
            SMC.layers.history.DataHistoryLayer.prototype.onAdd.call(this, map);
        },

        onRemove: function(map) {
            SMC.layers.geometry.GeometryLayer.prototype.onRemove.call(this, map);
             SMC.layers.history.DataHistoryLayer.prototype.onRemove.call(this, map);
        }



       
        
    }, [SMC.providers.SolrHistoryProvider]);

/**
 * API factory method for easy creation of wfs geometry layer.
 * @params {Object} options - Options to initialize the WFS 
 */
SMC.solrGeometryHistoryLayer = function(options) {
    return new SMC.layers.geometry.SolrGeometryHistoryLayer(options);
};