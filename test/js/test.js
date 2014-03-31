
function initMap() {



	// Centered in London
	var map = SMC.map('map');
	//map.setView([-0.2298500, -78.5249500], 8)
map.setView([51.735587,0.46855], 8)



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



///nuevo...............................................

var marcador1_geojson = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [51.5, -0.09]
  },
  "properties": {
    "name": "Marcador 1"
  }
};

var marcador2_geojson = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [51.495, -0.083]
  },
  "properties": {
    "name": "Marcador 2"
  }
};





var marcador = new SMC.layers.markers.MarkerLayer();
marcador.addMarkerFromFeature([marcador2_geojson, marcador2_geojson, marcador2_geojson, marcador2_geojson, marcador2_geojson, marcador1_geojson, marcador1_geojson]);


map.addLayer(marcador);



var limit = L.geoJson([], {
		style : function(feature){
		var type = feature.geometry.type;
			switch (type) {
				case 'Point':
				case 'MultiPoint':
					return {
						color: 'rgba(252,146,114,0.6)',
						radius: 5
					};

				case 'LineString':
				case 'MultiLineString':
					var lineStyle = {
						color: 'rgba(0,0,0,0.8)',
						weight: 2

					};


					if (feature.properties.link_type_id == 33) {					
						lineStyle.color = 'rgba(255,0,0,0.8)';
						lineStyle.weight = 3;					
						lineStyle.zIndex = 10;
						lineStyle.offset = 3;
					}

					if(feature.properties.clicked) {

						lineStyle.color = "rgba(0,0,255,0.8)";
						lineStyle.zIndex= 100;
						lineStyle.weight = feature.properties.clicked;
					}

					if(feature.properties.color) {
						lineStyle.color = feature.properties.color;
					}

					return lineStyle;

				case 'Polygon':
				case 'MultiPolygon':
					return {

						color: 'rgba(43,140,190,0.4)',
						outline: {
							color: 'rgb(0,0,0)',
							size: 1
						}
					};

				default:
					return null;
			}
}

	});

var geoJsonLayer = L.geoJson([], {
		style : function(feature){
		var type = feature.geometry.type;
			switch (type) {
				case 'Point':
				case 'MultiPoint':
					return {
						color: 'rgba(252,146,114,0.6)',
						radius: 5
					};

				case 'LineString':
				case 'MultiLineString':
					var lineStyle = {
						color: 'rgba(0,0,0,0.8)',
						weight: 2

					};


					if (feature.properties.link_type_id == 33) {					
						lineStyle.color = 'rgba(255,0,0,0.8)';
						lineStyle.weight = 3;					
						lineStyle.zIndex = 10;
						lineStyle.offset = 3;
					}

					if(feature.properties.clicked) {

						lineStyle.color = "rgba(0,0,255,0.8)";
						lineStyle.zIndex= 100;
						lineStyle.weight = feature.properties.clicked;
					}

					if(feature.properties.color) {
						lineStyle.color = feature.properties.color;
					}

					return lineStyle;

				case 'Polygon':
				case 'MultiPolygon':
					return {

						color: 'rgba(43,140,190,0.4)',
						outline: {
							color: 'rgb(0,0,0)',
							size: 1
						}
					};

				default:
					return null;
			}

},
		

		onEachFeature : function(feature,layer) {

			var content ="";
			content+="<p>ID:"+JSON.stringify(feature.properties.id)+"</br>";
			content+="Distrito:"+JSON.stringify(feature.properties.seg_desc)+"</br>";
			content+="Red:"+JSON.stringify(feature.properties.lines)+"</p>";
			layer.bindPopup(content);



		}


	});

geoJsonLayer.on("click", function(e){	
	this.setStyle({color:'rgb(0,0,0)', weight: 2});
	var feature = e.layer.toGeoJSON();
	if(!feature.properties.clicked) 
		feature.properties.clicked=3;

	feature.properties.clicked++;
	var estilo = this.options.style(feature);
	e.layer.setStyle(estilo);


});

map.on("click", function(e){
	geoJsonLayer.setStyle({color:'rgb(0,0,0)', weight: 2});
});

var limite = L.layerGroup([limit]).addTo(map);
var carreteras = L.layerGroup([geoJsonLayer]).addTo(map);

$.ajax({
	
		url :'http://adriana-4.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM tfl_lines',

		dataType:"json",
		success: function(response) {

			map.setView([51.735587,0.46855], 8)

			geoJsonLayer.addData(response);

			
			
 
		}
	});
$.ajax({
url: 'http://mapit.mysociety.org/area/2247.geojson',
dataType:"json",
		success: function(response) {

			map.setView([51.735587,0.46855], 8)

			limit.addData(response);

			
			
 
		}
	});

var baseLayer = {
	"Street Map":base,
	"Satelite":satelite
}
var dataLayer = {
	"Carreteras":carreteras,
	"L&iacutemite": limite
}

var leyenda = L.control.layers(baseLayer, dataLayer, {collapsed:false}).addTo(map);


//................................................................................

}





window.onload = initMap;
