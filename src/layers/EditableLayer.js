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
        _startEditControl: function(options){
        	throw new Error("SMC.layers.EditableLayer::_addEditControl: must be implemented in derivate classes.");
        },
        /**
         * Method to add edit control to map
         * @private
         * @param {Object} options - Event to handler
         */
        _finishEditControl: function(options){
            throw new Error("SMC.layers.EditableLayer::_addEditControl: must be implemented in derivate classes.");
        },
        /**
         * Method to add edit button to layer tree panel
         * @private
         */
        _addEditButton: function(){
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
            button.setAttribute("value", "Start Edition");
            button.style.cursor = "pointer";
            node.appendChild(button);
            var self = this;
            button.onclick = function(event){
                self._startEditControl(event);
            };
            // Create start edition button
            var button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("value", "Finish Edition");
            button.style.cursor = "pointer";
            node.appendChild(button);
            var self = this;
            button.onclick = function(event){
                self._finishEditControl(event);
            };
        	return node;
        },
	}
);