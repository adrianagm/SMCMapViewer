/**
 * Base class for SMC viewer's layer reloader triggers.
 * 
 * @class 
 * @abstract
 * @extends L.Class
 * @mixes L.Mixin.Events
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.reloaders.ReloadTrigger = L.Class.extend(
/** @lends SMC.layers.reloaders.ReloadTrigger# */
{
	includes: [L.Mixin.Events],

	/**
	 * Initializes the trigger so it will monitor for the need of a reload.
	 * 
	 * @abstract
	 */
	initTrigger: function() {
		throw new Error("ReloadTrigger::initTrigger: classes extending ReloadTrigger must implement this method.");
	},

	/**
	 * Helper method to hide the launching of the event from implementing classes.
	 *
	 * @protected
	 * @fires SMC.layers.reloaders.ReloadTrigger#reloadTriggered
	 */
	_notifyReload : function() {
		/**
		 * Layer reload event. SMC.layers.reloaders.LayerReloader will listen for this event and then reload the layer.
		 *
		 * @event SMC.layers.reloaders.ReloadTrigger#reloadTriggered
		 */
		this.fire("reloadTriggered");
	}

});