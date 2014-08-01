function initMap() {

    // Centered in Manchester
    var map = SMC.map('map');
    map.setView([53.4666677, -2.2333333], 9);

    var base = SMC.tileLayer({
        url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18,
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
                label: 'History Markers',
                layers: [{
                    type: "SMC.layers.markers.WFSMarkerLayer",
                    params: [{
                        serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                        typeName: "OpenData:COMMUNITY_CENTRES",
                        date: "2",
                        label: 'Community Centres'
                    }]
                }, {
                    type: "SMC.layers.markers.WFSMarkerLayer",
                    params: [{
                        serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                        typeName: "OpenData:Parks",
                        date: "1",
                        label: 'Parks'
                    }]
                }, {
                    type: "SMC.layers.markers.WFSMarkerLayer",
                    params: [{
                        serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                        typeName: "OpenData:V_SURE_START_CENTRES",
                        date: "3",
                        label: "Children's Centres"
                    }]
                }]

            }, {

                type: "SMC.layers.history.AggregatingHistoryLayer",
                label: 'History Roads',
                layers: [{
                    type: 'SMC.layers.geometry.WFSTiledGeometryLayer',
                    params: [{
                        serverURL: 'http://demo.opengeo.org/geoserver/wfs',
                        typeName: 'ne_10m_roads',
                        label: 'Roads 1',
                        date: '2013',
                        zoomOffset: 0,
                        tileSize: 256,
                        draggingUpdates: true,
                        stylesheet: '* {strokeColor: "blue";}',


                    }]

                }, {
                    type: 'SMC.layers.geometry.WFSTiledGeometryLayer',
                    params: [{
                        serverURL: 'http://demo.opengeo.org/geoserver/wfs',
                        typeName: 'ne_10m_roads',
                        label: 'Roads 2',
                        date: '2011',
                        zoomOffset: 0,
                        tileSize: 256,
                        draggingUpdates: true,
                        stylesheet: '* {strokeColor: "green";}',


                    }]

                }, {
                    type: 'SMC.layers.geometry.WFSTiledGeometryLayer',
                    params: [{
                        serverURL: 'http://demo.opengeo.org/geoserver/wfs',
                        typeName: 'ne_10m_roads',
                        cql_filter: "type = 'Major Highway'",
                        label: 'Roads 3',
                        date: '2012',
                        zoomOffset: 0,
                        tileSize: 256,
                        draggingUpdates: true,
                        stylesheet: '* {strokeColor: "red";}',

                    }]
                }, {
                    type: 'SMC.layers.geometry.WFSTiledGeometryLayer',
                    params: [{
                        serverURL: 'http://demo.opengeo.org/geoserver/wfs',
                        typeName: 'ne_10m_roads',
                        cql_filter: "type = 'Secondary Highway'",
                        label: 'Roads 4',
                        date: '2014',
                        zoomOffset: 0,
                        tileSize: 256,
                        draggingUpdates: true,
                        stylesheet: '* {strokeColor: "yellow";}',

                    }]
                }]


            }, {
                type: "SMC.layers.history.AggregatingHistoryLayer",
                label: 'History Geometry',
                layers: [{
                    type: 'SMC.layers.geometry.WFSGeometryLayer',
                    params: [{
                        serverURL: 'http://www.salford.gov.uk/geoserver/OpenData/wfs',
                        typeName: 'OpenData:Parks',
                        label: 'Parks 1',
                        date: '1',
                        zoomOffset: 0,
                        draggingUpdates: true,
                        stylesheet: '* {fillColor: "rgba(0, 0, 255, 0.5)";}',

                    }]

                }, {
                    type: 'SMC.layers.geometry.WFSGeometryLayer',
                    params: [{
                        serverURL: 'http://www.salford.gov.uk/geoserver/OpenData/wfs',
                        typeName: 'OpenData:Parks',
                        label: 'Parks 2',
                        date: '2',
                        zoomOffset: 0,
                        draggingUpdates: true,
                        stylesheet: '* {fillColor: "rgba(255, 0, 0, 0.5)";}',

                    }]
                }, {
                    type: 'SMC.layers.geometry.WFSGeometryLayer',
                    params: [{
                        serverURL: 'http://www.salford.gov.uk/geoserver/OpenData/wfs',
                        typeName: 'OpenData:Parks',
                        label: 'Parks 3',
                        date: '3',
                        zoomOffset: 0,
                        draggingUpdates: true,
                        stylesheet: '* {fillColor: "rgba(0, 255, 0, 0.5)";}',

                    }]
                }]


            }]
        }]

    }];

    map.loadLayers(tree);
    // var wfsMarkerLayer = SMC.wfsMarkerLayer({
    //     serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
    //     typeName: "OpenData:COMMUNITY_CENTRES",
    //     label: "Prueba WFS",
    // }).addTo(map);



    // var tileLayer = SMC.wfsTiledGeometryLayer({
    //     idField: 'id',
    //     serverURL: 'http://demo.opengeo.org/geoserver/wfs',
    //     typeName: 'ne_10m_roads',
    //     label: 'Roads',
    //     // cql_filter:"sov_a3 ='USA' AND type = 'Major Highway'",
    //     zoomOffset: 0,
    //     tileSize: 256,
    //     draggingUpdates: true

    // }).addTo(map);


    // tileLayer._createStyles = function(feature) {
    //     strokeColor: 'blue'
    // };

    // // tileLayer.addTo(map);
    //  tileLayer.setZIndex(1000);



    // tileLayer.on("featureClick", function(event) {
    //     var select = false;


    //     for (var i = 0; i < this.features.length; i++) {
    //         if (event.feature.id == this.features[i].id) {
    //             if (this.features[i].selected) {
    //                 select = true;
    //             }

    //         }
    //         if (this.features[i].selected) {
    //             this.features[i].selected = false;
    //             this.updateFeature(this.features[i]);
    //         }

    //     }

    //     if (!select) {
    //         event.feature.selected = true;

    //     }

    // });
}

L.Icon.Default.imagePath = "../../dist/images";

window.onload = initMap;
