/**
 * Base class for feature layers' styles processors.
 *
 * @class
 * @abstract
 * 
 * @author Luis Román (lroman@emergya.com)
 */
SMC.styler.Styler = L.Class.extend(
/** @lends SMC.styler.Styler# */
{
	/**
	 * Loads a stylesheet definition interpreting the rules so it can be applied to features.
	 * 
	 * Must be implemented in derived classes.
	 *
	 * @abstract
	 * @param {string} stylesheet - An string containing the stylesheet or an url to load the stylesheet from.
	 */
	parse: function(stylesheet) {
		throw new Error("Styler::parse must be implemented in derived classes!");
	},

	/**
	 * Adds style properties to the received features, so the can be represented as intended by the style for the layer.
	 */
	applyStyle: function(features) {
		throw new Error("Must implement this method.");
	}
});