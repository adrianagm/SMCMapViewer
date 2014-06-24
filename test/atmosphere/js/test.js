function initMap() {

    // Centered in London
    var map = SMC.map('map');
    //map.setView([-0.2298500, -78.5249500], 8)
    map.setView([53.4666677, -2.2333333], 9);



    var base = SMC.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);

    var satelite = L.tileLayer.wms("http://maps.opengeo.org/geowebcache/service/wms", {
        layers: "bluemarble",
        format: 'image/png',
        transparent: true,
        attribution: "Weather data © 2012 IEM Nexrad"
    });


    map.loadLayers([{
        id: "realTimeLayer",
        type: "SMC.layers.markers.AtmosphereRTMarkerLayer",
        params: [{
            url: "http://localhost:8080/chat-app/chat",
            topic: "realTimeMarkers",
            stylesheet: "* {popUpTemplate:\"<p><a href=\\\"javascript:deleteMarker({{$id}})\\\">Delete</a></p><p><a href=\\\"javascript:moveMarker({{$id}})\\\">Move</a></p>\";popUpOffsetTop:-30;}"
        }],
        listeners: {
            socketOpened: function(data) {
                console.debug("RealTime Socket opened");

                window.socket = data.target.socket;
                map.on("click", function(e) {
                    socket.push(JSON.stringify({
                        author: "web browser",
                        action: "ADD",
                        latitude: e.latlng.lat,
                        longitude: e.latlng.lng
                    }));
                });
            }
        }
    }]);

    window._markersLayer = map.loadedLayers.realTimeLayer;

    var baseLayer = {
        "Street Map": base,
        "Satelite": satelite
    };


    var leyenda = L.control.layers(baseLayer, null, {
        collapsed: false
    }).addTo(map);

}

function deleteMarker(markerId) {
    socket.push(JSON.stringify({
        action: "DELETE",
        featureId: markerId
    }));
}

function moveMarker(featureId) {
    var marker = window._markersLayer._markersMap[featureId];
    marker.dragging.enable();

    alert("Drag the marker to its new  position");
    marker.closePopup();

    marker.addOneTimeEventListener("dragend", function() {
        marker.dragging.disable();
        socket.push(JSON.stringify({
            action: "MODIFY",
            featureId: featureId,
            latitude: marker._latlng.lat,
            longitude: marker._latlng.lng
        }));
    });
}

L.Icon.Default.imagePath = "../../dist/images";

window.onload = initMap;
