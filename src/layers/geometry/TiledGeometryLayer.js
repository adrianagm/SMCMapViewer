require("./geometry.js");
require("../SingleLayer.js");
require("./CanvasRenderer.js");
require("../stylers/MapCssStyler.js");
require("../../../lib/canvasLayer/leaflet_canvas_layer.js");



/**
 * Base class for layers using client side rendering of tiles containing geographical features in the SCM map viewer component.
 *
 * The tiles contents will be retrieved using a data provided supporting tiling as needed to cover the viewing area.
 *
 * @class
 * @abstract
 */
SMC.layers.geometry.TiledGeometryLayer = L.TileLayer.Canvas.extend(
	/** @lends SMC.layers.geometry.TiledGeometryLayer# */
	{
    

		includes: SMC.Util.deepClassInclude([SMC.layers.SingleLayer, SMC.layers.geometry.CanvasRenderer]),

		tree: null,
		tileSize: 256,

		initialize: function(options) {
			L.Util.setOptions(this, options);
			this.on("featuresUpdated", function(event) {
				this.updateFeature(event.feature);

			});


           

			this.drawTile = function(canvas, tilePoint, zoom) {
				var ctx = {
					canvas: canvas,
					tile: tilePoint,
					zoom: this._getZoomForUrl()
				};

				 if(this.tree===null || this.lastZoom!=zoom) {
                    this.tree = rbush(9, ['.minx', '.miny', '.maxx', '.maxy']);
                    this.lastZoom = zoom;
                 }
 


				this._draw(ctx);



			};
		},



		onAdd: function(map) {
			L.TileLayer.Canvas.prototype.onAdd.call(this, map);
			SMC.layers.SingleLayer.prototype.onAdd.call(this, map);
			map.on("dragstart", function() {
				this.dragging = true;
			}, this);
			map.on("dragend", function() {
				this.dragging = false;
			}, this);

		},

		_draw: function(ctx) {


			var bounds = this._tileBounds(ctx);


			var request = this.createRequest(bounds, ctx);
			var loader = $.ajax;
			var self = this;
			loader($.extend(request, {
				success: function(response) {
                    console.log(response.features);
					self.addTiledGeometryFromFeatures(response.features, ctx);

				}
			}, this.options.request));




		},

		addTiledGeometryFromFeatures: function(features, ctx, skipTree) {
			var f;
			if (L.Util.isArray(features)) {
				f = features;
			} else if (arguments.length > 1) {
				f = arguments;
			} else {
				f = [features];
			}



			for (i = 0; i < f.length; i++) {
				var feature = f[i];

				//We store the retrieved features in a search tree.
				if (!skipTree) {
					var treeNode = this._createTreeData(feature, ctx.tile);
					this.tree.insert(treeNode);
				}
			}


			if (f.length !== 0) {

				this.renderCanvas(ctx, f, this._map);
			}


		},

		_createTreeData: function(feature, tilePoint) {

			var bbox = this._featureBBox(feature);
           

			return {
				id: feature.properties.id,
				feature: feature,
				minx: bbox.min.x,
				maxx: bbox.max.x,
				miny: bbox.min.y,
				maxy: bbox.max.y,
				tilePoint: tilePoint
			};

		},

		_featureBBox: function(feature) {
			var points = [];
             // if(feature.properties.id ==35)
             //    debugger;
			var geom = feature.geometry.coordinates;
			var type = feature.geometry.type;
			switch (type) {
				case 'Point':
				case 'LineString':
				case 'Polygon':
					points = [geom];
					break;

				case 'MultiPoint':
				case 'MultiLineString':

                    for (var j = 0; j < geom.length; j++) {
                        points = points.concat(geom[j]);
                    }

                    break;
				case 'MultiPolygon':
                    if (L.Util.isArray(geom[0])) {
                         geom = geom[0];

                     }
        
					for (var j = 0; j < geom.length; j++) {
						points = points.concat(geom[j]);
					}

					break;

				default:
					throw new Error('Unmanaged type: ' + type);
			}


			return L.bounds(points);
		},



		_tileBounds: function(ctx) {
			var nwPoint = ctx.tile.multiplyBy(this.tileSize);
			var sePoint = nwPoint.add(new L.Point(this.tileSize, this.tileSize));

			// optionally, enlarge request area.
			// with this I can draw points with coords outside this tile area,
			// but with part of the graphics actually inside this tile.
			// NOTE: that you should use this option only if you're actually drawing points!
			var buf = this.options.buffer;
			if (buf > 0) {
				var diff = new L.Point(buf, buf);
				nwPoint = nwPoint.subtract(diff);
				sePoint = sePoint.add(diff);
			}

			var nwCoord = this._map.unproject(nwPoint, ctx.zoom, true);
			var seCoord = this._map.unproject(sePoint, ctx.zoom, true);
			return [nwCoord.lng, seCoord.lat, seCoord.lng, nwCoord.lat];
		},

		updateFeature: function(feature) {
		 
            var bbox = this._featureBBox(feature);
         
            var intersectingFeatureNodes = this.tree.search([bbox.min.x,bbox.min.y,bbox.max.x,bbox.max.y]);

            // var bounds = [[bbox.min.y, bbox.min.x], [bbox.max.y,bbox.max.x]];
            // var border = new L.rectangle(bounds, {color: 'gray'}).addTo(this._map);

            // we determine the tiles to be redrawn from the features.
            var readdedTileKeys=[];
            for(var i=0; i < intersectingFeatureNodes.length; i++) {
                var featureTilePoint = intersectingFeatureNodes[i].tilePoint;

              // intersectingFeatureNodes[i].feature._item.selected = true;
                var key=featureTilePoint.x+":"+featureTilePoint.y;

                if(readdedTileKeys.indexOf(key)<0) {

                    readdedTileKeys.push(key);
                    var tile = this._tiles[key];  
                    if(this._map) { // If we removed the layer we don't want updates.
         

                        var ctx = {
                            canvas: tile,
                            tile: featureTilePoint,
                            zoom: this._getZoomForUrl() // fix for https://github.com/CloudMade/Leaflet/pull/993
                        };


                        var tileFeatures = this.tree.search(this._tileBounds(ctx));
                        
                        var updatedFeatures = [];
                        for(var j=0; j< tileFeatures.length; j++ ){
                            var existingFeature = tileFeatures[j].feature;

                            if(existingFeature.properties.cartodb_id == feature.properties.cartodb_id) {
                                // We update the data!!!!
                                for(var field in feature) {
                                    if(feature.hasOwnProperty(field)){
                                        existingFeature[field] = feature[field];    
                                    }
                                    
                                }

                                existingFeature._dirty = true;
                                existingFeature._item.selected = true;
                                this._features.push(existingFeature);
                               
                            }


                            
                            updatedFeatures.push(existingFeature);    
                        }



                        if(!this.dragging) {
                            // To prevent redraws while dragging.
                            this.addTiledGeometryFromFeatures(updatedFeatures, ctx, true);
                        } else {
                            this._map.addOneTimeEventListener("dragend", function() {
                                this.addTiledGeometryFromFeatures(updatedFeatures, ctx, true);
                            },this)
                        }
                        
                    }
                }
            }

        },

		createRequest: function(bounds, ctx) {
			// override with your code
		}

	});