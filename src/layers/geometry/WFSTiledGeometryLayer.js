require("./TiledGeometryLayer.js");
require("../../providers/WFSProvider.js");

SMC.layers.geometry.WFSTiledGeometryLayer = SMC.layers.geometry.TiledGeometryLayer.extend(
{

 includes: SMC.Util.deepClassInclude([SMC.providers.WFSProvider]),

        initialize: function(options) {
            SMC.layers.geometry.TiledGeometryLayer.prototype.initialize.call(this, options);
            SMC.providers.WFSProvider.prototype.initialize.call(this, options);
            L.Util.setOptions(this, options);
        },

        loadTile: function(bbox){
            return this.doFeaturesLoading(bbox);
        },

        createNodeHTML: function() {
            return this.options.label || this.options.typeName;
        }

	
});

SMC.wfsTiledGeometryLayer = function(options) {
    return new SMC.layers.geometry.WFSTiledGeometryLayer(options);
};