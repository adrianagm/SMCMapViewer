function initMap() {

    // Centered in London
    var map = SMC.map('map');
   // map.setView([37.378736, -6.000823], 15);
     map.setView([-0.2006705, -78.5322076], 10);
    //map.setView([53.4666677, -2.2333333], 9);



    var base = SMC.tileLayer({
        //url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);

    var satelite = SMC.wmsLayer({
        url: "http://maps.opengeo.org/geowebcache/service/wms",
        layers: "bluemarble",
        attribution: "Weather data © 2012 IEM Nexrad"
    });


    var baseLayer = {
        "Street Map": base,
        "Satelite": satelite
    };


   /* L.control.layers(baseLayer, null, {
        collapsed: false
    }).addTo(map);*/

  //USAR ESTE CONTROL EN LUGAR DE L.CONTROL E INICIALIZARLO ANTES DE AÑADIR LAS CAPAS
   SMC.layerTreeControl(baseLayer, {
        collapsed: false
    }).addTo(map);

   

    map.loadLayers([
   /* {
        type: "URLMarkerLayer",
        params: [{
            url: "http://172.28.99.70:8081/sc.eco/rest/event/geojsonp",
            dataType: "jsonp"
        }]
      },*/
    /*  {
        id: "realTimeLayer",
        type: "SMC.layers.markers.AtmosphereRTMarkerLayer",
        params: [{
            url: "atmosphere/map",
            topic: "",
            //stylesheetURL: "styles/style.markercss"
        }],
        listeners: {
            socketOpened: function(data) {
//                console.debug("RealTime Socket opened");
//
//                window.socket = data.target.socket;
//                map.on("click", function(e) {
//                    socket.push(JSON.stringify({
//                        author: "web browser",
//                        action: "ADD",
//                        latitude: e.latlng.lat,
//                        longitude: e.latlng.lng
//                    }));
//                });
            }
        }
    },*/
    {
    	id:"trafficLiveLayer",
    	type:"SMC.layers.WMSLayer",
    	params: [{
    		//url: "http://172.28.99.44:8080/geoserver/icm/wms",
            url: "http://localhost:8080/geoserver/icm/wms",
    		//layers:"icm:oip_link",
            layers:"icm:quito_polygon",
            

    	}]
    	 
    },
    {
    	id:"trafficHistoryLayer",
    	type:"SMC.layers.geometry.SolrGeometryHistoryLayer",
    	params:[{
            //serverURL: "http://172.28.99.70:8983/solr/traffic/select",
    		serverURL: "http://localhost:8983/solr/traffic/select",
    		timeField:'time',
    		label: "Histórico Tráfico",
    		time: 1000
    	}]
    }]);

    window._markersLayer = map.loadedLayers.realTimeLayer;


};


L.Icon.Default.imagePath = "dist/images";

window.onload = initMap;
