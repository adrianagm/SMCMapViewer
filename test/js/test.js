function initMap() {

	// Centered in London
	var map = SMC.map('map');
	//map.setView([-0.2298500, -78.5249500], 8)
	//map.setView([51.5135587, 0.26855], 9);
	map.setView([40.25, -102.21], 5);



	var base = SMC.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>',
		maxZoom: 18
	}).addTo(map);

	var satelite = L.tileLayer.wms("http://maps.opengeo.org/geowebcache/service/wms", {
		layers: "bluemarble",
		format: 'image/png',
		transparent: true,
		attribution: "Weather data Â© 2012 IEM Nexrad"
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
	var self;

	var geometry = new SMC.layers.geometry.WFSGeometryLayer({	
			id: 'id',
			draggingUpdates: true,
			serverURL: 'http://demo.opengeo.org/geoserver/wfs',
			//typeName: 'ne_10m_roads',
			typeName: 'states'
			//cql_filter:"sov_a3 ='USA' AND type = 'Major Highway'"

	});

	// geometry.load = function() {};
	
	 geometry.setZIndex(1000);


	// var geometry_geojson = {
	// 	"type": "Feature",
	// 	"geometry": {
	// 		"type": "Point",
	// 		"coordinates": [-0.39, 51.395]
	// 	},
	// 	"properties": {
	// 		"name": "Marcador 3",
	// 		"id": "1",
	// 		"colour": "green"
	// 	}
	// };

	// var geometry_geojson2 = {
	// 	"type": "Feature",
	// 	"geometry": {
	// 		"type": "Point",
	// 		"coordinates": [-0.39, 51.355]
	// 	},
	// 	"properties": {
	// 		"name": "Marcador 3",
	// 		"id": "2",
	// 		"colour": "green"
	// 	}
	// };



	
	//geometry.addGeometryFromFeatures(geometry_geojson);
	//geometry.addTo(map);

	// $.ajax({

	// 	url: 'http://adriana-4.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM tfl_lines',


	//  	dataType: "json",
	//  	success: function(response) {
	//  		var features = response.features;

	//  		//geometry.addGeometryFromFeatures(features);
	//  		geometry.addTo(map);
	//  		//updateFeatures(features);

	//  		//geometry.render();

	//  	}
	// });

	


	geometry._createStyles = function(feature){

			return {
		 		strokeWidth: 3,
	 			strokeColor: feature.properties.color	

			};
		
	}
	


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
				else{
					if (feature.clicked) {
						return {
							
							fillColor: 'aqua',
							zIndex: 10

						}
					}
					else{
						return {
							fillColor: 'red',
							symbol: 'RegularPolygon',
							sides: 5

						}
					}
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
				if (feature.clicked) {
						return {
							strokeWidth: 3,
							strokeColor: 'aqua',
							zIndex: 10

						}
					}
				 else
					return {
						
						strokeColor: color,
						offset: 4,
						

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

	//geometry._createStyles = geomStyles;
	

	geometry.on("featureClick", function(event) {
		
		for(var i = 0; i < this.features.length; i++){
			if(this.features[i].selected){
				this.features[i].selected = false;
				this.updateFeature(this.features[i]);
			}
		}
		
		event.feature.selected = true;
		
		
	});
	

	geometry.on("layerLoad", function(event){
		self = this;
		updateFeatures(event.features);
	})




	// geometry._createLabel = function(feature) {
	// 	var type = feature.geometry.type;
	// 	switch (type) {
	// 		case 'Point':
	// 		case 'MultiPoint':
	// 			var station = feature.properties.name;
	// 			return {
	// 				content: station
	// 			};


	// 		case 'LineString':
	// 		case 'MultiLineString':
	// 			var tube = feature.properties.lines;
	// 			tube = JSON.parse(tube);
	// 			var label = tube[0].name;

	// 			return {
	// 				content: label,
	// 				uniqueLabel: true

	// 			};


	// 		case 'Polygon':
	// 		case 'MultiPolygon':
	// 			var area = feature.properties.descript0;
	// 			return {
	// 				content: area
	// 			};
	// 	}
	// };

	

	//.................tiled geometry...................
	// var tileLayer = new SMC.layers.geometry.TiledGeometryLayer({
	// 	id: 'cartodb_id'
	// });

	var tileLayer = new SMC.layers.geometry.WFSTiledGeometryLayer({
		idField: 'id',
		serverURL: 'http://demo.opengeo.org/geoserver/wfs',
		typeName: 'states',
		cql_filter: "STATE_NAME LIKE 'N%'",
		// typeName: 'ne_10m_roads',
		// cql_filter:"sov_a3 ='USA' AND type = 'Major Highway'",
		zoomOffset : 0,
		tileSize: 256,
		draggingUpdates: true

	});



	// tileLayer.load = function() {};
	

	// tileLayer.createRequest = function(bounds) {
	// 	var url = 'http://adriana-4.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM tfl_lines WHERE the_geom %26%26 ST_SetSRID (ST_MakeBox2D(ST_Point('+bounds[0]+','+bounds[1]+'), ST_Point('+bounds[2]+','+ bounds[3]+')),4326)';

	// 	return {
	// 		url: url,
	// 		dataType:"json",
	// 	};
	// };

	tileLayer.addTo(map);
	tileLayer.setZIndex(1000);
	
	
	// tileLayer.on("layerLoad", function(event){
	// 	self = this;
	// 	updateFeatures(event.features);
	// });


	// tileLayer._createStyles = function(feature){
 //        var tube = feature.properties.lines;
	// 	tube = JSON.parse(tube);
	// 	var color = tube[0].colour;
	// 	var tube = feature.properties.lines;
	// 	tube = JSON.parse(tube);
	// 	var name = tube[0].name;
		
	// 	if (feature.selected) {
	// 		return {
	// 			strokeWidth: 3,
	// 			strokeColor: 'aqua',
	// 			zIndex: 10
				

	// 		}
	// 	}

	// 	 else
	// 		return {
	// 			strokeWidth: 2,
	// 			strokeColor: color,
				

	// 		};
	// }

	tileLayer._createStyles = function(feature){
		if(feature.selected){
			return {
		 		strokeWidth: 3,
		 		strokeColor: feature.properties.color,
	

			};
		}
		else{
			return {
		 		strokeWidth: 3,
		 		strokeColor: feature.properties.color,
	 			opacity: 0.5,
	 			noPopUp: true	

			};
		}
	}



	tileLayer.on("featureClick", function(event) {
		var select = false;

		
		for(var i = 0; i < this.features.length; i++){
			if(event.feature.id == this.features[i].id){
				if(this.features[i].selected){
					select = true;
				}
				
			}
			if(this.features[i].selected){
				this.features[i].selected = false;
				this.updateFeature(this.features[i]);
			}
	
		}

		if(!select){
			event.feature.selected = true;
	 
		}

	});

	
	

	
	var colors = ["red","yellow","green"];
	
	var updateFeatures = function(features) {
		var feature = features[Math.floor(Math.random()*features.length)];
		
		feature.properties.color = colors[ Math.floor(Math.random()*colors.length)];
		self.updateFeature(feature);


		var updateInterval = parseInt($("#updateInterval").val());
		$("#intervalLabel")[0].innerHTML = "Update interval ("+updateInterval+"ms)";
		setTimeout(function() {
			updateFeatures(features);
		}, updateInterval);
	};
	


	var sliderControl = L.control({position:"bottomleft"});

	sliderControl.onAdd = function() {
		var div = L.DomUtil.create('div', 'leaflet-bar leaflet-update-interval');
		div.innerHTML+='<label for="updateInterval" id="intervalLabel">Update interval (1000ms):</label> <input id="updateInterval" min="100" max="2000" type="range" step="100" value="1000"/>'

		L.DomEvent.addListener(div, 'mousedown', L.DomEvent.stopPropagation);
		L.DomEvent.addListener(div, 'mouseup', L.DomEvent.stopPropagation);

		L.DomEvent.addListener(div, 'touchstart', L.DomEvent.stopPropagation);
		L.DomEvent.addListener(div, 'touchend', L.DomEvent.stopPropagation);

		return div;
	};

	sliderControl.addTo(map);


	
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