/**
 * Base class for layer data providers getting updates to features in real time.
 * @class
 * @abstract
 * @extends L.Class
 * @mixes L.Mixin.Events
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.providers.FeatureHistory = L.Class.extend(
	/** @lends SMC.providers.FeatureHistory# */ 
	{
		/** @private */
		_featuresByDate : {},

		/**
		 * Adds an history point to the feature history
		 * @param {Date} date - The date the history point occurs.
		 * @param {Array.<SMC.providers.Feature>} features - The features associated to the history point.
		 */
		addHistoryPoint : function(date, features)	{
			this._featuresByDate[date] = features;
		},

		/**
		 * Removes the history point given its date.
		 * @param {Date} date - The date that will removed from the history, together with its associated features.
		 */
		removeHistoryPoint: function(date) {
			delete this._featuresByDate[date];
		},

		/**
		 * Allows access to the features, grouped by date.
		 * @returns {Object.<Date, Array.<SMC.providers.Feature>>} The feature history points in the history.
		 */
		getHistoryPoints : function() {
			return this._featuresByDate;
		}
	}
);