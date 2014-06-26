function initMap() {

    // Centered in Manchester
    map = SMC.map('map');
    map.setView([53.4666677, -2.2333333], 9);

    var base = SMC.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);

    // Add satelite layer
    var satelite = L.tileLayer.wms("http://maps.opengeo.org/geowebcache/service/wms", {
        layers: "bluemarble",
        format: 'image/png',
        transparent: true,
        attribution: "Weather data © 2012 IEM Nexrad"
    });
    // Add layers to control group
    var baseLayer = {
        "Street Map": base,
        "Satelite": satelite
    };
    // Add control to map
    var leyenda = SMC.layerTreeControl(baseLayer, {
        collapsed: false
    }).addTo(map);
    // Add tree to map
    var tree = [{
        type: "folder",
        label: 'Folder 1',
        layers: [{
            type: "folder",
            label: 'Folder 1.1',
            layers: [{
                type: "SMC.layers.history.AggregatingHistoryLayer",
                layers: [{
                    type: "SMC.layers.markers.WFSMarkerLayer",
                    params: [{
                        serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                        typeName: "OpenData:COMMUNITY_CENTRES"
                    }]
                }, {
                    type: "SMC.layers.markers.WFSMarkerLayer",
                    params: [{
                        serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                        typeName: "OpenData:COMMUNITY_CENTRES"
                    }]
                }, {
                    type: "SMC.layers.markers.WFSMarkerLayer",
                    params: [{
                        serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                        typeName: "OpenData:COMMUNITY_CENTRES"
                    }]
                }]

            }]
        }]
    }];

    map.loadLayers(tree);
    var wfsMarkerLayer = SMC.wfsMarkerLayer({
        serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
        typeName: "OpenData:COMMUNITY_CENTRES",
        label: "Prueba WFS"
    }).addTo(map);



    var tileLayer = new SMC.layers.geometry.WFSTiledGeometryLayer({
        idField: 'id',
        serverURL: 'http://demo.opengeo.org/geoserver/wfs',
        typeName: 'ne_10m_roads',
        // cql_filter:"sov_a3 ='USA' AND type = 'Major Highway'",
        zoomOffset: 0,
        tileSize: 256,
        draggingUpdates: true

    });


    tileLayer._createStyles = function(feature) {
        fillColor: 'rgba(0, 200, 0, 0.5)'
    };

    tileLayer.addTo(map);
    tileLayer.setZIndex(1000);



    tileLayer.on("featureClick", function(event) {
        var select = false;


        for (var i = 0; i < this.features.length; i++) {
            if (event.feature.id == this.features[i].id) {
                if (this.features[i].selected) {
                    select = true;
                }

            }
            if (this.features[i].selected) {
                this.features[i].selected = false;
                this.updateFeature(this.features[i]);
            }

        }

        if (!select) {
            event.feature.selected = true;

        }

    });
}

L.Icon.Default.imagePath = "../../dist/images";

window.onload = initMap;