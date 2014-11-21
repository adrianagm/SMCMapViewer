require("./GeometryLayer.js");
require("../../providers/SolrHistoryProvider.js");


/**
 * Base class for layers using a WFS provider to get the features
 *
 * @class
 * @abstract
 * @extends SMC.layers.geometry.GeometryLayer
 * @mixes SMC.providers.WFSProvider
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.geometry.SolrGeometryHistoryLayer = SMC.layers.geometry.GeometryLayer.extend(
    /** @lends SMC.layers.geometry.WFSGeometryLayer# */
    {
        _historyLayers: {},
        _timer: null,
        _node: null,
        

        /**
         * Initialize the object with the params
         * @param {object} options - object with need parameters
         */
        initialize: function(options) {
           
            SMC.layers.geometry.GeometryLayer.prototype.initialize.call(this, options);
            SMC.providers.SolrHistoryProvider.prototype.initialize.call(this, options);

            //SMC.layers.history.DataHistoryLayer.prototype.initialize.call(this, arguments);
            
          // L.LayerGroup.prototype.initialize.call(this, options);
            L.Util.setOptions(this, options);
            this.setZIndex(1000);

             
        },



        /**
         * Method to load the features
         */
        load: function() {
           

        },
       /*addTo: function(map){
          
            map.off('layeradd');
            
        },*/


        createNodeHTML: function(){

            var node = document.createElement("div");
            node.id = "node_" + this._leaflet_id;
            
            var label = document.createElement('span'),
                input,
                checked = this.getMap().hasLayer(this);

            input = document.createElement('input');
            input.type = 'checkbox';
            input.defaultChecked = checked;
            input.style.cursor = "pointer";
            var name = document.createElement('span');
            name.innerHTML = ' ' + (this.options.label || this.options.typeName);

            label.appendChild(input);
            label.appendChild(name);
            node.appendChild(label);
            if($.isEmptyObject(this._featuresForLayer)){
              return node;
             }

            var sliderControl = document.createElement("table");
            sliderControl.style.marginLeft = '10px';
            sliderControl.style.marginTop = '5px';
            sliderControl.className = 'leaflet-bar leaflet-update-interval ';

            var sliderControlLabel = document.createElement("span");
            sliderControlLabel.style.float = 'left';
            sliderControl.style.font = '12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif';

            var inputInterval = document.createElement('input');
            inputInterval.type = 'range';
            inputInterval.id = "interval_" + this._leaflet_id;
            inputInterval.name = "interval_" + this._leaflet_id;
            inputInterval.min = 0;
            inputInterval.max = Object.keys(this._featuresForLayer).length - 1;
            inputInterval.step = 1;
            inputInterval.value = 0;
            //sliderControl.innerHTML += '<input id="interval_' + this._leaflet_id + '" name="interval_' + this._leaflet_id + '" min="0" max="' + (Object.keys(this._featuresForLayer).length - 1) + '" type="range" step="1" value="0"/>';
           

            var time = inputInterval.value;

            var play_pause = document.createElement("i"); 
            play_pause.className = 'fa fa-play';
            play_pause.style.cursor = "pointer";

            this._addTimeData(time);
            this._showLabel(sliderControlLabel);

            var self = this;
            L.DomEvent.addListener(inputInterval, 'mousedown', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(inputInterval, 'mouseup', function() {
                time = inputInterval.value;
                self.showTimeData(time);
                self._showLabel(sliderControlLabel);
                L.DomEvent.stopPropagation;
            });
            L.DomEvent.addListener(inputInterval, 'touchstart', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(inputInterval, 'touchend', L.DomEvent.stopPropagation);

            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            td1.appendChild(sliderControlLabel);
            td2.appendChild(play_pause);
            td3.appendChild(inputInterval);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            sliderControl.appendChild(tr);
           
            
            node.appendChild(sliderControl);

            play_pause.onclick = function() {
                self._onPlayPause(node, time);
            };
            label.onchange = function(event) {
                self._clickOnLayer(node);
            };
            this._node = node;
            return node;

        },
     

        getMap: function() {
           if (this.parent) {
                if (this.parent.map) {
                    map = this.parent.map;
                } else if (this.parent._map) {
                    map = this.parent._map;
                }
                 else if (this.parent.parent) {
                    if (this.parent.parent.map)
                        map = this.parent.parent.map;
                    else if (this.parent.parent._map)
                        map = this.parent.parent._map;
                }

                return map;
            }
            else if(this._map){
                map = this._map;
                return map;
            }

        },

       

        showTimeData: function(time) {
            var i = 0;
           // alert('time slider' + time);
            var data = this._featuresForLayer;
            if (time % 1 !== 0) {
                time = time - (time % 1);
            }

            for (var d in data) {
                if (data[d].actual) { 
                    data[d].actual = false;
                }
                if (i == time) {
                    if (!data[d].actual) {
                        
                        data[d].actual = true;
                        this.features = [];
                        if(data[d].lastZoom && (data[d].lastZoom != this.getMap().getZoom())){
                            for(var f in data[d]){
                                data[d][f]._clean = false;
                            }
                        }
                        this.addGeometryFromFeatures(data[d]);
                        data[d].lastZoom = this.getMap().getZoom();
                        //recalculate canvas position for geometry layers (important)
                        this.getMap().fire("slidermove");
                    }

                }

                i++;

            }

        },

        _addTimeData: function(time) {
         var i = 0;
            var data = this._featuresForLayer;
            for (var d in data) {
                if (i == time) {
                    this.addGeometryFromFeatures(data[d]);
                    data[d].actual = true;
                }
               
                i++;

            }

        },

        _showLabel: function(sliderControlLabel) {
          var data = this._featuresForLayer;
            for (var d in data) {
                if (data[d].actual) {
                    sliderControlLabel.innerHTML = d;
                }
            }
        },

        _clickOnLayer: function(node) {
           var pause = node.getElementsByClassName('fa fa-pause')[0];
            if (pause) {
                this._onPlayPause(node);
            }
            var data = this._featuresForLayer;
            if (node.children[1].style.display != 'none') {
                node.children[1].style.display = 'none';
                node.children[0].checked = false;
                for (var d in data) {
                    if (data[d].actual) { 
                        this.onRemove(this.getMap());
                    }
                }
            } else {
                node.children[1].style.display = 'block';
                node.children[0].checked = true;
                for (var d in data) {
                    if (data[d].actual) {
                        this.onAdd(this.getMap());
                        this.addGeometryFromFeatures(data[d]);

                    }
                }
            }

        },

        _onPlayPause: function(node, time) {
           var data = this._featuresForLayer;
           var slider = node.children[1].children[0].children[2].children[0];
           var maxValue = slider.max;
           var sliderControlLabel = node.children[1].children[0].children[0].children[0];
           var play = node.children[1].children[0].children[1].children[0];

            if (play.className == 'fa fa-play') {
                play.className = 'fa fa-pause';
                if (slider.value == maxValue) {
                   slider.value = 0;
                }


                var i = parseFloat(slider.value);
                var self = this;
                this._timer = setInterval(function() {
                    
                    self.showTimeData(i);
                    self._showLabel(sliderControlLabel);
                    if (i < maxValue) {
                        slider.value = i;

                    } else {
                        clearInterval(self._timer);
                        play.className = 'fa fa-play';
                        slider.value = maxValue;

                    }
                    i += parseFloat(slider.step);

                }, this.options.time);

            } else {

                play.className = 'fa fa-play';
                clearInterval(this._timer);
            }
        },


       
        
    }, [SMC.providers.SolrHistoryProvider]);

/**
 * API factory method for easy creation of wfs geometry layer.
 * @params {Object} options - Options to initialize the WFS 
 */
SMC.solrGeometryHistoryLayer = function(options) {
    return new SMC.layers.geometry.SolrGeometryHistoryLayer(options);
};