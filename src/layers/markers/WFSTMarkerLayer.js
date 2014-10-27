require("./MarkerLayer");
require("../../providers/WFSTProvider.js");
require("../EditableLayer");
require("../../../lib/leaflet.draw/dist/leaflet.draw-src.js");
var editable_layers = [];

/**
 * Layer for all SMC map viewer's WFS-T layers rendered using markers.
 * @class
 * @extends SMC.layers.markers.MarkerLayer
 * @mixes SMC.providers.WFSTProvider
 * @mixes SMC.layers.EditableLayer
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */
SMC.layers.markers.WFSTMarkerLayer = SMC.layers.markers.MarkerLayer.extend(
    /** @lends SMC.layers.markers.WFSTMarkerLayer# */
    {
        featuresEdited: new L.LayerGroup(),

        /**
         * Initialize the object with the params
         * @param {object} options - object with need parameters
         */
        initialize: function(options) {
            SMC.layers.markers.MarkerLayer.prototype.initialize.call(this, options);
            SMC.providers.WFSTProvider.prototype.initialize.call(this, options);
            SMC.layers.EditableLayer.prototype.initialize.call(this, options);
        },

        /**
         * Method to load the features into marker layer
         * @param {Object} features - Features to be loaded
         */
        onFeaturesLoaded: function(features) {
            this.addMarkerFromFeature(features);
        },

        /**
         * Retrieves the features from its source.
         */
        load: function() {
            this.loadFeatures();
        },

        /**
         * Method to load the control in the map
         * @param {SMC.Map} map - Map to be added
         */
        onAdd: function(map) {
            editable_layers.push(this);
            SMC.layers.EditableLayer.prototype.onAdd.call(this, map);
            SMC.layers.markers.MarkerLayer.prototype.onAdd.call(this, map);
            this._setButtonState(this);
        },
        /**
         * Method to remove the control in the map
         * @param {SMC.Map} map - Map to be removed
         */
        onRemove: function(map) {
            this._editing = false;
            this._finishEditControl(this.options);

            var index = this._getIndexFromEditableLayer(this);
            if (index > -1) {
                editable_layers.splice(index, 1);
            }
            SMC.layers.EditableLayer.prototype.onRemove.call(this, map);
            SMC.layers.markers.MarkerLayer.prototype.onRemove.call(this, map);

        },

        _setButtonState: function(layer){
            var editing;
            for (var i = 0; i < editable_layers.length; i++) {
                if(editable_layers[i]._editing){
                   editing = true;
                }
            }
            var label = layer.options.label;
            var layer_div = $("[id='" + label + "']")[0];
            var buttons = $("input[type=button]", layer_div);
            for (j = 0; j < buttons.length; j++) {
                if(editing){
                    buttons[j].disabled = true;
                }else{
                    buttons[j].disabled = false;
                }
            }
           
                   
        },


        /**
         * Method to add edit control to map
         * @private
         * @param {Object} options - Event to handler
         */
        _startEditControl: function(options) {
            if (this._map && !this._drawControl) {
                for (var i = 0; i < editable_layers.length; i++) {
                    if (editable_layers[i]._leaflet_id != this._leaflet_id) {
                        var label = editable_layers[i].options.label;
                        var layer_div = $("[id='" + label + "']")[0];
                        var buttons = $("input[type=button]", layer_div);
                        var check = $("input[type=checkbox][id=" + editable_layers[i]._leaflet_id + "]")[0];
                        for (j = 0; j < buttons.length; j++) {
                            if (check.checked && !buttons[j].disabled) {
                                buttons[j].disabled = true;
                            }
                        }
                    }
                }
                var self = this;
                // Initialise the draw control and pass it the FeatureGroup of editable layers
                this._drawControl = new L.Control.Draw({
                    draw: {
                        polyline: false,
                        polygon: false,
                        rectangle: false,
                        circle: false
                    },
                    edit: {
                        featureGroup: this.noClusterGroup
                    }
                });
                this._map.addControl(this._drawControl);
                // Marker created
                this._map.on('draw:created', function(e) {
                    var layer = e.layer;
                    self.removeLayer(e.layer);
                    // Update the added features
                    self._insert(layer);
                    



                });
                // Marker edited
                this._map.on('draw:edited', function(e) {
                    var layers = e.layers;
                    // Update the edited features
                    if (!$.isEmptyObject(layers._layers)) {
                        self._update(layers);
                    }
                });

                //Marker attributes edited
                this._map.on('editAttributes', function(e) {
                    var layer = e.layer;
                    layer.closePopup();
                    //Open attributes edition popup
                    var content = self._setAttrEditor(layer);
                    layer.bindPopup(content).openPopup();


                });

                //Save marker attributes edited
                this._map.on('draw:editedData', function(e) {
                    var layers = self.featuresEdited;

                    // Update the edited features
                    layers.save = true;
                    if (!$.isEmptyObject(layers._layers)) {
                        self._update(layers);
                    }

                    //Update properties of changed layers
                    for (var i in layers._layers) {
                        layers._layers[i].propertiesInicial = layers._layers[i].feature.properties;
                    }


                });

                this._map.on('draw:editDatastop', function() {
                    var layers = self.featuresEdited;
                    if (!$.isEmptyObject(layers._layers)){
                        if (!layers.save) {
                            for (var i in layers._layers) {
                                var f = layers._layers[i].feature;
                                var propIni = layers._layers[i].propertiesInicial;
                                if (propIni) {
                                    for (var j in f.properties) {
                                        f.properties[j] = propIni[j];
                                    }
                                }
                            }
                        }
                        layers.save = false;
                        for (var i in layers._layers) {
                            layers._layers[i].closePopup();
                            self._applyStyles(layers._layers[i], false);
                        }
                    }
                });
                // Marker removed
                this._map.on('draw:deleted', function(e) {
                    var layers = e.layers;
                    // Remove the deleted features
                    self._delete(layers);
                });
            }
        },

        /**
         * Method to add edit control to map
         * @private
         * @param {Object} options - Event to handler
         */
        _finishEditControl: function(options) {
            if (this._drawControl) {
                for (var i = 0; i < editable_layers.length; i++) {
                    editable_layers[i].featuresEdited.clearLayers();
                    if (editable_layers[i]._leaflet_id != this._leaflet_id) {
                        var label = editable_layers[i].options.label;
                        var layer_div = $("[id='" + label + "']")[0];
                        var buttons = $("input[type=button]", layer_div);
                        var check = $("input[type=checkbox][id=" + editable_layers[i]._leaflet_id + "]")[0];
                        for (j = 0; j < buttons.length; j++) {
                            if (check.checked) {
                                if (buttons[j].disabled) {
                                    buttons[j].disabled = false;   
                                }
                            }
                        }
                    }
                    else{
                        var label = this.options.label;
                        var layer_div = $("[id='" + label + "']")[0];
                        var buttons = $("input[type=button]", layer_div);
                        for (j = 0; j < buttons.length; j++) {
                            buttons[j].setAttribute("value", this.options.editButtonLabel);
                        }
                        
                    }
                }
                this._map.removeControl(this._drawControl);
                this._drawControl = null;
                this._map.off('draw:created');
                this._map.off('draw:deleted');
             
            }
        },

       

        _setAttrEditor: function(layer) {
            var self = this;
            var content = document.createElement('div');
            var header = document.createElement('div');
            header.innerHTML = layer.feature.id;
            header.style.borderBottom = '1px #000 solid';
            header.style.fontWeight = 'bold';
            content.appendChild(header);

            var table = document.createElement('table');  
            var prop = layer.feature.properties;
            var noEditables = this._getNotEditables();
            for (var i in prop) {
                var noNull = false;
                var value = prop[i];
                if (value == null) {
                    value = '';
                }
                for (var j = 0; j < noEditables.length; j++) {
                    if (i == noEditables[j]) {
                        noNull = true;
                    }
                }



                var row = document.createElement('tr');
                var td = document.createElement("td");
                td.style.fontSize = "10pt";
                td.innerHTML = i + ": ";
                row.appendChild(td);
                var rowInput = document.createElement('input');
                if (noNull) {
                    rowInput.disabled = true;
                }
                rowInput.type = 'text';
                rowInput.value = value;
                rowInput.style.width = '120px';
                rowInput.style.float = 'right';
                rowInput.className = 'attributes';
                td = document.createElement("td");
                td.appendChild(rowInput);
                row.appendChild(td);
                table.appendChild(row);
            }

            content.appendChild(table);

            var buttons = document.createElement('center');
            var save = document.createElement('input');
            save.type = 'button';
            save.value = 'Save edition';
            save.onclick = function() {

                self._save(layer, content);
            }
            buttons.appendChild(save);
            var cancel = document.createElement('input');
            cancel.type = 'button';
            cancel.value = 'Cancel';
            cancel.onclick = function() {
                layer.closePopup();

            }
            buttons.appendChild(cancel);
            content.appendChild(buttons);
            this.featuresEdited.addLayer(layer);

            return content;

        },

        _getNotEditables: function() {
            var noEditables = this.options.readOnlyFields;
            var _this = this;
            $.ajax({
                type: "GET",
                url: this.options.serverURL + "?request=DescribeFeatureType&version=1.1.0&typename=" +
                    this.options.typeName,
                dataType: "xml",
                contentType: "text/xml",
                async: false,
                success: function(xml, status, object) {
                    var attributes = _this._getElementsByTagNameNS(_this._getElementsByTagNameNS(xml,'xsd', 'sequence')[0], 'xsd', 'element');
                    
                    for (var i = 0; i < attributes.length; i++) {
                        if (attributes[i].getAttribute('nillable') == "false") {
                            noEditables.push(attributes[i].getAttribute('name'));
                        }
                    }
                }
            });
            return noEditables;
        },

        _save: function(layer, content) {
            var prop = layer.feature.properties;
            var propInitial = {};
            var attributes = content.getElementsByClassName('attributes');
            var i = 0;
            for (var j in prop) {
                propInitial[j] = prop[j];
                prop[j] = attributes[i].value;
                i++;
            }
            layer.propertiesInicial = propInitial;

            layer.closePopup();

        },

        _applyStyles: function(marker, inCluster) {
            if (!marker.feature) {
                this.noClusterGroup.addLayer(marker);
                return;
            }

            // var zoom = this._map.getZoom();
            if (!zoom) {
                var zoom = this.getMap().getZoom();
            }
            var style = this.applyStyle(marker.feature, zoom);
            if (style.icon) {
                marker.setIcon(style.icon);
            }
            if (style.opacity) {
                marker.setOpacity(style.opacity);
            }
            this.noClusterGroup.removeLayer(marker);
            this.noClusterGroup.addLayer(marker);

            this.addPopUp(marker, zoom);
        },
        _getIndexFromEditableLayer: function(layer) {
            var index = -1;
            for (var i = 0; i < editable_layers.length; i++) {
                if (editable_layers[i]._leaflet_id == layer._leaflet_id) {
                    index = i;
                    break;
                }
            }
            return index;
        },
    }, [SMC.layers.EditableLayer, SMC.providers.WFSTProvider]);

/**
 * API factory method for ease creation of wfs features providers.
 * @param {Object} options - Options for wfs the provider.
 */
SMC.wfstMarkerLayer = function(options) {
    return new SMC.layers.markers.WFSTMarkerLayer(options);
};
