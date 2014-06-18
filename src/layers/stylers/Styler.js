require("./stylers.js");
var PEG = require("../../../lib/pegjs/lib/peg.js");

/**
 * Base class for feature layers' styles processors.
 *
 * @class
 * @abstract
 * 
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.stylers.Styler = L.Class.extend(
/** @lends SMC.layers.stylers.Styler# */
{

	_grammar: null,
	_parser_url: null,
	options: {
		stylesheet: null
	},

	initialize: function(options){
		L.Util.setOptions(this, options);
		var scope = this;
		$.ajax({
		    url: this._parser_url,
		    type: 'get',
		    success: function(response) {
		        scope._grammar = PEG.buildParser(response);
		        scope.parse(scope.options.stylesheet);
		    }
		});
	},

	/**
	* Create a style to pass to feature and depends on zoom
	*
	* @abstract
	* @param {object} feature - An object that represents the geometry element.
	* @param {number} zoom - Number that represents the level zoom to apply the style.
	*/
	_createStyles: function(feature, zomm){
		throw new Error("Must implement this method.");
	},

	/**
	 * Loads a stylesheet definition interpreting the rules so it can be applied to features.
	 * 
	 * Must be implemented in derived classes.
	 *
	 * @abstract
	 * @param {string} stylesheet - An string containing the stylesheet or an url to load the stylesheet from.
	 */
	parse: function(stylesheet) {
		this._createStyles = new Function("feature", "zoom", "var style = {};" + this._grammar.parse(stylesheet) + "return style;");
	},

	/**
	 * Adds style properties to the received features, so the can be represented as intended by the style for the layer.
	 */
	applyStyle: function(features) {
		throw new Error("Must implement this method.");
	}
});
