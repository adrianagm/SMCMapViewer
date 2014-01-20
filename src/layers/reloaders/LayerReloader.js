/**
 * Layer reloader. Allows setting triggers so a layer's data can be re-retrieved from its original data.
 * 
 * Intended for being mixed in into a SMC.layer.SingleLayer.
 * 
 * @class 
 * @mixin
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.reloaders.LayerReloader = L.Class.extend(
/** @lend SMC.layers.reloaders.LayerReloader */
{
	_triggers : [],

	/**
	 * 
	 */
	addReloadTrigger: function(trigger) {
		this._triggers.push(trigger);
		trigger.on("reloadTriggered", this._onReloadTriggered,this);
	},


	_onReloadTriggered : function() {
		// Reloads the layer.
		this.load();
	}
});