require("./geometry.js");
require("../SingleLayer.js");
require("./CanvasRenderer.js");
require("../stylers/MapCssStyler.js");
require("../../../lib/canvasLayer/leaflet_canvas_layer.js");


/**
 * Base class for layers using client side rendering of geographical features in the SCM map viewer component.
 * @class
 * @abstract
 * @extends SMC.layers.SingleLayer
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.geometry.GeometryLayer = L.CanvasLayer.extend(
	/** @lends SMC.layers.geometry.GeometryLayer# */
	{
		includes: SMC.Util.deepClassInclude([SMC.layers.SingleLayer, SMC.layers.geometry.CanvasRenderer]),

		features: [],


		initialize: function() {
			L.CanvasLayer.prototype.initialize.apply(this, arguments);
		},

		onAdd: function(map) {
			L.CanvasLayer.prototype.onAdd.call(this, map);
			SMC.layers.SingleLayer.prototype.onAdd.call(this, map);
			//this.render();
		},

		render: function() {
			var canvas = this.getCanvas();


			if (this.features.length !== 0) {
				this.renderCanvas({
					canvas: canvas
				}, this.features, this._map);
			}
		},

		addGeometryFromFeatures: function(features) {

			if (L.Util.isArray(features)) {
				this.features = features;
			} else if (arguments.length > 1) {
				this.features = arguments;
			} else {
				this.features = [features];
			}
		},



	});
