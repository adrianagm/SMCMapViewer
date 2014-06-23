
require("../stylers/MapCssStyler.js");

var paper = require("../../../lib/paper/dist/paper-full.js").exports;

SMC.layers.geometry.CanvasRenderer = L.Class.extend({
    includes: SMC.Util.deepClassInclude([SMC.layers.stylers.MapCssStyler]),

    
    

    options: {
        draggingUpdates: true
    },
    
    initialize: function(options) {
        L.Util.setOptions(this, options);
        this.fireEvent('layerLoad', {
            features: this.features
        });

    },

    renderCanvas: function(ctx, features, map) {

        this._init(ctx, map);
        ctx.canvas.zBuffer = [];

        if (!this.options.draggingUpdates && this.dragging) {
            // We don't draw while dragging, as it eats A LOT of CPU.
            return;
        }

        ctx.features = features;

        this.labels = [];
        var canvas = ctx.canvas;

        var mypaper;
        if (!canvas._paper) {
            mypaper = new paper.PaperScope();
            mypaper.setup(canvas);
            canvas._paper = mypaper;
            canvas._map = map;

        }

        mypaper = canvas._paper;

        if (canvas._initialized) {
            mypaper.activate();
            mypaper.project.activeLayer.removeChildren();
        }

        var canvasLabel;
        if (ctx.tile) {
            canvasLabel = "(" + ctx.tile.x + " , " + ctx.tile.y + ")";
        } else {
            canvasLabel = mypaper._id;
        }

        console.time("render " + canvasLabel);



        if (ctx.tile) {
            ctx.canvas._s = ctx.tile.multiplyBy(ctx.canvas.width);

        } else {
            //ctx.canvas._s = new L.Point(0, 0);
            ctx.canvas._s = ctx.canvas._map.getPixelBounds().min;
        }

        console.time("applyStyles " + canvasLabel);

       
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];

            var styles;
            if (feature._clean && !ctx.forceStyles) {
                styles = feature._styles;
            } else {
                styles = feature._styles = this._applyStyles(feature, ctx);

            }

            ctx.canvas.zBuffer.push({
                style: styles,
                zIndex: styles.zIndex,
                feature: feature
            });
        }

        console.timeEnd("applyStyles " + canvasLabel);

        ctx.canvas.zBuffer.sort(function(f1, f2) {
            return f1.zIndex - f2.zIndex;
        });


        console.time("addFeatures " + canvasLabel);
        var layer = new mypaper.Group();

       

        for (i = 0; i < ctx.canvas.zBuffer.length; i++) {

            var item = this._addFeature(ctx, ctx.canvas.zBuffer[i]);
            layer.addChild(item);

            if(ctx.canvas.zBuffer[i].feature.selected){
                item.selected = true;
            }

        }

        console.timeEnd("addFeatures " + canvasLabel);

        console.time("translate " + canvasLabel);

        layer.applyMatrix = false;
        //layer.transform(new paper.Matrix(1,0,0,1,-ctx.canvas._s.x, -ctx.canvas._s.y));
        layer.translate(new paper.Point(-ctx.canvas._s.x, -ctx.canvas._s.y));


        //canvas._lastTransform = ctx;

        console.timeEnd("translate " + canvasLabel);

        console.time("draw " + canvasLabel);



        // Visual debug info:
        var text = new mypaper.PointText({
            point: [5, 10],
            content: canvasLabel,
            fillColor: 'red',
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            fontSize: 10
        });

        var border = new mypaper.Path.Rectangle(0, 0, canvas.clientWidth, canvas.clientHeight);
        border.style.strokeColor = "gray";

        mypaper.view.draw();

        console.timeEnd("draw " + canvasLabel);

        console.timeEnd("render " + canvasLabel);


        return layer;

    },

    _init: function(ctx, map) {

        if (ctx.canvas._initialized) {
            console.debug("skiped init");
            return;
        }

        ctx.canvas._initialized = true;

        ctx.canvas.zBuffer = [];

        var onMouseMove = function(event) {
            console.debug("moving!");
            this._onMouseMove(ctx, event);
        };

        map.on("click", function(event) {
            this._onMouseClick(ctx, event);
        }, this);


        console.debug("enabling move");
        map.on("mousemove", onMouseMove, this);

        map.on("zoomend", function() {
            this._onViewChanged(ctx);
        }, this);


        // We suspend the mouseMove listenter when dragging, as this makes a dramatic performance improvement.
        map.on("dragstart", function() {
            this.dragging = true;
            console.debug("moving disabled!");
            map.off("mousemove", onMouseMove, this);
        }, this);

        map.on("dragend", function() {
            this.dragging = false;
           // this._onViewChanged(ctx);
            console.debug("moving renabled!");
            map.on("mousemove", onMouseMove, this);

            if (!this.options.draggingUpdates) {
                this.renderCanvas(ctx, ctx.features, ctx.canvas._map);
            }

        }, this);

       

    },


    _addFeature: function(ctx, elem) {
        var feature = elem.feature;

        if (feature._clean) {
            return feature._item;
        }

        var styles = elem.style;

        var geom = feature.geometry.coordinates;

        while (L.Util.isArray(geom[0][0])) {
            geom = geom[0];

        }

        var labels = this._addLabels(feature, ctx);
        var stylePopup = this._addPopUp(feature, ctx);


        var type = feature.geometry.type;

        var item, path;
        switch (type) {
            case 'Point':
            case 'MultiPoint':

                var point = this._canvasPoint(geom, ctx, feature._clean);
                styles.path.position = point;
                path = styles.path;

                break;

            case 'LineString':
            case 'MultiLineString':

                path = this._createGeometry(ctx, geom, feature, styles.offset, feature._clean);
                break;

            case 'Polygon':
            case 'MultiPolygon':

                path = this._createGeometry(ctx, geom, feature, null, feature._clean);
                path.closed = true;

                break;

        }


        feature._clean = true; 
        path._feature = feature;
        item = this._createItem(path, styles, labels, stylePopup, ctx);
        feature._item = item;
        return item;

    },

    _getCtxId: function(ctx) {

        if (ctx.id) {
            return ctx.id;
        }



        if (ctx.tile) {
            ctx.id = ctx.tile.x + ":" + ctx.tile.y;
        } else {
            ctx.id = "ctx"; // Just one ctx anyway so any id should work.
        }

        return ctx.id;
    },

    _canvasPoint: function(coords, ctx, clean) {

        // actual coords to tile 'space'
        var p;
        var zoom = ctx.zoom;
        if (coords._projCoords && clean) {
            p = coords._projCoords;
        } else {
            p = coords._projCoords = ctx.canvas._map.project(new L.LatLng(coords[1], coords[0]), zoom);
        }


       
        return {
            x: p.x,
            y: p.y
        };
    },



    _createGeometry: function(ctx, geom, feature, offset, clean) {
        var path; // = new ctx.paper.Path();

        var points = [];
        for (var i = 0; i < geom.length; i++) {
            points[i] = this._canvasPoint(geom[i], ctx, clean);

        }
        points = L.LineUtil.simplify(points, 3);

        if (offset && offset !== 0) {
            points = this._addOffset(points, offset, ctx);
        }

        path = new ctx.canvas._paper.Path({
            segments: points
        });

        return path;

    },


    _applyStyles: function(feature, ctx) {
        var zoom = ctx.canvas._map.getZoom();
        var style = this.applyStyle(feature, ctx, zoom);
        return style;
    },

    _addLabels: function(feature, ctx) {
        var zoom = ctx.canvas._map.getZoom();
        var label = this.addLabelStyle(feature, zoom);
        return label;

    },

    _addPopUp: function(feature, ctx) {
        var zoom = ctx.canvas._map.getZoom();
        var popUpStyle = this.addPopUp(feature, zoom);
        return popUpStyle;
    },

    _createItem: function(path, styles, labels, stylePopup, ctx) {

        path.style = styles.pathStyle;
        path.opacity = styles.opacity;
        path.visible = styles.visible;
        if (typeof styles.visible === "undefined") {
            path.visible = true;
        }
        path._feature.stylePopup = stylePopup;


        var item = new ctx.canvas._paper.Group();
        item.addChild(path);
        item.zIndex = styles.zIndex;

        if (labels.content && path.visible) {
            var pointText = new ctx.canvas._paper.PointText(path.interiorPoint);
            pointText.content = labels.content;
            pointText.style = labels.style;
            item.addChild(pointText);
        }

        return item;
    },

    _onMouseClick: function(ctx, event) {
  
        var popup;
        var hitResult = this._hitTest(ctx, event);

        if (hitResult && hitResult.item._class == 'Path') {
            event._hit = hitResult;

            this.fireEvent("featureClick",{
                feature: hitResult.item._feature,
                event: event,
                
            });

 
            this.updateFeature(hitResult.item._feature);
            var stylePopup = this._addPopUp(hitResult.item._feature, ctx);

            if(stylePopup.content != null){
            
                popup = L.popup({
                    offset: stylePopup.offset
                })
                    .setLatLng(event.latlng)
                    .setContent(stylePopup.content)
                    .openOn(ctx.canvas._map);
            } 


        }

    },

    _onMouseMove: function(ctx, event) {

        var hitResult = this._hitTest(ctx, event);

        if (hitResult && hitResult.item._class == 'Path') {
            event._hit = hitResult;
        }

        ctx.canvas._map.getContainer().style.cursor = event._hit ? 'pointer ' : '';
    },


    _hitTest: function(ctx, event) {

        if (event._hit) {
            return;
        }

        console.time("hitTest");
        var cPoint = this._canvasPoint([event.latlng.lng, event.latlng.lat], ctx);

        var s = ctx.canvas._map.getPixelBounds().min;


        cPoint.x -= ctx.canvas._s.x;
        cPoint.y -= ctx.canvas._s.y;
        var fill = true;
        // for(var i = 0; i < ctx.features.length; i++){
        //     if(ctx.features[i].geometry.type == 'LineString' || ctx.features[i].geometry.type == 'MultiLineString'){
        //         fill = false;
        //         break;
        //     }
        // }

        var options = {
            tolerance: 5,
            fill: false,
            stroke:true
        }
       

        var hitResult = ctx.canvas._paper.project.hitTest(cPoint, options);
        console.timeEnd("hitTest");
       
        return hitResult;
    },

    _onViewChanged: function(ctx) {
        for (var i = 0; i < ctx.features.length; i++) {
            var f = ctx.features[i];
            f._clean = false;
        }
    },

    _addOffset: function(proj, offset, ctx) {
        var points = [];
        for (var j = 0; j < proj.length; j++) {
            var p = proj[j];

            p.lat = p.x;
            p.lng = p.y;

            if (j === 0) {
                nextPoint = proj[j + 1];
                normal = this._calculateNormal(p, nextPoint);
                p.x = p.x + offset * normal.x;
                p.y = p.y + offset * normal.y;
            } else if (j == proj.length - 1) {
                prevPoint = proj[j - 1];
                normal = this._calculateNormal(prevPoint, p);
                p.x = p.x + offset * normal.x;
                p.y = p.y + offset * normal.y;
            } else {

                prevPoint = proj[j - 1];
                normal0 = this._calculateNormal(prevPoint, p);

                var x1 = prevPoint.x + offset * normal0.x;
                var y1 = prevPoint.y + offset * normal0.y;

                var x2 = p.x + offset * normal0.x;
                var y2 = p.y + offset * normal0.y;

                nextPoint = nextPoint = proj[j + 1];
                normal1 = this._calculateNormal(p, nextPoint);
                var x3 = p.x + offset * normal1.x;
                var y3 = p.y + offset * normal1.y;

                var x4 = nextPoint.x + offset * normal1.x;
                var y4 = nextPoint.y + offset * normal1.y;


                var d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

                if (d < 0.000000000001) {
                    // Very small denominators make the calculation go crazy.
                    p.x = p.x + offset * normal.x;
                    p.y = p.y + offset * normal.y;
                } else {

                    var n1 = (x1 * y2 - y1 * x2);
                    var n2 = (x3 * y4 - y3 * x4);

                    p.x = (n1 * (x3 - x4) - (x1 - x2) * n2) / d;
                    p.y = (n1 * (y3 - y4) - (y1 - y2) * n2) / d;

                }
            }
            proj[j] = {
                x: p.lat,
                y: p.lng
            };
            points[j] = {
                x: p.x,
                y: p.y
            };


        }


        return points;
    },

    _calculateNormal: function(p0, p1) {

        var ry = p1.y - p0.y;
        var rx = p1.x - p0.x;

        var d = Math.sqrt(rx * rx + ry * ry);

        return {
            x: -ry / d,
            y: rx / d
        };

    },


});
