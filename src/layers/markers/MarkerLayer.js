require("./markers.js");
require("../SingleLayer.js");
require("../stylers/MarkerCssStyler.js");

require("../../../lib/leaflet.markercluster/dist/leaflet.markercluster.js");
require("../../../lib/LeafletHtmlIcon.js");


/**
 * Base layer for all SMC map viewer's layers rendered using markers.
 * @class
 * @abstract
 * @mixes SMC.layers.SingleLayer
 */
SMC.layers.markers.MarkerLayer = L.MarkerClusterGroup.extend(
	/** @lends SMC.layers.markers.MarkerLayer# */
	{
		includes: [SMC.layers.SingleLayer, SMC.layers.stylers.MarkerCssStyler],

		STYLER: new SMC.layers.stylers.MarkerCssStyler(),

		onAdd: function(map) {
			L.MarkerClusterGroup.prototype.onAdd.call(this, map);
			if (map) {
				map.on("zoomend", this._onViewChanged, this);
			}
		},

		addMarkerFromFeature: function(features) {
			for (var i = 0; i < arguments.length; i++) {
				this._addMarker(arguments[i]);

			}
		},

		_addMarker: function(f) {

			var markerLocation = new L.LatLng(f.geometry.coordinates[0], f.geometry.coordinates[1]);

			var marker = new L.Marker(markerLocation);
			// We store this here so is avalaible later, on restylings because of zoom changes.
			marker.properties = f.properties;

			this._applyStyles(marker);

			this.addLayer(marker);

			//marker.bindPopup(f.properties.name);
			var content = this.STYLER.addPopUp(marker);
			if (content) {
				marker.bindPopup(content);
			}

			marker.on("click", function() {
				this.onFeatureClicked(f);
			}, this);
		},

		onFeatureClicked: function(feature) {
			this.fireEvent("featureClick", feature);
			//alert(feature.properties.name);
		},

		_applyStyles: function(marker) {
			var zoom = this._map.getZoom();
			var style = this.STYLER.applyStyle(marker.properties, zoom);
			if (style.icon) {
				marker.setIcon(style.icon);
			}
			// L.setOptions(this,{
			// 	disableClusteringAtZoom: style.disableClustering?1:null
			// });
		},

		_onViewChanged: function() {
			var markers = this.getLayers();
			for (var i = 0; i < markers.length; i++) {
				var marker = markers[i];
				this._applyStyles(marker);
			}
		}



	});