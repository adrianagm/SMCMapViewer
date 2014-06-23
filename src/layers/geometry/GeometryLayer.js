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
		

		initialize: function(options){
			L.CanvasLayer.prototype.initialize.apply(this, arguments);
			L.Util.setOptions(this, options);
			
		},

		onAdd: function(map) {
			L.CanvasLayer.prototype.onAdd.call(this, map);
			SMC.layers.SingleLayer.prototype.onAdd.call(this, map);
			//this.render();

			 map.on("popupopen", function(event){
			 	var d = event.target._panAnim;
			 	if(d && map._autopan){
			 		L.DomUtil.setPosition(this._canvas, { x: -d._newPos.x, y: -d._newPos.y });
			 		map._autopan = false;
			 	}


			 }, this);

		

			map.on("autopanstart", function(){
				map._autopan = true;
			}, this);

			
			 map.on("resize", function(event){
                var d = event.target.dragging._draggable._element._leaflet_pos;
                if(d){
			 		L.DomUtil.setPosition(this._canvas, { x: -d.x, y: -d.y });
			 	}
            }, this);



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
			var id = this.options.id;
			
			if (L.Util.isArray(features)) {
				this.features = features;
			} else if (arguments.length > 1) {
				this.features = arguments;
			} else {
				this.features = [features];
			}

			for(var i = 0; i < this.features.length; i++){
				var feature = this.features[i];
				if (feature.hasOwnProperty(id))
					feature.id = feature[id];
				else{

					for (var propKey in feature) {  
                       if (feature[propKey].hasOwnProperty(id)){
                       		feature.id = feature[propKey][id];
                       }
                    } 
				
				}
			}
			this.render();
		},

		updateFeature: function(feature){
			for (var i = 0; i < this.features.length; i++){
				if(this.features[i].id == feature.id){
					feature._clean = false;
					this.features[i] = feature;
				}
			}
			this.render();
			
		}


	});

	});