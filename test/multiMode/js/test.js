function initMap() {

    // Centered in Manchester
    var map = SMC.map('map');
    map.setView([53.4666677, -2.2333333], 9);


    // var base = SMC.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    //     maxZoom: 18,
    // }).addTo(map);

    var base = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
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

            type: "SMC.layers.aggregation.MultiModeLayer",
            label: 'Multi Mode Layer',
            layers: [{

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
                        stylesheet: '* |z13- {fillColor: "rgba(0, 0, 255, 0.5)";}',

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


            }, {
                type: "SMC.layers.markers.WFSMarkerLayer",
                params: [{
                    serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                    typeName: "OpenData:Parks",
                    date: "1",
                    label: 'Parks'
                }]


            }, {
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
                type: "SMC.layers.markers.WFSTMarkerLayer",
                params: [{
                    serverURL: "http://www.ideandalucia.es/dea100/wfs",
                    typeName: "ideandalucia:it01_puerto_pun",
                    label: "Puertos",
                    outputFormat: "json"
                }]

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

    }];



    map.loadLayers(tree);

}

L.Icon.Default.imagePath = "../../dist/images";

window.onload = initMap;