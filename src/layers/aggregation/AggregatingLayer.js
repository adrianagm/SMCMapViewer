/**
 * Class formed by the aggregation of several layers.
 *
 * @class
 * @extends SMC.layers.Layer
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.aggregation.AggregatingLayer = SMC.layers.Layer.extend(
	/** @lends SMC.layers.aggregation.AggregatingLayer# */
	{

		_layers: {},

		/**
		 * Adds a sublayer to the layer.
		 * @param {string} layerId - Layer Identifier
		 * @param {SMC.layers} layer - Layer object
		 */
		addLayer: function(layerId, layer) {
			throw new Error("Unimplemented method!");
		}

	});
