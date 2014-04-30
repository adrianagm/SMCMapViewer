require("./LayerTreeNode.js");
require("../LayerLoader.js");
/**
 * Base class for make a layer tree folder.
 * @class
 * @mixes L.Mixin.Events
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.layertrees.LayerTreeFolder = SMC.layertrees.LayerTreeNode.extend({

    includes: SMC.Util.deepClassInclude([SMC.LayerLoader]),

    options: {
        /**
         * Layer tree leaf label.
         * @property {string} label - label layer tree.
         */
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
     * Implementations of LayerTreeNode must contain an override of this method, so HTML nodes can be loaded from their source.
     * @abstract
     */
    createNodeHTML: function() {
        throw new Error("LayerTreeNode::createNodeHTML must be implemented by derivate classes.");
    }
});