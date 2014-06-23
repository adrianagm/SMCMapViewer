require("./geometry.js");
require("../layers.js");
require("../SingleLayer.js");
require("./CanvasRenderer.js");
require("../stylers/MapCssStyler.js");
require("../../../lib/canvasLayer/leaflet_canvas_layer.js");


// RBush inserts itself as NodeJs module so we must retrieve it this way.
var rbush = require("../../../lib/rbush.js");



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
        options : {
            tileSize: 256,
        },

        includes: SMC.Util.deepClassInclude([SMC.layers.SingleLayer, SMC.layers.geometry.CanvasRenderer]),

       globalTree: null,
       features :[],
       tilesLoad : 1,
       tilesToLoad: null,
      
        

        initialize: function(options) {
            L.Util.setOptions(this, options);
            L.TileLayer.Canvas.prototype.initialize.call(this, options);
            

           
            
            this.drawTile = function(canvas, tilePoint, zoom) {
                var ctx = {
                    canvas: canvas,
                    tile: tilePoint,
                    zoom: this._getZoomForUrl()
                };

                if (this.globalTree === null || this.lastZoom != zoom) {
                    this.globalTree = rbush(9, ['.minx', '.miny', '.maxx', '.maxy']);
                    this.lastZoom = zoom;
                   
                }

                ctx.canvas.tree = null;

                if (ctx.canvas.tree === null || this.lastZoom != zoom) {
                    ctx.canvas.tree = rbush(9, ['.minx', '.miny', '.maxx', '.maxy']);
                    this.lastZoom = zoom;
                }

                this._draw(ctx);
                if(this.tilesToLoad == null){
                    this.tilesToLoad = this._tilesToLoad;
                }
            };

          

        },

        load: function() {
 
        },

        loadTile: function() {
             throw new Error("TiledGeometrylayer::loadTile must be implemented by derivate classes.");
        },


        onAdd: function(map) {
            L.TileLayer.Canvas.prototype.onAdd.call(this, map);
            SMC.layers.SingleLayer.prototype.onAdd.call(this, map);

           
           
        },

        _draw: function(ctx) {


            var bounds = this._tileBounds(ctx);


            // var request = this.createRequest(bounds, ctx);
            // var loader = $.ajax;
             var self = this;
            // loader($.extend(request, {
            //     success: function(response) {
            //         console.log(response.features);
            //         self.addTiledGeometryFromFeatures(response.features, ctx);

            //     }
            // }, this.options.request));

            this.loadTile(bounds).then(function(featuresCollection) {
                 console.log(featuresCollection.features);
                 self.addTiledGeometryFromFeatures(featuresCollection.features, ctx);
            });
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
                this. _setProperties(feature);
               
                

                //We store the retrieved features in a search tree.
                if (!skipTree) {
                    var treeNode = this._createTreeData(feature, ctx.tile);
                    ctx.canvas.tree.insert(treeNode);
                    this.globalTree.insert(treeNode);
                    
                }
            }


            if (f.length !== 0) {

                this.renderCanvas(ctx, f, this._map);
            }
            this.tilesLoad++;
            if(this.tilesLoad == this.tilesToLoad){
                 SMC.layers.geometry.CanvasRenderer.prototype.initialize.call(this, this.options); 
            }


        },

        _setProperties: function(feature){
                var id = this.options.featureID;
                if (feature.hasOwnProperty(id)){
                    feature.id = feature[id];
                }
                else{

                    for (var propKey in feature) {  
                       if (feature[propKey].hasOwnProperty(id)){
                            feature.id = feature[propKey][id];
                       }
                    } 
                        
                }


                if(this.features.length == 0){  
                    this.features.push(feature);
                   
                }
                else{
                    var sameFeature = false;
                    for(var j = 0; j < this.features.length; j++){
                        if(feature.id  == this.features[j].id){
                             feature.id = this.features[j].id;
                             feature.selected = this.features[j].selected;
                             feature.properties = this.features[j].properties;
                             sameFeature = true;
                             break; 
                        }

                    }

                    if(!sameFeature){
                        this.features.push(feature);
                    }
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
            var nwPoint = ctx.tile.multiplyBy(this.options.tileSize);
            var sePoint = nwPoint.add(new L.Point(this.options.tileSize, this.options.tileSize));

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

             for (var k = 0; k < this.features.length; k++){
                if(feature.id == this.features[k].id){
                    if(feature.selected !== undefined){
                         this.features[k].selected = feature.selected;
                    }
                     this.features[k].properties = feature.properties;
                     break;
                }
            }

            var bbox = this._featureBBox(feature);

            var intersectingFeatureNodes = this.globalTree.search([bbox.min.x, bbox.min.y, bbox.max.x, bbox.max.y]);


            // we determine the tiles to be redrawn from the features.
            var readdedTileKeys = [];
            
            for (var i = 0; i < intersectingFeatureNodes.length; i++) {
                var featureTilePoint = intersectingFeatureNodes[i].tilePoint;
               
            
                var key = featureTilePoint.x + ":" + featureTilePoint.y;

                if (readdedTileKeys.indexOf(key) < 0) {

                    readdedTileKeys.push(key);
                    var tile = this._tiles[key];
                    if (this._map) { // If we removed the layer we don't want updates.


                        var ctx = {
                            canvas: tile,
                            tile: featureTilePoint,
                            zoom: this._map.getZoom() // fix for https://github.com/CloudMade/Leaflet/pull/993
                        };


                        var tileFeatures = ctx.canvas.tree.search(this._tileBounds(ctx));

                        var updatedFeatures = [];
                        
                        for (var j = 0; j < tileFeatures.length; j++) {
                            var existingFeature = tileFeatures[j].feature;
                            

                            if (existingFeature.id == feature.id) {
                                // We update the data!!!!

                                existingFeature.properties = feature.properties;
                                if(feature.selected != undefined){
                                    existingFeature.selected = feature.selected;
                                }
                                existingFeature._clean = false;


                            }



                            updatedFeatures.push(existingFeature);

                        }


                       this.renderCanvas(ctx, updatedFeatures, this._map); 
                       

                    }

                }
            }


        },

        createRequest: function(bounds, ctx) {
            // override with your code
        }

    });
