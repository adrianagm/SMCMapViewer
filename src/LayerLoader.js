require("./SMC.js");
/**
 * Class able of creating SMC Viewer layer objects from configuration.
 * @class
 * @abstract
 * @mixin
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.LayerLoader = L.Class.extend(
    /** @lends SMC.layers.LayerLoader# */
    {

        loadedLayers: {},

        /**
         * Creates layers from a Javascript object (or its javascript reprsentantion) defining the type and options of the layers to be loaded.
         *
         *
         *  @param layersConfig Object | JSON
         */
        loadLayers: function(layersConfig) {
            if (!layersConfig) {
                throw new Error("SMC.layers.LayerLoader::loadLayers: no layers config received");
            }

            if (typeof layersConfig == "string") {
                layersConfig = JSON.parse(layersConfig);
            }

            if (!L.Util.isArray(layersConfig)) {
                throw new Error("SMC.layers.LayerLoader::loadLayers: layers config is not an array");
            }

            for (var i = 0; i < layersConfig.length; i++) {
                var layerConfig = layersConfig[i];
                this._loadLayerConfig(layerConfig, i + 1);
            }
        },

        _loadLayerConfig: function(layerConfig, idx) {
            var type = layerConfig.type;
            var layer = null;
            if (!type) {
                throw new Error("SMC.layers.LayerLoader::_loadLayerConfig: layer config in position " + idx + " doesn't define a type");
            } else if (typeof type != "string") {
                throw new Error("SMC.layers.LayerLoader::_loadLayerConfig: layer config in position " + idx + " doesn't define a type as a class name string.");
            }

            var params = {};
            if (layerConfig.params) {
                params = layerConfig.params;
            }

            if (typeof params == "string") {
                params = JSON.parse(params);
            }

            if (!layerConfig.params && layerConfig.label) {
                params = [{
                    label: layerConfig.label
                }];
            }


            // We traverse the speficied class 'packages' from the root (window) to obtain the actual class object.
            var typePaths = type.split(".");
            var layerClass = window;
            for (var i = 0; i < typePaths.length; i++) {
                layerClass = layerClass[typePaths[i]];
            }

            if (!layerClass.prototype) {
                throw new Error("SMC.layers.LayerLoader::_loadLayerConfig: layer config in position " + idx + " defined type '" + type + "' is not a valid class");
            }


            // Class instantiation code from http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            var createClass = (function() {
                function F(args) {
                    return layerClass.apply(this, args);
                }
                F.prototype = layerClass.prototype;

                return function(args) {
                    return new F(args);
                };
            })();

            layer = createClass(params);

            // The layer loader is mixed in into a map (or Folder) so we can add layers to that.
            layer.addTo(this);

            // The loader (that is, the map or Folder) is the layer's parent 
            layer.parent = this;

            var id;
            if (layerConfig.id) {
                id = layerConfig.id;
            } else {
                id = "layer" + idx;
            }

            this.loadedLayers[id] = layer;
        }
    });
