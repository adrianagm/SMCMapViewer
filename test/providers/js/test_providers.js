/**
 * Test class to check providers functions
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */

function initMap() {
    // Create a map
    var map = SMC.map('map');
    // Set center in London
    map.setView([53.482, -2.306], 9);
    // Add base layer from OSM
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
    // Add maker layer to map
    var marcador = new SMC.layers.markers.MarkerLayer({});

    // Add style properties to marker layer
    var _createStyles = function(properties, zoom) {
        //template URL
        if (zoom >= 18) {
            // Charlton Heston :)
            var url = "http://replygif.net/i/735.gif";
            return {
                iconClassName: "marker-blue",
                //templateUrl: url,				
                disableClustering: true
            };
            //html template
        } else if (zoom < 18 && zoom >= 15) {
            var template = "<div style='text-align:center'><b style='color:blue'>{{NAME}}</b></div>";

            return {
                htmlTemplate: template,
                markerWidth: 65,
                anchorTop: 8,
                anchorLeft: 33,
                disableClustering: true
            };
        }

        //html template
        else if (zoom < 15 && zoom >= 10) {
            var template = "<div style='text-align:center'><b style='color:Red'>{{NAME}}</b></div>";

            return {
                htmlTemplate: template,
                markerWidth: 65,
                anchorTop: 8,
                anchorLeft: 33

            };
        }

        //icon URL
        else {
            // Red marker
            var url = "http://pixabay.com/static/uploads/photo/2012/04/26/19/04/red-42871_150.png";

            return {
                iconUrl: url,
                markerWidth: 50,
                markerHeight: 40,
                anchorTop: 40,
                anchorLeft: 12
            };
        }
    };
    marcador._createStyles = _createStyles;
    marcador.load = function(){};
    // Add legend to map
    var leyenda = L.control.layers(baseLayer, null, {
        collapsed: false
    }).addTo(map);
    // Create a wfs feature provider
    var provider = SMC.wfsProvider({
		serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
		typeName: "OpenData:Parks"
	});
	// Create a features loaded handler
	provider.onFeaturesLoaded = function(features){
		marcador.addMarkerFromFeature(features);
	};
	// Load the features from provider
	provider.loadFeatures();
	
    // Create WFSMarkerLayer
    var wfsMarkerLayer = SMC.wfsMarkerLayer({
        serverURL: "http://www.salford.gov.uk/geoserver/OpenData/wfs",
        typeName: "OpenData:COMMUNITY_CENTRES"
    });
    wfsMarkerLayer._createStyles = _createStyles;
    wfsMarkerLayer.addTo(map);
    // Add markers to map
	marcador.addTo(map);
}
// On load the page call init map function
window.onload = initMap;
