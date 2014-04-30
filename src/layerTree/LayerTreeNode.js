require("./LayerTreeControl.js");
/**
 * Base class for layer tree controls.
 * @class
 * @mixes L.Mixin.Events
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.layertrees.LayerTreeNode = SMC.layertrees.LayerTreeControl.extend({
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
    }
});