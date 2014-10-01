/**
 * Test class to check providers functions
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */

function initMap() {
    SMC.BASE_URL = "../../dist/"
    L.Icon.Default.imagePath = "../../dist/images";
    var map = SMC.map('map');
    map.setView([37.383333, -4.983333], 8);
    // Add base layer from OSM
    var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(map);
    // Add layers to control group
    var baseLayer = {
        "Open Street Map": OpenStreetMap_Mapnik
    };

    var leyenda = SMC.layerTreeControl(baseLayer, {
        collapsed: false
    }).addTo(map);

    var tree = [{
       
        type: "folder",
        label: "Capas WFS-T",
        layers: [{
            type: "SMC.layers.markers.WFSTMarkerLayer",
            params: [{
                serverURL: "http://localhost/geoserver/s/wfs",
                typeName: "s:EDITABLE_PUNTO",
                label: "Editable"
            }]
        }]
    }];
    map.loadLayers(tree);

  
}
// On load the page call init map function
L.Icon.Default.imagePath = "../../dist/images";

window.onload = initMap;
