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

	///nuevo...............................................	

	var marcador1_geojson = {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [51.5, -0.09]
		},
		"properties": {
			"name": "Marcador 1",
			"id": "1",
			"colour": "red"
		}
	};

	L.circleMarker([51.495, -0.083], 20).addTo(map);

	var marcador2_geojson = {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [51.495, -0.083]
		},
		"properties": {
			"name": "Marcador 2",
			"id": "2",
			"colour": "blue"
		}
	};



	var marcador = new SMC.layers.markers.MarkerLayer({
		
	});



	marcador.STYLER._createStyles = function(properties, zoom) {
		
		//template URL
		/*if (zoom >= 13) {
			// Charlton Heston :)
			var url = "http://replygif.net/i/735.gif";
			return {
				templateUrl: url,
				markerWidth: 344,
				markerHeight: 200,
				anchorLeft: 172,
				anchorTop: 100
			};

		}
		//html template
		else if (zoom < 13 && zoom >= 9) {*/
			var template = "<div style='text-align:center'><b style='color:{{colour}}'>{{name}}</b></div>";

			return {
				htmlTemplate: template,
				markerWidth:120,
				anchorTop:8,
				anchorLeft:60,
				disableClustering: true
			};
		/*}

		//icon URL
		else {
			// Red marker
			var url = "http://pixabay.com/static/uploads/photo/2012/04/26/19/04/red-42871_150.png";

			return {
				iconUrl: url,
				markerWidth:50,
				markerHeight:40,
				anchorTop:40,
				anchorLeft:12
			};
		}*/
	};

	marcador.STYLER._addContentPopUp = function(marker){
		var template = "Nombre: <b>{{name}}</b><br>Id: {{id}}<br>";
		return {
			popUpTemplate: template
		} 
	}

	



	//marcador.addTo(map);
	map.addLayer(marcador);

	marcador.addMarkerFromFeature(marcador2_geojson, marcador2_geojson);
	marcador.on("featureClick", function(f) {
		//alert(f.properties.name);
	});





	var baseLayer = {
		"Street Map": base,
		"Satelite": satelite
	};
	var dataLayer = {
		//"Carreteras": carreteras,
		//"L&iacutemite": limite
	};

	var leyenda = L.control.layers(baseLayer, null, {
		collapsed: false
	}).addTo(map);


	//................................................................................

}



window.onload = initMap;