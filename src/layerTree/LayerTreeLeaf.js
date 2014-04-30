require("./LayerTreeNode.js");
/**
 * Base class for layer tree controls.
 * @class
 * @mixes L.Mixin.Events
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.layertrees.LayerTreeLeaf = SMC.layertrees.LayerTreeNode.extend({
	
	options: {
		/**
         * Layer tree leaf label.
         * @property {string} label - label layer tree.
         */
        label: null,
        /**
         * True is base layer.
         * @property {boolean} label - base layer.
         */
        baseLayer: false
	},

	/**
     * Initialize the object with the params
     * @param {object} options - object with need parameters
     */
    initialize: function(options) {
        L.Util.setOptions(this, options);
    },

	/**
	 * Method to set the visibility of a tree layer.
	 * @params {Boolean} visible - Boolean param to set visibilty true or false.
	 */
	setVisible: function(visible){

	},
	/**
     * Method to create an HTML node for the name of the layer.
     * 
     */
	createNodeHTML: function(){
		
	}
});