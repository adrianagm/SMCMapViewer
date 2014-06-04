function initMap() {

    // Centered in Manchester
    var map = SMC.map('map');
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
        layers: [
        {
            type: "SMC.layers.markers.WFSMarkerLayer",
            params: [{
                serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                typeName: "OpenData:COMMUNITY_CENTRES",
                label: "Community Centres"
            }]
        },{
            type: "SMC.layers.markers.WFSMarkerLayer",
            params: [{
                serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                typeName: "OpenData:CULTURAL_LOCATIONS",
                label: "Cultural Locations"
            }] 
        },
        {
            type: "SMC.layers.markers.WFSMarkerLayer",
            params: [{
                serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                typeName: "OpenData:LIBRARIES",
                label: "Libraries"
            }] 
        },{
            type: "SMC.layers.markers.WFSMarkerLayer",
            params: [{
                serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                typeName: "OpenData:V_RECYCLING_CENTRES",
                label: "Recycling centres"
            }] 
        },{
            type: "folder",
            label: 'Folder 1.1',
            layers: [{
                type: "SMC.layers.markers.WFSMarkerLayer",
                params: [{
                    serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                    typeName: "OpenData:Parks",
                    label: "Salford Parks"
                }] 
            }]   
        }]
    },{
        type: "folder",
        label: 'Folder 2',
        layers: [
        {
            type: "SMC.layers.markers.WFSMarkerLayer",
            params: [{
                serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
                typeName: "OpenData:V_SURE_START_CENTRES",
                label: "Children's centres"
            }] 
        }]
    }
    /*, {
        type: "SMC.layers.markers.WFSMarkerLayer",
        params: [{
            serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
            typeName: "OpenData:CULTURAL_LOCATIONS",
            label: "Cultural Locations"
        }]
    }*/];
    map.loadLayers(tree);
}

L.Icon.Default.imagePath = "../../dist/images";

window.onload = initMap;
