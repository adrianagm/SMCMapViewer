function initMap() {

	// Centered in London
	var map = SMC.map('map');
	//map.setView([-0.2298500, -78.5249500], 8)
	map.setView([51.5135587, 0.26855], 9);



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

	L.circleMarker([51.495, -0.083], 20).addTo(map);
	L.circleMarker([51.5, -0.09], 20).addTo(map);

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

		//template URL
		if (zoom >= 18) {
			// Charlton Heston :)
			var url = "http://replygif.net/i/735.gif";
			return {
				iconClassName: "marker-blue",
				//templateUrl: url,				
				//disableClustering: true
			};

			//html template
		} else if (zoom < 18 && zoom >= 15) {
			var template = "<div style='text-align:center'><b style='color:{{colour}}'>{{name}}</b></div>";

			return {
				htmlTemplate: template,
				markerWidth: 65,
				anchorTop: 8,
				anchorLeft: 33,
				//disableClustering: true
			};
		}

		//html template
		else if (zoom < 15 && zoom >= 10) {
			var template = "<div style='text-align:center'><b style='color:{{colour}}'>{{name}}</b></div>";

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
			var url = "http://pixabay.com/static/uploads/photo/2012/04/26/19/04/red-42871_150.png";

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

	marcador.addMarkerFromFeature(marcador2_geojson, marcador3_geojson, marcador1_geojson, marcador1_geojson);
	marcador.on("featureClick", function(f) {
		alert(f.properties.name);
	});

	L.circleMarker([51.5, -0.39], 20).addTo(map);
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


	var geometry = new SMC.layers.geometry.GeometryLayer({

	});

	var geometry2 = new SMC.layers.geometry.GeometryLayer({

	 });
	geometry.load = function() {};
	geometry2.load = function() {};

	geometry.setZIndex(1000);
	geometry2.setZIndex(1001);

	$.ajax({

		url: 'http://adriana-4.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM tfl_lines',

		dataType: "json",
		success: function(response) {
			geometry.addTo(map);
			var features = response.features;
			geometry.features = features;
			geometry.render();
			geometry2.addTo(map);
			
			geometry2.features = features;
			geometry2.render();

		}
	});



	// var geometry2 = new SMC.layers.geometry.GeometryLayer({

	// });
	// geometry2.load = function() {};

	// geometry2.setZIndex(1000);

	// $.ajax({

	// 	url: 'http://adriana-4.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM tfl_stations',

	// 	dataType: "json",
	// 	success: function(response) {
	// 		geometry2.addTo(map);
	// 		var features = response.features;
	// 		geometry2.features = features;
	// 		geometry2.render();

	// 	}
	// });



	geometry._createStyles = function(feature, zoom) {
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
				
					return {
						strokeWidth: 3,
						strokeColor: color,
						offset: 3

					};

				break;

			case 'Polygon':
			case 'MultiPolygon':
				return {

					strokeColor: 'blue',
					offset: 10

				};
				break;
		}

	};



	/*geometry._addContentPopUp = function(feature, zoom) {

			var template = "Nombre: <b>{{name}}</b><br>Id: {{id}}<br>";

			return {
				popUpTemplate: template

			};


	};*/

	/*geometry._createLabel = function(feature) {
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
					//uniqueLabel: true
					
				};


			case 'Polygon':
			case 'MultiPolygon':
			var area = feature.properties.descript0;
				return {
					content: area
				};
		}
	};*/


	//--------------------------------------------------------------------------------------------



}



L.Icon.Default.imagePath = "../dist/images";

window.onload = initMap;