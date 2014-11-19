function initMap() {

    // Centered in Quito
    var map = SMC.map('map');
    map.setView([-0.2006705,-78.4501076], 9);

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

    var stylesheet ='*[density=12]{color: "red";} *[density=11]{color: "#FF8000";} *[density=10]{color: "#088A08";}';
   
     // Add tree to map
    var tree = [{
    
                type: "SMC.layers.geometry.SolrGeometryHistoryLayer",
                label: 'Solr History Traffic',
               
                    params: [{
                        serverURL: "http://localhost:8983/solr/traffic/select",
                        timeField: 'time',
                        label: 'Solr Traffic',
                        stylesheet: stylesheet
                    }]
               
       

    }];

    map.loadLayers(tree);

}

L.Icon.Default.imagePath = "../../dist/images";

window.onload = initMap;
