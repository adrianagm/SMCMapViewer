require("./layers.js");
require("../layerTree/LayerTreeLeaf.js");

/**
 * Base class for all layer types supporting data providers.
 * @class 
 * @abstract
 */
SMC.layers.Layer = L.Class.extend(
/** @lends SMC.layers.geometry.Layer# */
{

	includes: SMC.Util.deepClassInclude([SMC.layertrees.LayerTreeLeaf]),

	initialize: function(options){
		SMC.layertrees.LayerTreeLeaf.prototype.initialize.call(this, options);
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
	 * @params {Boolean} visible - Boolean param to set visibilty true or false.
	 */
	setVisible: function(visible){

	}
});