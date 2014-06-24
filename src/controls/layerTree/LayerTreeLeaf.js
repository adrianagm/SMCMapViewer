require('./layerTree.js');
require("./LayerTreeNode.js");
/**
 * Base class for layer tree controls.
 * @class
 * @extends SMC.controls.layerTree.LayerTreeNode
 * @param {SMC.controls.layerTree.LayerTreeLeaf~options} options - The configuration for the class
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.controls.layerTree.LayerTreeLeaf = SMC.controls.layerTree.LayerTreeNode.extend(
    /** @lends SMC.controls.layerTree.LayerTreeLeaf# */
    {
        /**
         * @typedef {Object} SMC.controls.layerTree.LayerTreeLeaf~options
         * @property {string} label=null - label layer tree
         * @property {boolean} baseLayer=false - base layer
         */
        options: {
            label: null,
            baseLayer: false
        },

        /**
         * Initialize the object with the params
         * @param {object} options - default options
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
    }
);
