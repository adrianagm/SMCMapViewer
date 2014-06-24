require("./LayerTreeNode.js");
/**
 * Base class for make a layer tree folder.
 * @class
 * @extends SMC.controls.layerTree.LayerTreeNode
 * @param {object} options - Object with initialized parameters
 * @mixin
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.controls.layerTree.LayerTreeFolder = SMC.controls.layerTree.LayerTreeNode.extend(
    /** @lends SMC.controls.layerTree.LayerTreeFolder# */
    {
        /**
         * Options property
         * @property {string} options.label - label layer tree
         */
        options: {
            label: null
        },
        /**
         * Initialize the object with the params
         * @param {object} options - object with need parameters
         */
        initialize: function(options) {
            L.Util.setOptions(this, options);
        },
        /**
         * Method to create a node html that represents the layer label
         * @returns {string} String that represents the label layer
         */
        createNodeHTML: function() {
            return this.options.label;
        }
    }
);
