require("./aggregation.js");
require("../../controls/layerTree/LayerTreeFolder.js");
require("../../LayerLoader.js");

/**
 * Class formed by the aggregation of several layers.
 *
 * @class
 * @extends SMC.layers.Layer
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.aggregation.AggregatingLayer = L.LayerGroup.extend(
	/** @lends SMC.layers.aggregation.AggregatingLayer# */
	{

		includes: SMC.Util.deepClassInclude([SMC.LayerLoader]),

		_aggregatingLayers: {},

		initialize: function(options) {
			L.LayerGroup.prototype.initialize.apply(this, options);
			this._aggregatingLayers= {};
		},

		/**
		 * Adds a sublayer to the layer.
		 * @param {string} layerId - Layer Identifier
		 * @param {SMC.layers} layer - Layer object
		 */
		addLayer: function(layerId, layer) {

			if (layerId.layersConfig) {
				// We use the LayerLoader functionality.
				this.loadLayers(layerId.layersConfig);
			} else if (typeof layerId === "object") {
				console.log(layerId.options.typeName);
				this._aggregatingLayers[layerId.options.label || layerId.options.typeName] = layerId;
				
			}

		},

		onAdd: function(map) {
			L.LayerGroup.prototype.onAdd.call(this, map);
		},

		onRemove: function(map){
			L.LayerGroup.prototype.onRemove.call(this, map);
		},

		

	});