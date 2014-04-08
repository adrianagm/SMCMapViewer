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
SMC.layers.markers.MarkerLayer = L.FeatureGroup.extend(
	/** @lends SMC.layers.markers.MarkerLayer# */
	{
		includes: [SMC.layers.SingleLayer, SMC.layers.stylers.MarkerCssStyler],

		STYLER: new SMC.layers.stylers.MarkerCssStyler(),

		clusterGroup: new L.MarkerClusterGroup({
			polygonOptions: {
				fill: false,
				stroke: false
			}
		}),

		noClusterGroup: new L.FeatureGroup(),



		/*addTo: function(map) {
			
			L.LayerGroup.prototype.addTo.call(this, map);
			if (map) {
				map.on("zoomend", this._onViewChanged, this);

			}

		},*/

		removeLayer: function(layer) {
			if (this.clusterGroup.hasLayer(layer)) {
				this.clusterGroup.removeLayer(layer);
			} else if (this.noClusterGroup.hasLayer(layer)) {
				this.noClusterGroup.removeLayer(layer);
			} else
				this._map.removeLayer(layer);
		},


		onAdd: function(map) {
			this.clusterGroup.addTo(map);
			this.noClusterGroup.addTo(map);
			L.LayerGroup.prototype.onAdd.call(this, map);
			if (map) {
				map.on("zoomend", this._onViewChanged, this);

			}

		},

		addLayer: function(layer) {

			if (layer instanceof L.Marker) {
				var marker = layer;
				this._applyStyles(marker);

				marker.on("click", function() {
					this.onFeatureClicked(marker);
				}, this);

				return marker;

			} else
				throw new Error("This is not a marker");

		},

		addMarkerFromFeature: function(features) {
			for (var i = 0; i < arguments.length; i++) {
				this._addMarker(arguments[i]);

			}
			return features;

		},

		_addMarker: function(f) {

			var markerLocation = new L.LatLng(f.geometry.coordinates[0], f.geometry.coordinates[1]);

			var marker = new L.Marker(markerLocation);
			// We store this here so is avalaible later, on restylings because of zoom changes.
			marker.properties = f.properties;

			this.addLayer(marker);
		},

		onFeatureClicked: function(feature) {
			this.fireEvent("featureClick", feature);
			//alert(feature.properties.name);
		},

		_applyStyles: function(marker, inCluster) {
			if (!marker.properties) {
				this.noClusterGroup.addLayer(marker);
				return;
			}

			var zoom = this._map.getZoom();
			var style = this.STYLER.applyStyle(marker.properties, zoom);
			if (style.icon) {
				marker.setIcon(style.icon);
			}

			if (inCluster) {
				this.clusterGroup.removeLayer(marker);
			} else {
				this.noClusterGroup.removeLayer(marker);
			}


			if (style.disableClustering) {
				this.noClusterGroup.addLayer(marker);
			} else {
				this.clusterGroup.addLayer(marker);
			}

			this.STYLER.addPopUp(marker, zoom);
		},

		_onViewChanged: function() {
			var markersCluster = this.clusterGroup.getLayers();
			var markersNoCluster = this.noClusterGroup.getLayers();


			console.debug(this._map.getZoom());

			// Recorrer cluster
			for (var i = 0; i < markersCluster.length; i++) {
				var marker = markersCluster[i];
				if (this.clusterGroup)
					this._applyStyles(marker, true);

			}

			for (var i = 0; i < markersNoCluster.length; i++) {
				var marker = markersNoCluster[i];
				if (this.noClusterGroup)
					this._applyStyles(marker, false);

			}



		}



	});