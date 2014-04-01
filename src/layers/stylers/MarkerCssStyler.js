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

		applyStyle: function(properties) {

			var style = this._createStyles(properties);

			var icon;
			if (style.iconUrl) {
				// Load normal marker icon with the specified url.
				icon = new L.icon({
					iconUrl: style.iconUrl
				});

			} else if (style.templateUrl) {
				// Load the given page from its url in an iframe.

				icon = new L.HtmlIcon({
					html: "<iframe src="+style.templateUrl+" />"
				});
				

			} else if (style.htmlTemplate) {
				// Load the template into the marker.
				// TODO: "inflate the template" using mustache.

				var output = Mustache.render(style.htmlTemplate[0], style.htmlTemplate[1]);

				icon = new L.HtmlIcon({
					html: output
				});

			} else {
				// throw new Error("No display style for the marker found!");
				//markerCluster class by default
				
				icon = L.icon({
					className: "marker-cluster-large"
				});
			}


			return icon;
		},

		_createStyles: function(properties) {
			throw new Error("Not implemented, needs parser");

		}
	});