/**
* Test class to check providers functions
*
* @author Moisés Arcos (marcos@emergya.com)
*/
function initMap() {
	// Create a map
	var map = SMC.map('map');
	// Set center in London
	map.setView([51.5135587, 0.26855], 9);
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
	// Add legend to map
	var leyenda = L.control.layers(baseLayer, null, {
		collapsed: false
	}).addTo(map);
	// Create a wfs feature provider
	var provider = SMC.wfsProvider({
		serverURL: "http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_WFS_Patrimonio_Natural",
		typeName: "RedNatura2000"
	});
	var geojson = provider.loadFeatures();
}
// On load the page call init map function
window.onload = initMap;