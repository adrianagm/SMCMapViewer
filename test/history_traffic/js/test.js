function initMap() {

    // Centered in Quito
    var map = SMC.map('map');
    map.setView([-0.2006705, -78.5322076], 10);


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

    var stylesheet =
        '*[density=12]{color: "red";} *[density=11]{color: "#FACC2E";} *[density=10]{color: "#088A08";}';

    // Add tree to map
    var tree = [{
        type: 'folder',
        label: 'Folder',
        layers: [{

            type: 'folder',
            label: 'Folder 1',
            layers: [{
                type: "SMC.layers.geometry.SolrGeometryHistoryLayer",
                params: [{
                    serverURL: "http://localhost:8983/solr/traffic/select",
                    timeField: 'time',
                    label: 'Solr Traffic',
                    stylesheet: stylesheet,
                    //draggingUpdates: false,
                    time: 1000
                }]

            }]

        }]

    }];

    map.loadLayers(tree);

}

L.Icon.Default.imagePath = "../../dist/images";

window.onload = initMap;
