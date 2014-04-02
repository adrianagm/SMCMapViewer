require("./Styler.js");
require("../../../lib/LeafletHtmlIcon.js");
require("../../../lib/mustache.js/mustache.js");


/**
 * Parser of MarkerCSS, for user with SMC Viewer's marker layers.
 *
 * @class
 * @extends SMC.layers.stylers.Styler
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.stylers.MarkerCssStyler = SMC.layers.stylers.Styler.extend(
	/** @lends SMC.layers.stylers.MarkerCssStyler# */
	{

		applyStyle: function(properties, zoom) {

			var style = this._createStyles(properties, zoom);

			var icon, width, height, anchorLeft, anchorTop;

			width = style.markerWidth || -1;
			height = style.markerHeight || -1;

			anchorLeft = style.anchorLeft || 0;
			anchorTop = style.anchorTop || 0;

			var disableClustering = !!style.disableClustering;

			if (style.iconUrl) {
				// Load normal marker icon with the specified url.
				if (!L.Util.isArray(style.iconUrl)) {
					style.iconUrl = [style.iconUrl];
				}

				icon = new L.icon({
					iconUrl: style.iconUrl,
					iconSize: [width, height],
					iconAnchor: [anchorLeft, anchorTop]
				});

			} else if (style.templateUrl) {
				// Load the given page from its url in an iframe.
				if (!L.Util.isArray(style.templateUrl)) {
					style.templateUrl = [style.templateUrl];
				}

				icon = new L.HtmlIcon({
					html: "<iframe src=" + style.templateUrl + ' style=" width:' + width + 'px;height:' + height + 'px;margin-top:-' + anchorTop + 'px;margin-left:-' + anchorLeft + 'px"/>',

				});


			} else if (style.htmlTemplate) {
				// Load the template into the marker.
				// TODO: "inflate the template" using mustache.
				var data = {
					name: properties.name,
					id: properties.id,
					colour: properties.colour

				};

				var output = Mustache.render(style.htmlTemplate, data);

				var container = '<div style=" width:' + width + 'px;height:' + height + 'px;margin-top:-' + anchorTop + 'px;margin-left:-' + anchorLeft + 'px">' + output + "</div>";

				icon = new L.HtmlIcon({
					html: container
				});

			} else if (style.iconClassName) {
				icon = L.icon({
					className: style.iconClassName,
					iconAnchor: [anchorLeft, anchorTop]
				});
			} else {
				// throw new Error("No display style for the marker found!");
				//markerCluster class by default

				icon = L.icon({
					className: "marker-cluster-large",
					iconAnchor: [anchorLeft, anchorTop]
				});
			}

			return {
				icon: icon,
				disableClustering: disableClustering
			};

		},

		_createStyles: function(properties) {
			throw new Error("Not implemented, needs parser");

		},


		addPopUp: function(marker) {
			var style = this._addContentPopUp(marker.properties);
			var content;
			if (style.popUpTemplate) {
				var data = {
					name: marker.properties.name,
					id: marker.properties.id,
					colour: marker.properties.colour

				};

				var output = Mustache.render(style.popUpTemplate, data);

				content = output;

			} else if (style.popUpUrl) {

			} else {
				content = marker.properties;
			}

			return content;
		},

		_addContentPopUp: function(properties) {
			return properties.name;
		}
	});