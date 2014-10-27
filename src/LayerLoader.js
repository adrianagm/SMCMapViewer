require("./SMC.js");
/**
 * Class able of creating SMC Viewer layer objects from configuration.
 * @class
 * @abstract
 * @mixin SMC.LayerLoader
 * @extends L.Class
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
         * @method
         * @param {(Object|JSON)} layersConfig - Configuration to load a layer
         */
        loadLayers: function(layersConfig) {
            if (!layersConfig) {
                throw new Error("SMC.layers.LayerLoader::loadLayers: no layers config received");
            }

            if (typeof layersConfig === "object" && layersConfig.url) {
                var self = this;
                $.ajax({
                    url: layersConfig.url,
                    dataType: "json",
                    success: function(data, textStatus, jqXHR) {
                        self._loadJsonArray(data);
                    }
                });
            } else {
                this._loadJsonArray(layersConfig);
            }
        },

        _loadJsonArray: function(layersConfig) {
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

            var params = [];
            var url = "";

            if (type === "folder") {
                // Folders are a special case in which we allow a shortcut to ease configuration.
                layerClass = SMC.layers.Folder;
                if (!layerConfig.layers) {
                    throw new Error("SMC.layers.LayerLoader::_loadLayerConfig: layer config in position " + idx + " is of type 'folder' but doesn't define a layers array.");
                }
                if (!layerConfig.label) {
                    throw new Error("SMC.layers.LayerLoader::_loadLayerConfig: layer config in position " + idx + " is of type 'folder' but doesn't define a label property.");
                }
                params = [{
                    layersConfig: layerConfig.layers,
                    label: layerConfig.label
                }];


            } else {
                if (layerConfig.params) {
                    params = layerConfig.params;
                }
                if (layerConfig.url) {
                    url = layerConfig.url;
                }

                if (typeof params == "string") {
                    params = JSON.parse(params);
                }

                if (!layerConfig.params && layerConfig.label) {
                    params = [{
                        label: layerConfig.label
                    }];
                }

                if (!layerConfig.params && layerConfig.label && layerConfig.layers) {
                    params = [{
                        layersConfig: layerConfig.layers,
                        label: layerConfig.label,
                        active: layerConfig.active
                    }];
                }

                // We traverse the speficied class 'packages' from the root (window) to obtain the actual class object.
                layerClass = SMC.Util.getClass(type);
            }

            // Class instantiation code from http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            var constructor = SMC.Util.getConstructor(layerClass);

            if (url) {
                if (Array.isArray(params)) {
                    params[0].url = url;
                } else {
                    params.url = url;    
                }
            } 

            layer = constructor(params);


            if (layerConfig.listeners) {
                for (var eventName in layerConfig.listeners) {
                    layer.on(eventName, layerConfig.listeners[eventName]);
                }
            }

            // If we have triggers and the layer is reloadable, we add the triggers.
            if (layerConfig.reloadTriggers && (typeof layer.addReloadTrigger === "function")) {
                for (var tIdx = 0; tIdx < layerConfig.reloadTriggers.length; tIdx++) {
                    var triggerConfig = layerConfig.reloadTriggers[tIdx];
                    layer.addReloadTrigger(triggerConfig);
                }
            }

            // The layer loader is mixed in into a map (or Folder) so we can add layers to that.

            layer._map = this;

            layer.addTo(this);

            // The loader (that is, the map or Folder) is the layer's parent
            layer.parent = this;

            var id;
            if (layerConfig.id) {
                id = layerConfig.id;
            } else {
                id = "layer" + L.stamp(layer);
            }

            this.loadedLayers[id] = layer;
        }
    });