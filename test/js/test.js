function initMap() {

	// Centered in London
	var map = SMC.map('map');
	//map.setView([-0.2298500, -78.5249500], 8)
	map.setView([51.5135587, 0.26855], 11);



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

	//--------------------------------------------------markers-----------------------------------
	var marcador1_geojson = {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [-0.09, 51.5]
		},
		"properties": {
			"name": "Marcador 1",
			"id": "1",
			"colour": "red"
		}
	};

	// L.circleMarker([51.495, -0.083], 20).addTo(map);
	// L.circleMarker([51.5, -0.09], 20).addTo(map);

	var marcador2_geojson = {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [-0.083, 51.495]
		},
		"properties": {
			"name": "Marcador 2",
			"id": "2",
			"colour": "blue"
		}
	};

	var marcador3_geojson = {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [-0.083, 51.495]
		},
		"properties": {
			"name": "Marcador 3",
			"id": "3",
			"colour": "green"
		}
	};



	var marcador = new SMC.layers.markers.MarkerLayer({

	});
	marcador.load = function() {};



	marcador._createStyles = function(properties, zoom) {
		var template, url;
		//template URL
		if (zoom >= 18) {
			// Charlton Heston :)
			url = "http://replygif.net/i/735.gif";
			return {
				iconClassName: "marker-blue",
				templateUrl: url,
				disableClustering: true
			};

			//html template
		} else if (zoom < 18 && zoom >= 15) {
			template = "<div style='text-align:center'><b style='color:{{colour}}'>{{name}}</b></div>";

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
			template = "<div style='text-align:center'><b style='color:{{colour}}'>{{name}}</b></div>";

			return {
				htmlTemplate: template,
				markerWidth: 65,
				anchorTop: 8,
				anchorLeft: 33,
				//disableClustering: true

			};
		}

		//icon URL
		else {
			// Red marker
			url = "http://pixabay.com/static/uploads/photo/2012/04/26/19/04/red-42871_150.png";

			return {
				iconUrl: url,
				markerWidth: 50,
				markerHeight: 40,
				anchorTop: 40,
				anchorLeft: 12,
				//disableClustering: true
			};
		}
	};


	marcador._addContentPopUp = function(marker, zoom) {
		//noPopUp
		if (zoom >= 18) {

			return {
				noPopUp: true
			};

			//iframe popUp
		} else if (zoom < 18 && zoom >= 15) {
			var url = "http://replygif.net/i/735.gif";

			return {
				popUpUrl: url,
				offsetLeft: 10,
				offsetTop: 5
			};

			//popUp template
		} else if (zoom < 15 && zoom >= 10) {
			var template = "Nombre: <b>{{name}}</b><br>Id: {{id}}<br>";

			return {
				popUpTemplate: template

			};

			//default popUp (Mustache template all properties)
		} else {
			return {
				defaultPopUp: true
			};
		}

	};



	marcador.addTo(map);
	//map.addLayer(marcador);

	//marcador.addMarkerFromFeature(marcador2_geojson, marcador3_geojson, marcador1_geojson, marcador1_geojson);
	marcador.on("featureClick", function(f) {
		alert(f.properties.name);
	});

	//L.circleMarker([51.5, -0.39], 20).addTo(map);
	var marker = new L.Marker(new L.LatLng(51.5, -0.39));
	marker.properties = marcador3_geojson.properties;
	//marcador.addLayer(marker);



	var baseLayer = {
		"Street Map": base,
		"Satelite": satelite
	};


	var leyenda = L.control.layers(baseLayer, null, {
		collapsed: false
	}).addTo(map);



	//--------------------------------------------------------------------------------------------
	//------------------------------geometry------------------------------------------------------


	var geometry = new SMC.layers.geometry.GeometryLayer({});

	var lines = new SMC.layers.geometry.GeometryLayer({});

	var puntos = new SMC.layers.geometry.GeometryLayer({});

	var stations = new SMC.layers.geometry.GeometryLayer({});



	geometry.load = function() {};
	lines.load = function() {};
	puntos.load = function() {};
	stations.load = function() {};

	/* Commented as it fails 'cause the geometry layer is not added, and it fails: 
	geometry.setZIndex(1000);
	lines.setZIndex(1000);
	puntos.setZIndex(1000);
	stations.setZIndex(1000);
	*/

	var geometry_geojson = {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [-0.39, 51.395]
		},
		"properties": {
			"name": "Marcador 3",
			"id": "1",
			"colour": "green"
		}
	};

	var geometry_geojson2 = {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [-0.39, 51.355]
		},
		"properties": {
			"name": "Marcador 3",
			"id": "2",
			"colour": "green"
		}
	};



	puntos.addGeometryFromFeatures(geometry_geojson2);
	//puntos.addTo(map);
	//geometry.addGeometryFromFeatures(geometry_geojson);
	geometry.addTo(map);

	$.ajax({

		url: 'http://adriana-4.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM tfl_lines',


	 	dataType: "json",
	 	success: function(response) {
	 		var features = response.features;

	 		// lines.addTo(map);
	 		// puntos.addTo(map);
	 		geometry.addTo(map);

	 		lines.addGeometryFromFeatures(features);
	 		//lines.render();

	 	}
	});

	// $.ajax({

	// 	url: 'http://adriana-4.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM london_polygon',

	// 	dataType: "json",
	// 	success: function(response) {
	// 		var features = response.features;

	// 		geometry.addTo(map);
	// 		geometry.addGeometryFromFeatures(features);
	// 		//geometry.render();

	// 	}
	// });

	//puntos.render();

	// $.ajax({

	// 	url: 'http://adriana-4.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM tfl_stations',

	// 	dataType: "json",
	// 	success: function(response) {
	// 		stations.addTo(map);
	// 		var features = response.features;
	// 		stations.addGeometryFromFeatures(features);
	// 		//stations.render();

	// 	}
	// });


	stations._createStyles = function(feature, zoom) {
		if (zoom >= 13)
			return {
				fillColor: 'blue',
				strokeColor: 'blue',
				symbol: 'Star',
				radius1: 10

			};
		else if (zoom < 13 && zoom > 10)
			return {
				fillColor: 'green',
				symbol: 'RegularPolygon',
				invisible: true

			};
		else
			return {
				fillColor: 'red',
				symbol: 'RegularPolygon',
				sides: 5,
				opacity: 0.5

			};
	};

	puntos._createStyles = function(feature, zoom) {
		if (zoom >= 16) {
			return {
				fillColor: 'red'
			};
		} else if (zoom < 16 && zoom >= 14) {
			return {
				invisible: true
			};
		} else
			return {
				fillColor: 'blue',
				symbol: 'RegularPolygon',
				sides: 8,
				opacity: 0.7

			};
	};

	lines._createStyles = function(feature, zoom) {
		return {
			strokeColor: '#444',
			strokeWidth: 2,
			symbol: "RegularPolygon"
		};
	};



	var geomStyles = function(feature, zoom) {
		var type = feature.geometry.type;
		switch (type) {
			case 'Point':
			case 'MultiPoint':
				if (zoom >= 13)
					return {
						fillColor: 'blue',
						strokeColor: 'blue',
						symbol: 'Star',
						radius1: 10

					};
				else if (zoom < 13 && zoom > 10)
					return {
						fillColor: 'green',
						symbol: 'RegularPolygon',

					};
				else
					return {
						fillColor: 'red',
						symbol: 'RegularPolygon',
						sides: 5

					};

				break;

			case 'LineString':
			case 'MultiLineString':
				var tube = feature.properties.lines;
				tube = JSON.parse(tube);
				var color = tube[0].colour;
				tube = feature.properties.lines;
				tube = JSON.parse(tube);
				var name = tube[0].name;
				if (name == 'Central') {
					return {
						strokeWidth: 3,
						strokeColor: color,
						offset: 4,
						zIndex: 30

					};
				} else
					return {
						strokeWidth: 3,
						strokeColor: color,
						offset: 4,
						zIndex: 10

					};

				break;

			case 'Polygon':
			case 'MultiPolygon':
				return {

					strokeColor: 'blue',
					fillColor: 'blue',


				};
		}

	};

	geometry._createStyles = geomStyles;



	// geometry._addContentPopUp = function(feature, zoom) {

	// 		var template = "Nombre: <b>{{name}}</b><br>Id: {{id}}<br>";

	// 		return {
	// 			popUpTemplate: template

	// 		};


	// };

	geometry._createLabel = function(feature) {
		var type = feature.geometry.type;
		switch (type) {
			case 'Point':
			case 'MultiPoint':
				var station = feature.properties.name;
				return {
					content: station
				};


			case 'LineString':
			case 'MultiLineString':
				var tube = feature.properties.lines;
				tube = JSON.parse(tube);
				var label = tube[0].name;

				return {
					content: label,
					uniqueLabel: true

				};


			case 'Polygon':
			case 'MultiPolygon':
				var area = feature.properties.descript0;
				return {
					content: area
				};
		}
	};

	puntos._createLabel = function(feature, zoom) {
		if (zoom >= 11) {
			return {
				content: feature.properties.name
			};
		} else
			return {
				content: feature.properties.id
			};
	};

	//.................tiled geometry...................
	var tileLayer = new SMC.layers.geometry.TiledGeometryLayer({});
	tileLayer.load = function() {};
	tileLayer.setZIndex(1000);
	geometry._createStyles =  geomStyles;
	tileLayer.createRequest = function(bounds) {
		var url = 'http://adriana-4.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM tfl_lines WHERE the_geom %26%26 ST_SetSRID (ST_MakeBox2D(ST_Point('+bounds[0]+','+bounds[1]+'), ST_Point('+bounds[2]+','+ bounds[3]+')),4326)';

		return {
			url: url,
			dataType:"json",
		};
	};


	tileLayer.addTo(map);
	

	// var max = new L.Marker(new L.LatLng(51.6941, 0.114528));
	// max.properties = {
	// 	"name": "max",
	// };
	// marcador.addLayer(max);

	// var min = new L.Marker(new L.LatLng(51.5044, -0.4376));
	// min.properties = {
	// 	"name": "min",
	// };
	// marcador.addLayer(min);
	var bounds = [[51.5044, -0.4376], [51.6941, 0.114528]];

	//var border = new L.rectangle(bounds, {color: 'gray'}).addTo(map);
	 
	

	// tileLayer._createStyles = function(feature){
	// 	var tube = feature.properties.lines;
	// 			tube = JSON.parse(tube);
	// 			var color = tube[0].colour;
	// 			var tube = feature.properties.lines;
	// 			tube = JSON.parse(tube);
	// 			var name = tube[0].name;
	// 			if (feature.properties.id == 35) {
	// 				return {
	// 					strokeWidth: 3,
	// 					strokeColor: 'blue',
	// 					zIndex: 30

	// 				}
	// 			}
	// 			 // else
	// 				// return {
	// 				// 	strokeWidth: 2,
	// 				// 	strokeColor: color,
	// 				// 	zIndex: 10

	// 				// };
	// }


	
var coordenadas = L.control({position:"bottomright"});
		coordenadas.onAdd = function(){
			var div = L.DomUtil.create('div');
			div.innerHTML +='<p id="divCoord"></p>';
			return div;
		};
		coordenadas.addTo(map);

		map.on('mousemove', function(e) {
		var pos = e.latlng;
		    $("#divCoord").html("" +pos);
		
		});


	//--------------------------------------------------------------------------------------------



}



L.Icon.Default.imagePath = "../dist/images";

window.onload = initMap;