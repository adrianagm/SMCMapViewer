
require("./GeometryLayer.js");
require("../../providers/WFSProvider.js");

SMC.layers.geometry.WFSGeometryLayer = SMC.layers.geometry.GeometryLayer.extend(
{

 includes: SMC.Util.deepClassInclude([SMC.providers.WFSProvider]),

        initialize: function(options) {
            SMC.layers.geometry.GeometryLayer.prototype.initialize.call(this, options);
            SMC.providers.WFSProvider.prototype.initialize.call(this, options);
            L.Util.setOptions(this, options);
        },

        onFeaturesLoaded: function(features) {
            this.addGeometryFromFeatures(features);
        },

        load: function() {
            this.loadFeatures();
        },

        createNodeHTML: function() {
            return this.options.label || this.options.typeName;
        }

	
});

SMC.wfsGeometryLayer = function(options) {
    return new SMC.layers.geometry.WFSGeometryLayer(options);
};