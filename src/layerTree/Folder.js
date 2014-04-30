require("../layers/layers.js");
require("./LayerTreeLeaf.js");

/**
 * Base class for folder.
 * @class 
 * @abstract
 */
SMC.layertrees.Folder = L.Marker.extend(
/** @lends SMC.layertrees.Folder# */
{

	includes: SMC.Util.deepClassInclude([SMC.layertrees.LayerTreeFolder]),

	initialize: function(options){
		L.Util.setOptions(this, options);
		SMC.layertrees.LayerTreeFolder.prototype.initialize.call(this, options);
	},

	/**
	 * Implementations of FeatureProvider must contain an override of this method, so features can be loaded from their source.
	 * @abstract
	 */
	onAdd: function(map) {
		this._map = map;

        // create a DOM element and put it into one of the map panes
        this._el = L.DomUtil.create('div', 'my-custom-layer leaflet-zoom-hide');
        map.getPanes().overlayPane.appendChild(this._el);

        // add a viewreset event listener for updating layer's position, do the latter
        /*map.on('viewreset', this._reset, this);
        this._reset();*/
	},

	onRemove: function (map) {
        // remove layer's DOM elements and listeners
        map.getPanes().overlayPane.removeChild(this._el);
        map.off('viewreset', this._reset, this);
    },

    _reset: function () {
        // update layer's position
        var pos = this._map.latLngToLayerPoint(this._latlng);
        L.DomUtil.setPosition(this._el, pos);
    }
});