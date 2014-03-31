require("./Styler.js");
require("../../../lib/LeafletHtmlIcon.js");

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

	applyStyle: function(properties){
		 
		var myStyle =  new L.HtmlIcon({
				    html : "<div style='background:blue;'>2</div>",
				});
		if(properties.name == "Marcador 1"){
			myStyle =  new L.HtmlIcon({
				    html : "<div style='background:red;'>1</div>",
				});

		}

		return myStyle;
	}

});
