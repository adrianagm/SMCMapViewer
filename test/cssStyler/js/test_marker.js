/**
 * Test class to check providers functions
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */

function initMap() {
    // Create a map
    var map = SMC.map('map');
    // Set center in London
    map.setView([51.507222, -0.1275], 10);
    // Add base layer from OSM
    var base = SMC.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);
	var stylesheet = '* {iconUrl: "css/images/tires.png";markerWidth: 32;markerHeight: 37;} * |z13- {iconUrl:"css/images/underground.png";markerWidth: 32;markerHeight: 37;}';
    var stylesheetURL = "marker_style.txt"
	var marcador = new SMC.layers.markers.MarkerLayer({
		stylesheet: stylesheet
	});
	marcador.load = function() {
		$.ajax({
	        url: 'http://adriana-4.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM tfl_stations',
	        dataType: "json",
	        success: function(response) {
	            var features = response.features;
	            marcador.addMarkerFromFeature(features);
	        }
	    });
	};
	marcador.addTo(map);
	
}
// On load the page call init map function
window.onload = initMap;
