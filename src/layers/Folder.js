require("./layers.js");
require("../controls/layerTree/LayerTreeFolder.js");
require("../LayerLoader.js");

/**
 * Base class for folder.
 * @class
 * @extends L.LayerGroup
 * @mixes SMC.controls.layerTree.LayerTreeFolder
 * @mixes SMC.LayerLoader
 * 
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.layers.Folder = L.LayerGroup.extend(
    /** @lends SMC.layers.Folder# */
    {


        /**
         * Initialize the object with the params
         * @param {object} options - default options
         */
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
        },

        /**
         * Method to create an HTML node for the name of the layer.
         * @returns {String} HTML code representing the code to be added to the layer's entry in the layer tree.
         */
        createNodeHTML: function() {
            var node = document.createElement("i");
            node.className = 'fa fa-folder-open';
            node.style.cursor = "pointer";
            node.onclick = this._clickOnFolder;
            node.innerHTML = (this.options.label || this.options.typeName);
            return node;
        },

        _clickOnFolder: function(evt){
            if(evt.target.className.indexOf("open") != -1){
                // Folder opened
                var labels = evt.target.parentElement.parentElement.getElementsByClassName("leaflet-control-layers-group-content");
                labels[0].style.display = 'none';
                evt.target.removeAttribute("class");
                evt.target.className = "fa fa-folder";
            }else{
                // Folder closed
                var labels = evt.target.parentElement.parentElement.getElementsByClassName("leaflet-control-layers-group-content");
                labels[0].style.display = 'block';
                evt.target.removeAttribute("class");
                evt.target.className = "fa fa-folder-open";
            }
        }
    },[SMC.controls.layerTree.LayerTreeFolder, SMC.LayerLoader]);
