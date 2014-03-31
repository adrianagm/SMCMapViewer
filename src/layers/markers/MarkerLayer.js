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

		addMarkerFromFeature: function(features) {

			if (!L.Util.isArray(features)) {
				features = [features];
			}

			for (var i = 0; i < features.length; i++) {
				var f = features[i];
				var markerLocation = new L.LatLng(f.geometry.coordinates[0], f.geometry.coordinates[1]);
				var myStyle = this.STYLER.applyStyle(f.properties);
				var marker = new L.Marker(markerLocation, {
					icon: myStyle
				});
				marker.bindPopup(f.properties.name);
				this.addLayer(marker);
				marker.on("click", function() {
					this.onFeatureClicked(f);
				}, this);
			}
		},

		onFeatureClicked: function(feature) {
			this.fireEvent("featureClick", feature);
			alert(feature.properties.name);
		}



	});