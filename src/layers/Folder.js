require("./layers.js");
require("../controls/layerTree/LayerTreeFolder.js");
require("../LayerLoader.js");

/**
 * Base class for folder.
 * @class
 * @abstract
 */
SMC.layers.Folder = L.LayerGroup.extend(
    /** @lends SMC.layers.Folder# */
    {

        includes: SMC.Util.deepClassInclude([SMC.controls.layerTree.LayerTreeFolder, SMC.LayerLoader]),

        initialize: function(options) {
            L.Util.setOptions(this, options);
            L.LayerGroup.prototype.initialize.call(this, options);
            SMC.controls.layerTree.LayerTreeFolder.prototype.initialize.call(this, options);

            if (options.layersConfig) {
                // We use the LayerLoader functionality.
                this.loadLayers(options.layersConfig);
            } else if (options.layers) {
                for (var i = 0; i < options.layers.length; i++) {
                    options.layers[i].addTo(this);
                    options.layers[i].parent = this;
                }
            } else {
                throw new Error("SMC.layers.Folder::initialize: Either layersConfig or layers must be passed as an initialization option!");
            }
        }
    });
