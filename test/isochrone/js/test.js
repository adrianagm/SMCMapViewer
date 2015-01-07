function initMap() {

    // Centered in London
    var map = SMC.map('map');
    //map.setView([-0.2298500, -78.5249500], 8)
    map.setView([42.8508743,-2.6694109], 13);



     var base = SMC.tileLayer({
       // url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18,
    }).addTo(map);

    var baseLayer = {
        "Street Map": base
    };

    var leyenda = SMC.layerTreeControl(baseLayer, {
        collapsed: false
    }).addTo(map);


    var isochroneControl = SMC.isochroneControl(map);

};

L.Icon.Default.imagePath = "../../dist/images";

window.onload = initMap;