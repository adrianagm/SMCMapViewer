require("../layers.js");
require("../stylers/MapCssStyler.js");
require("../../../lib/paper/paper-full.js");

SMC.layers.geometry.CanvasRenderer = L.Class.extend({
	includes: SMC.Util.deepClassInclude([SMC.layers.stylers.MapCssStyler]),

	_initialized: false,

	_offset: "",
	_items: [],

	renderCanvas: function(canvas, features, map) {
		if (!this._initialized) {
			// Adds paper stuff so its accesible, don't remove.
			paper.install(window);
			this._initialized = true;


		}
		this.labels = [];

		console.time("render");

		var mypaper = new paper.PaperScope();
		mypaper.setup(canvas);

		var ctx = {
			paper: mypaper,
			map: map,
			canvas: canvas
		};
		if (map) {
			map.on("click", this._onMouseClick, this);
			map.on("mousemove", this._onMouseMove, this);
			map.on("zoomend", function() {
				this._onViewChanged(ctx, features)
			}, this);
		}


		console.time("addFeatures");
		var layer = new ctx.paper.Group();
		var f;
		for (var i = 0; i < features.length; i++) {
			f = this._addFeature(ctx, features[i]);
			this._items[i] = f.path;
		}

		//layer.position += layer._children[0]._children[0]._segments[0]._point;
		if (this._offset && this._offset !== 0) {
			this._items = this._addOffset(this._items, this._offset, ctx);
		}

		console.timeEnd("addFeatures");


		console.time("draw");

		mypaper.view.draw();

		console.timeEnd("draw");


		console.timeEnd("render");

	},

	_sendFeatures: function(features) {
		var self = this;
		$.each(features, function(index, feature) {
			self._addFeature(feature);
		});
	},

	addGeometryFromFeatures: function(features) {
		if (L.Util.isArray(features) || typeof features == "object") {
			this._sendFeatures(features);
		} else {
			this._sendFeatures(arguments);
		}
	},


	_addFeature: function(ctx, feature) {


		var geom = feature.geometry.coordinates;

		while (L.Util.isArray(geom[0][0])) {
			geom = geom[0];

		}

		var styles;
		if (feature._clean || ctx.forceStyles) {
			styles = feature._styles;
		} else {
			styles = feature._styles = this._applyStyles(feature, ctx);
		}

		if (styles.offset && styles.offset !== 0) {
			this._offset = styles.offset;
		}
		var labels = this._addLabels(feature);
		var stylePopup = this.addPopUp(feature);


		var type = feature.geometry.type;

		switch (type) {
			case 'Point':
			case 'MultiPoint':
				var point = this._createPoint(geom, ctx, feature._clean);
				var path = styles.path;
				path.position = point;
				path.properties = feature.properties;
				path.map = ctx.map;
				path.stylePopup = stylePopup;
				var item = this._createItem(path, styles, labels, ctx);
				return {
					geom: geom,
					item: item
				};

			case 'LineString':
			case 'MultiLineString':
				var path = this._createGeometry(ctx, geom, feature, styles.offset, feature._clean);
				path.stylePopup = stylePopup;
				var item = this._createItem(path, styles, labels, ctx);
				return {
					path: path,
					item: item
				};

			case 'Polygon':
			case 'MultiPolygon':
				var path = this._createGeometry(ctx, geom, feature, null, feature._clean);
				path.closed = true;
				path.stylePopup = stylePopup;
				var item = this._createItem(path, styles, labels, ctx);
				return {
					geom: geom,
					item: item
				};

		}

		feature._clean = true;

	},

	_canvasPoint: function(coords, ctx, clean) {

		// actual coords to tile 'space'
		var p;
		if (coords._projCoords && clean) {
			p = coords._projCoords;
		} else {
			p = coords._projCoords = ctx.map.project(new L.LatLng(coords[1], coords[0]));;
		}


		// var p = this._map.options.crs.latLngToPoint({
		// 	lat: coords[1],
		// 	lng: coords[0]
		// }, ctx.zoom);

		// start coords to tile 'space'
		if (!ctx) {
			ctx = {};
		}

		if (!ctx.s) {
			if (ctx.tile) {
				ctx.s = ctx.tile.multiplyBy(ctx.canvas.width);
			} else {
				//ctx.s = new L.Point(0, 0);
				ctx.s = ctx.map.getPixelBounds().min;
			}
		}


		// point to draw        
		var x = p.x - ctx.s.x;
		var y = p.y - ctx.s.y;
		return {
			x: x,
			y: y
		};
	},

	// _createPoint: function(point, ctx, clean) {
	// 	var coor = this._canvasPoint(point, ctx, clean);
	// 	return coor;
	// },

	_createGeometry: function(ctx, geom, feature, offset, clean) {
		var path; // = new ctx.paper.Path();

		var points = [];
		for (var i = 0; i < geom.length; i++) {
			points[i] = this._canvasPoint(geom[i], ctx, clean);
			// if (offset && offset !== 0){
			// 	points[i] = {
			// 		x: points[i].x + offset[0],
			// 		y: points[i].y + offset[0]
			// 	};
			// }
		}
		points = L.LineUtil.simplify(points, 3);

		if (offset && offset !== 0) {
			points = this._addOffset(points, offset, ctx);
		}


		path = new ctx.paper.Path({
			segments: points
		});
		path.properties = feature.properties;
		path.map = ctx.map;


		return path;

	},

	_onMouseClick: function(event) {
		var popup;

		var hitResult = paper.project.hitTest(event.layerPoint);

		paper.project.activeLayer.selected = false;
		if (hitResult) {
			hitResult.item.selected = true;
			popup = L.popup()
				.setLatLng(event.latlng)
				.setContent(hitResult.item.stylePopup.content)
				.openOn(hitResult.item.map);
			offset: hitResult.item.stylePopup.offset


		}

		paper.view.draw();



	},
	_onMouseMove: function(event) {
		map.style.cursor = 'default';
		var hitResult = paper.project.hitTest(event.layerPoint);
		if (hitResult) {
			map.style.cursor = 'pointer';

		}

	},

	_applyStyles: function(feature, ctx) {
		var zoom = ctx.map.getZoom();
		var style = this.applyStyle(feature, ctx, zoom);
		return style;
	},

	_addLabels: function(feature) {
		var label = this.addLabelStyle(feature);
		return label;

	},
	_createItem: function(path, styles, labels, ctx) {
		path.style = styles.pathStyle;
		path.opacity = styles.opacity;

		var item = new ctx.paper.Group();
		item.addChild(path);

		if (labels.content) {
			var pointText = new ctx.paper.PointText(path.interiorPoint);
			pointText.content = labels.content;
			pointText.style = labels.style;
			item.addChild(pointText);
		}

		return item;
	},

	_onViewChanged: function(ctx, features) {

		for (var i = 0; i < features.length; i++) {
			var f = features[i];
			f._clean = false;
			this._applyStyles(f, ctx);

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