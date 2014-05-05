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
        includes: SMC.Util.deepClassInclude([SMC.layers.SingleLayer, SMC.layers.stylers.MarkerCssStyler]),

        initialize: function(options){
            this.clusterGroup = new L.MarkerClusterGroup({
            polygonOptions: {
                fill: false,
                stroke: false
            }
        });

            this.noClusterGroup = new L.FeatureGroup();
        },


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
            SMC.layers.SingleLayer.prototype.onAdd.call(this, map);
            if (map) {
                map.on("zoomend", this._onViewChanged, this);
            }
        },

        onRemove: function(map){
            map.removeLayer(this.clusterGroup);
            map.removeLayer(this.noClusterGroup);
            L.LayerGroup.prototype.onRemove.call(this, map);
            if (map) {
                map.off("zoomend", this._onViewChanged, this);
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

        _sendFeatures: function(features) {
            var self = this;
            $.each(features, function(index, feature) {
                self._addMarker(feature);
            });
        },

        addMarkerFromFeature: function(features) {
            if (L.Util.isArray(features)) {
                this._sendFeatures(features);
            } else if(arguments.length>1){
                this._sendFeatures(arguments);
            } else {
                 this._sendFeatures([features]);
            }
        },

        _addMarker: function(f) {

            if (f.type != "Feature") {
            	console.debug("Received no Feature object");
                return;
            }

            // For GeoJSON standar the first coordinate is the longitude
            // Documentation http://geojson.org/geojson-spec.html#positions
            var markerLocation = new L.LatLng(f.geometry.coordinates[1], f.geometry.coordinates[0]);

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
            var style = this.applyStyle(marker.properties, zoom);
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

            this.addPopUp(marker, zoom);
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
