require('./layerTree.js');
require("./LayerTreeNode.js");
/**
 * Base class for layer tree controls.
 * @class
 * @extends SMC.controls.layerTree.LayerTreeNode
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.controls.layerTree.LayerTreeLeaf = SMC.controls.layerTree.LayerTreeNode.extend({

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
     * Method to create an HTML node for the name of the layer.
     *
     * Unless overriden by inheriting classes, it returns the layer's label.
     * @returns {String} HTML code representing the code to be added to the layer's entry in the layer tree.
     */
    createNodeHTML: function() {
        return this.options.label;
    }
});
