require('./layerTree.js');
require("./LayerTreeControl.js");
/**
 * Base class for layer tree controls.
 * @class
 * @extends L.Class
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.controls.layerTree.LayerTreeNode = L.Class.extend({

    visible: true,

    /**
     * Initialize the object with the params
     * @param {object} options - object with need parameters
     */
    initialize: function(options) {
        L.Util.setOptions(this, options);
    },

    /**
     * Implementations of LayerTreeNode must contain an override of this method, so HTML nodes can be loaded from their source.
     * @abstract
     */
    createNodeHTML: function() {
        throw new Error("LayerTreeNode::createNodeHTML must be implemented by derivate classes.");
    },


    isVisible: function() {
        return visible;
    },

    /**
     * Method to set the visibility of a tree node.
     * @params {Boolean} visible - Boolean param to set visibilty true or false.
     */
    setVisible: function(visible) {
        visible = visible;
        // TODO: Handle visibility change.
    }
});
