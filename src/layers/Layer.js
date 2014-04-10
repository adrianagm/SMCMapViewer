require("./layers.js");

/**
 * Base class for all layer types supporting data providers.
 * @class 
 * @abstract
 */
SMC.layers.Layer = L.Class.extend(
/** @lends SMC.layers.geometry.Layer# */
{

	/**
		 * Implementations of FeatureProvider must contain an override of this method, so features can be loaded from their source.
		 * @abstract
		 */
	onAdd: function() {
		throw new Error("FeaturesProvider::doFeaturesLoading must be implemented by derivate classes.");
	}
});