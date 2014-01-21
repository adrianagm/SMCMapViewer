SMC.layers.reloaders.TimerReloadTrigger = SMC.layers.reloaders.ReloadTrigger.extend(
/** @lends SMC.layers.reloaders.TimerReloadTrigger# */
{
	/**
	 * @typedef {Object} SMC.layers.reloaders.TimerReloadTrigger~options
	 * @property {int} triggerDelay=5000 - The delay beetween a reload is triggered
	 */
	options : {
		triggerDelay : 5000
	},

	/**
	 * Implementation of a SMC viewer's layer reload trigger using calls to JavaScript's setTimeout function.
	 *
	 * @constructs	 
	 * @extends SMC.layers.reloaders.ReloadTrigger
	 * @param {SMC.layers.reloaders.TimerReloadTrigger~options} options - The configuration for the 
	 *
	 * @author Luis Román (lroman@emergya.com)
	 */
	initialize: function(options) {
		L.Util.setOptions(this, options);
	},

	/**
	 * Implementation of the initTrigger method using setTimeout.
	 */
	initTrigger: function() {
		setTimeout(function(){
			this._notifyReload();

			// We start the process again.
			this.initTrigger();
		}, this.options.triggerDelay);
	}

});