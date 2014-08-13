require("./stylers.js");
/**
 * Global variable that represents PEG library functionality to parser a style string
 * @property {PEG} - PEG variable
 */
var PEG = require("../../../lib/pegjs/lib/peg.js");


require("./StyleParser.js");

/**
 * Global variable that represents mustache library functionality
 * @property {mustache} - mustache variable
 */
var Mustache = require("../../../lib/mustache.js/mustache.js");

/**
 * Base class for feature layers' styles processors.
 *
 * @class
 * @abstract
 * @extends L.Class
 * @param {SMC.layers.stylers.Styler~options} options - The configuration for the class
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.stylers.Styler = L.Class.extend(
	/** @lends SMC.layers.stylers.Styler# */
	{

		_grammar: null,
		_parser_url: null,
		/**
		 * @typedef {Object} SMC.layers.stylers.Styler~options
		 * @property {string} stylesheet=null - The style set to apply
		 * @property {string} stylesheetURL=null - The style set url to apply
		 */
		options: {
			stylesheet: null,
			stylesheetURL: null,
			generateParser: false,
		},

		/**
		 * Initialize the object with the params
		 * @param {object} options - default options
		 */
		initialize: function(options) {
			L.Util.setOptions(this, options);

			if (this.options.generateParser) {
				var scope = this;
				$.ajax({
					url: this._parser_url,
					type: 'get',
					success: function(response) {
						scope._grammar = PEG.buildParser(response);
						scope._parseStyles();
					}
				});

			} else {
				this._grammar = SMC.layers.stylers.StylerParser;
				this._parseStyles();
			}


		},

		_parseStyles: function() {
			if (this.options.stylesheetURL) {
				$.ajax({
					url: this.options.stylesheetURL,
					type: 'get',
					success: function(response) {
						this.parse(response);
					}
				});
			} else if (this.options.stylesheet) {
				this.parse(this.options.stylesheet);
			} else {
				// We return default empty styles if we have no config.
				this._createStyles = function() {
					return {};
				};
			}
		},

		/**
		 * Create a style to pass to feature and depends on zoom
		 *
		 * @abstract
		 * @private
		 * @param {object} feature - An object that represents the geometry element.
		 * @param {string} zoom - Number that represents the level zoom to apply the style.
		 */
		_createStyles: function(feature, zoom) {
			throw new Error("SMC.layers.stylers.Styler::_createStyles: Error, no _createStyles styles was found, did you specify a parser with a derivate class?");
		},

		/**
		 * Loads a stylesheet definition interpreting the rules so it can be applied to features.
		 *
		 * Must be implemented in derived classes.
		 *
		 * @abstract
		 * @param {string} stylesheet - A string containing the stylesheet or an url to load the stylesheet from.
		 */
		parse: function(stylesheet) {
			var stylesFuncBody;
			try {
				stylesFuncBody = this._grammar.parse(stylesheet);
			} catch (e) {
				console.debug(e);
				return;
			}

			this._createStyles = new Function("feature", "zoom", "var style = {};" + stylesFuncBody + "return style;");
		},

		/**
		 * Adds style properties to the received features, so the can be represented as intended by the style for the layer.
		 * @param {object} feature - An object that represents the geometry element being styled.
		 * @param {string} zoom - Number that represents the level zoom to apply the style.
		 */
		applyStyle: function(feature, zoom) {
			throw new Error("SMC.layers.stylers.Styler::applyStyle: Derivate classes must implement this method.");
		},


		_contentFromTemplate: function(feature, template) {
			var defaultTemplate = false;
			if (!template) {
				defaultTemplate = true;
			}


			var data = {};
			if (this.options.featureId) {
				data.$id = feature[this.options.featureId];
				if (defaultTemplate) {
					template += "$id: <b>{{$id}}</b><br>";
				}
			}

			for (var propKey in feature.properties) {
				data[propKey] = feature.properties[propKey];
				if (defaultTemplate) {
					template += propKey + ": <b>{{" + propKey + "}}</b><br>";
				}
			}

			var output = Mustache.render(template, data);
			return output;
		}
	});