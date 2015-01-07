require("./SingleLayer.js");
/**
 * Base class for all SMC viewer layer which are both reloadable and editable layers.
 * @class
 * @extends SMC.layers.SingleLayer
 * @abstract
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.layers.EditableLayer = SMC.layers.SingleLayer.extend(
    /** @lends SMC.layers.EditableLayer# */
    {
        options: {
            editButtonLabel: "Start Edition",
            confirmButtonLabel: "Finish Edition"
        },

        _editing: false,
        _button: null,

        /**
         * Initialize the object with the params
         * @param {object} options - object with need parameters
         */
        initialize: function(options) {
            L.Util.setOptions(this, options);
        },
        /**
         * Method to add edit control to map
         * @private
         * @param {Object} options - Event to handler
         */
        _startEditControl: function(options) {
            throw new Error(
                "SMC.layers.EditableLayer::_addEditControl: must be implemented in derivate classes.");
        },
        /**
         * Method to add edit control to map
         * @private
         * @param {Object} options - Event to handler
         */
        _finishEditControl: function(options) {
            throw new Error(
                "SMC.layers.EditableLayer::_addEditControl: must be implemented in derivate classes.");
        },
        /**
         * Method to add edit button to layer tree panel
         * @private
         */
        _addEditButton: function() {
            var node = document.createElement("div");
            node.id = this.options.label;
            node.style.display = "inherit";
            // Create label
            var label = document.createElement("i");
            label.style.cursor = "pointer";
            label.innerHTML = this.options.label;
            node.appendChild(label);
            // Create space
            var br = document.createElement("br");
            node.appendChild(br);
            // Create start edition button
            var button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("value", this.options.editButtonLabel);
            button.style.cursor = "pointer";
            node.appendChild(button);
            var _this = this;
            button.onclick = function(event) {
                if (_this._editing) {
                    _this._finishEditControl(event);
                } else {
                    _this._startEditControl(event);
                }
                _this._editing = !_this._editing;
                button.setAttribute("value",
                    _this._editing ? _this.options.confirmButtonLabel : _this.options.editButtonLabel);

                return false; // So the event doesnt propagate.
            };
            node.onclick = function(){
                return false;
            };
            
            this._button = button;

            return node;
        },


        onAdd: function(map) {
            if (this._button) {
                this._button.style.display = "";
            }
        },

        onRemove: function(map) {
            if (this._button) {
                this._button.style.display = "none";
            }
        },


        /**
         * Method to create an HTML node for the name of the layer.
         * @returns {String} HTML code representing the code to be added to the layer's entry in the layer tree.
         */
        createNodeHTML: function() {
            var node = this._addEditButton();
            return node;
        }
    }
);
