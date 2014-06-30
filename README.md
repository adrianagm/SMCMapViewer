SMCMapViewer
============

SMCMapViewer is a Map Viewer Component based on Leaflet that allow us to create a map viewer of an easily way. Using this tool you can add layers with different data providers like WMS, WFS and markers layers. This tool allows us to add a customer style to all over elements on a layer, from a style description in mapCSS format.

Quick Start Guide
-----------------

This step-by-step guide will quickly get you started on SMCMapViewer basics, including setting up a SMCMapViewer map, working with markers, wfs and wms layers, and adding custom style to objects.

<pre>
<iframe src="http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/index_doc.html" style="width: 100%;height: 300px;"></iframe>
</pre>

[View example on a separate page →](http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/index_doc.html)

### Preparing your page

Before writing any code for the map, you need to do the following preparation steps on your page:

* Include Leaflet CSS file in the head section of your document:

> `<link rel="stylesheet" href="http://rawgit.com/Emergya/SMCMapViewer-dist/master/css/leaflet.css" />`

* Include jQuery JavaScript file:

> `<script src="http://code.jquery.com/jquery-1.11.1.js"></script>`

* Include SMCViewerMap Javascript file:

> `<script src="http://rawgit.com/Emergya/SMCMapViewer-dist/master/smc.viewer-bundle.js"></script>`

* Put a *div* element with a certain id where you want your map to be:

> `<div id="map"></div>`

* Make sure the map container has a defined height, for example by setting it in CSS:

> `#map { height: 180px; }`

Now you’re ready to initialize the map and do some stuff with it.

### Setting up the map

Let’s create a map of the center of Seville with pretty Cloudmade tiles. First we’ll initialize the map and set its view to our chosen geographical coordinates and a zoom level:

	var map = SMC.map('map').setView([37.383333, -5.983333], 11);

By default (as we didn’t pass any options when creating the map instance), all mouse and touch interactions on the map are enabled, and it has zoom and attribution controls.

Next we’ll add a tile layer to add to our map, in this case it’s a Cloudmade tile layer. Creating a tile layer usually involves setting the URL template for the tile images, the attribution text and the maximum zoom level of the layer:

	var base = SMC.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
		maxZoom: 18
	}).addTo(map);

Make sure all the code is called after the div and smc.viewer-bundle.js inclusion. That’s it! You have a working SMCViewerMap map now.

### Add WMS Layer to map

<pre>
<iframe src="http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_wms_layer.html" style="width: 100%;height: 300px;"></iframe>
</pre>

[View example on a separate page →](http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_wms_layer.html)

To add a wms layer to the map we're going to need first of all create the layer. To do that we need the url of the service and the name of the layer that it'll be load.

	var satelite = SMC.wmsLayer("http://www.idee.es/wms/PNOA/PNOA", {
        layers: "PNOA",
        format: 'image/png',
        transparent: true,
        crs: L.CRS.EPSG4326,
        attribution: "Map data © Instituto Geográfico Nacional de España"
    }).addTo(map);

### Add Marker Layer

<pre>
<iframe src="http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_marker_layer.html" style="width: 100%;height: 300px;"></iframe>
</pre>

[View example on a separate page →](http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_marker_layer.html)

Let's create a marker layer to add to map. 

### Add WFS Marker Layer to map

<pre>
<iframe src="http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_wfs_marker_layer.html" style="width: 100%;height: 300px;"></iframe>
</pre>

[View example on a separate page →](http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_wfs_marker_layer.html)

Let's create a wfs marker layer to add to map. To do this we have to know the url service and the typename to get. We also can add a label with the layer name to add to layer tree panel.

	var wfsMarkerLayer = SMC.wfsMarkerLayer({
        serverURL: "http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_WFS_SP_Infraestructuras_Hidraulicas",
        typeName: "edar",
        label: "Prueba WFS"
    }).addTo(map);


### Add Layer Tree to map

<pre>
<iframe src="http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_layer_tree.html" style="width: 100%;height: 300px;"></iframe>
</pre>

[View example on a separate page →](http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_layer_tree.html)

Let's create a map with a layer tree where we could load a serie of layers. First, as we have been before, create a map and after that we are going to create two base layers. 

	var map = SMC.map('map').setView([37.383333, -5.983333], 11);

	var base = SMC.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
		maxZoom: 18
	}).addTo(map);

	var satelite = SMC.wmsLayer("http://www.idee.es/wms/PNOA/PNOA", {
        layers: "PNOA",
        format: 'image/png',
        transparent: true,
        crs: L.CRS.EPSG4326,
        attribution: "Map data © Instituto Geográfico Nacional de España"
    }).addTo(map); 

Next we'll add the layer tree to the map. To do that we need to create a layer tree control and add it the base layers create before.

    var baseLayer = {
        "Street Map": base,
        "Satelite": satelite
    };
    
    var leyenda = SMC.layerTreeControl(baseLayer, {
        collapsed: false
    }).addTo(map);

### Add Layer to Layer Tree Dinamically

<pre>
<iframe src="http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_layer_to_layer_tree.html" style="width: 100%;height: 300px;"></iframe>
</pre>

[View example on a separate page →](http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_layer_to_layer_tree.html)

Once we have added the layer tree panel to the map, we have the possibility to add new layers dinamically to the layer tree. On this way when we add a new layer to map automatically we can see on the layer tree. Simply add a parameter which name is label. We use this one to add a name on the layer tree panel.

	var satelite = SMC.wmsLayer("http://www.idee.es/wms/PNOA/PNOA", {
        layers: "PNOA",
        format: 'image/png',
        transparent: true,
        crs: L.CRS.EPSG4326,
        label: "PNOA",
        attribution: "Map data © Instituto Geográfico Nacional de España"
    }).addTo(map);


### Add Tree Config to Layer Tree from JSON

<pre>
<iframe src="http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_tree_to_layer_tree.html" style="width: 100%;height: 500px;"></iframe>
</pre>

[View example on a separate page →](http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_tree_to_layer_tree.html)
 
Before to add a tree config we need define into html file the next:

* Include LayerTree CSS file in the head section of your document:

> `<link rel="stylesheet" href="http://rawgit.com/Emergya/SMCMapViewer-dist/master/css/layerTree.css" />`

* Include Font Awesome CSS file in the head section of your document:

> `<link href="http://netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">`

To add a structure of a folder and layer set we need to define a variable with the tree config content. This tree config have a specific format that it's composed by folders and layers. To define a folder we need to declare an object with a property type which value was folder. To define a layer we need to declare an object with a property type which value was the layer type, for example if the layer was a WMS layer the type will be SMC.layers.WMSLayer.

Next we'll nedd to define a label to add the name of the layer or folder with a property label which value was the folder or layer name. In the same case for a url layer, if it's a WMS layer we need to add the url property which value will be the url where the layer is.

The rest of parameters that we're going to need, we'll add it to the params property that it'll be an objects array.

An example with the format specified is:

	var tree = [{
    	type: "folder",
    	label: 'REDIAM',
    	layers: [{
        	type: "folder",
        	label: "Paisajes",
        	layers: [{
                type: "SMC.layers.WMSLayer",
                url: "http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_mapa_paisaje_andalucia",
                params: [{
                    layers: "categ_paisaj",
                    format: 'image/png',
                    transparent: true,
                    crs: L.CRS.EPSG4326,
                    attribution: "Map data &copy; REDIAM",
                    label: "Categorias paisajisticas"
                }] 
        	},{
		        type: "folder",
		        label: "Capas WFS",
		        layers: [{
		            type: "SMC.layers.markers.WFSMarkerLayer",
		            params: [{
		                serverURL: "http://www.ideandalucia.es/dea100/wfs",
		                typeName: "ideandalucia:it03_aeropuerto_pun",
		                label: "Prueba WFS",
		                outputFormat: "json"
		            }]
		        }]
	    	}]
    	}]
	}];

To add this configuration to the tree panel it's necessary define before a map and a layer tree panel. Once both are defined we'll add this configuration variable to the map, like this:

		map.loadLayers(tree);


### Add Style to Layer

<pre>
<iframe src="http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_style_to_layer.html" style="width: 100%;height: 300px;"></iframe>
</pre>

[View example on a separate page →](http://rawgit.com/Emergya/SMCMapViewer-dist/master/examples/add_style_to_layer.html)

Before you add the code to add style to layer, we need to define the style format. To do this, we're going to make a string with the style that we want to apply to the layer. The style format will be on mapCSS.

> `var stylesheet = '* {htmlTemplate:"<i class=fa fa-plane fa-2x marker_red></i>";} * |z13- {htmlTemplate:"<i class=fa fa-plane fa-2x marker_blue></i>";}';`
	

Add this style to layer:

	var wfsMarkerLayer = SMC.wfsMarkerLayer({
        serverURL: "http://www.ideandalucia.es/dea100/wfs",
        typeName: "ideandalucia:it03_aeropuerto_pun",
        label: "Prueba WFS",
        outputFormat: "json",
        stylesheet: stylesheet
    }).addTo(map);
