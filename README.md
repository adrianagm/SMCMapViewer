SMCMapViewer
============

SMCMapViewer is a Map Viewer Component based on Leaflet that allow us to create a map viewer of an easily way. Using this tool you can add layers with different data providers like WMS, WFS and markers layers. This tool allows us to add a customer style to all over elements on a layer, from a style description in mapCSS format.

Quick Start Guide
-----------------

This step-by-step guide will quickly get you started on SMCMapViewer basics, including setting up a SMCMapViewer map, working with markers, wfs and wms layers, and adding custom style to objects.

<pre>
<iframe src="../test/doc_examples/index_doc.html" style="width: 100%;height: 300px;"></iframe>
</pre>

[View example on a separate page →](http://emergya.github.io/SMCMapViewer/test/doc_examples/index_doc.html)

### Preparing your page

Before writing any code for the map, you need to do the following preparation steps on your page:

* Include Leaflet CSS file in the head section of your document:

> `<link rel="stylesheet" href="path_to_SMCMapViewer/lib/leaflet/leaflet.css" />`

* Include jQuery JavaScript file:

> `<script src="path_to_jquery"></script>`

* Include SMCViewerMap Javascript file:

> `<script src="path_to_SMCMapViewer/dist/smc.viewer-bundle.js"></script>`

* Put a *div* element with a certain id where you want your map to be:

>`<div id="map"></div>`

* Make sure the map container has a defined height, for example by setting it in CSS:

> `#map { height: 180px; }`

Now you’re ready to initialize the map and do some stuff with it.

### Setting up the map

Let’s create a map of the center of London with pretty Cloudmade tiles. First we’ll initialize the map and set its view to our chosen geographical coordinates and a zoom level:

> `var map = SMC.map('map').setView([37.383333, -5.983333], 11);`

By default (as we didn’t pass any options when creating the map instance), all mouse and touch interactions on the map are enabled, and it has zoom and attribution controls.

Next we’ll add a tile layer to add to our map, in this case it’s a Cloudmade tile layer. Creating a tile layer usually involves setting the URL template for the tile images, the attribution text and the maximum zoom level of the layer:

<pre>
	<code>
	SMC.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
		maxZoom: 18
	}).addTo(map);
	</code>
</pre>

Make sure all the code is called after the div and smc.viewer-bundle.js inclusion. That’s it! You have a working SMCViewerMap map now.

