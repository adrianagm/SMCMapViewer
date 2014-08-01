function initMap() {

    // Centered in Manchester
    var map = SMC.map('map');
    map.setView([53.4666677, -2.2333333], 9);

    // Add satelite layer
    var satelite = L.tileLayer.wms("http://maps.opengeo.org/geowebcache/service/wms", {
        layers: "bluemarble",
        format: 'image/png',
        transparent: true,
        attribution: "Weather data © 2012 IEM Nexrad"
    }).addTo(map);

    // Add control to map
    var leyenda = SMC.layerTreeControl({}, {
        collapsed: false
    }).addTo(map);
    //Add tree to map
    var tree = [{
        type: "SMC.layers.TileLayer",
        reloadTriggers: [{
            type: "SMC.layers.reloaders.TimerReloadTrigger",
            params: [{
                triggerDelay: 1000
            }]
        }],
        params: [{
            url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
            maxZoom: 18,
            label: "Tile Layer Satellite",
            tileSize: 512,
            subdomains: ["a"],
            zoomOffset: 0,
            maxNativeZoom: 18
        }]
    }, {
        type: "SMC.layers.markers.WFSMarkerLayer",
        reloadTriggers: [{
            type: "SMC.layers.reloaders.AtmosphereRTReloadTrigger",
            params: [{
                topic: "markers",
                url: "http://localhost:8888/smc-mapviewer-updates-notifier/layerUpdates"
            }]
        }],
        params: [{
            serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
            typeName: "OpenData:V_RECYCLING_CENTRES",
            label: "Recycling centres (declarative)"
        }]
    }];

    map.loadLayers(tree);
    var markerLayer = new SMC.layers.markers.WFSMarkerLayer({
        serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
        typeName: "OpenData:V_RECYCLING_CENTRES",
        label: "Recycling centres (programmatic)",
        reloadTriggers: [
            new SMC.layers.reloaders.TimerReloadTrigger({
                triggerDelay: 5000
            })
        ]
    });

    // markerLayer.addTo(map);
}

L.Icon.Default.imagePath = "../../dist/images";

window.onload = initMap;
