require("./layers.js");
require("../controls/layerTree/LayerTreeLeaf.js");

/**
 * Base class for all layer types supporting data providers.
 * @class
 * @abstract
 * @extends L.Class
 * @mixes SMC.controls.layerTree.LayerTreeLeaf
 */
SMC.layers.Layer = L.Class.extend(
    /** @lends SMC.layers.Layer# */
    {
        visible: true,


        /**
         * Initialize the class with options parameter
         * @param {object} options - default options
         */
        initialize: function(options) {
            SMC.controls.layerTree.LayerTreeLeaf.prototype.initialize.call(this, options);
        },

        /**
         * Implementations of FeatureProvider must contain an override of this method, so features can be loaded from their source.
         * @abstract
         */
        onAdd: function() {
            throw new Error("FeaturesProvider::doFeaturesLoading must be implemented by derivate classes.");
        },

        /**
         * Method to set the visibility of a tree layer.
         * @param {Boolean} visible - Boolean param to set visibilty true or false.
         */
        setVisible: function(visible) {
             this.visible = visible;
        }
    }, [SMC.controls.layerTree.LayerTreeLeaf]);
