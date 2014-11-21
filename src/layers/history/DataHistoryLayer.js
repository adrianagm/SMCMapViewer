require("./AggregatingHistoryLayer.js");
require("../layers.js");
require("../../LayerLoader.js");

/**
 * Class formed by the aggregation of several history layers.
 *
 * @class
 * @extends SMC.layers.SingleLayer
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.history.DataHistoryLayer = SMC.layers.SingleLayer.extend(
	/** @lends SMC.layers.history.DataHistoryLayer# */
	{
		_historyLayers: {},
		_timer: null,
		_node: null,

		 /**
         * Initialize the object with the params
         * @param {object} options - object with need parameters
         */
		initialize: function(options) {
			L.Util.setOptions(this, options);
			L.LayerGroup.prototype.initialize.call(this, options);
			//SMC.layers.SingleLayer.prototype.initialize.apply(this, options);


		},

		/**
         * Method to create an HTML node for the name of the layer.
         * @returns {String} HTML code representing the code to be added to the layer's entry in the layer tree.
         */
		createNodeHTML: function() {
			this._historyLayers = this._orderLayers();
			var layers = this._historyLayers;

			 var node = document.createElement("div");
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


            var sliderControl = document.createElement("table");
            sliderControl.style.marginLeft = '10px';
            sliderControl.style.marginTop = '5px';
            sliderControl.className = 'leaflet-bar leaflet-update-interval ';
            sliderControl.style.font = '12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif';

            var sliderControlLabel = document.createElement("span");
            sliderControlLabel.style.float = 'left';
            

            var inputInterval = document.createElement('input');
            inputInterval.type = 'range';
            inputInterval.id = "interval_" + this._leaflet_id;
            inputInterval.name = "interval_" + this._leaflet_id;
            inputInterval.min = 0;
            inputInterval.max = Object.keys(layers).length - 1;
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
           
            node.appendChild(label);
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

		_orderLayers: function() {
			var layers;
			var exists = true;
			for (var d in this._aggregatingLayers) {
				var date = this._aggregatingLayers[d].options.date;
				if (!date) {
					exists = false;
					break;
				}
			}

			if (!exists) {
				layers = this._aggregatingLayers;

			} else {

				var layersObj = {};
				var layersArray = [];
				for (var l in this._aggregatingLayers) {
					layersArray.push(this._aggregatingLayers[l]);
				}

				layersArray.sort(function(a, b) {
					return (a.options.date - b.options.date)
				});

				for (var i = 0; i < layersArray.length; i++) {
					if (!layersObj[layersArray[i].options.date]) {
						layersObj[layersArray[i].options.date] = layersArray[i];
					} else {
						layersObj[layersArray[i].options.label] = layersArray[i];
					}
				}
				layers = layersObj;
			}
			return layers;

		},


		 /**
         * Method to load the control in the map
         * @param {SMC.Map} map - Map to be added
         */
		addTo: function(map) {
			SMC.layers.aggregation.AggregatingLayer.prototype.addTo.call(this, map);
		},

		/**
         * Method to get the map
         * @returns {SMC.Map} map - Map layer
         */
		getMap: function() {
			SMC.layers.aggregation.AggregatingLayer.prototype.getMap.call(this, arguments);
			return map;
		},

		/**
         * Method to show the correct history layer
         * @param {string} time - Value of the slider control
         */
		showTimeData: function(time) {
			var i = 0;
			var data = this._historyLayers;
			if (time % 1 !== 0) {
				time = time - (time % 1);
			}
			for (var d in data) {
				// if (i == time && data[d].actual) {
				// 	break;
				// }
				data[d]._slidermove = true;
				if (data[d].actual) {
						data[d].onRemove(this.getMap());
						data[d].actual = false;

				}

				if (i == time) {
					if (!data[d].actual) {
						
						data[d].actual = true;
						if(data[d].lastZoom && (data[d].lastZoom != this.getMap().getZoom())){
							 for(var f in data[d].features){
	                            data[d].features[f]._clean = false;
	                        }
	                    }
						data[d].onAdd(this.getMap());
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
			var data = this._historyLayers;
			for (var d in data) {

				if (i == time) {
					this.getMap().addLayer(data[d]);
					this._historyLayers[d].actual = true;
				}
				i++;

			}

		},

		_showLabel: function(sliderControlLabel) {
			var data = this._historyLayers;
			for (var d in data) {
				if (data[d].actual) {
					sliderControlLabel.innerHTML = data[d].options.label || data[d].options.typeName;
				}
			}
		},

		_clickOnLayer: function(node) {
			var pause = node.getElementsByClassName('fa fa-pause')[0];
			if (pause) {
				this._onPlayPause(node);
			}
			var data = this._historyLayers;
			if (node.children[1].style.display != 'none') {
				node.children[1].style.display = 'none';
				node.children[0].checked = false;
				for (var d in data) {
					if (data[d].actual) {
						data[d].onRemove(this.getMap());
					}
				}
			} else {
				node.children[1].style.display = 'block';
				node.children[0].checked = true;
				for (var d in data) {
					if (data[d].actual) {
						data[d].onAdd(this.getMap());

					}
				}
			}

		},

		_onPlayPause: function(node, time) {
			var data = this._historyLayers;

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

		 /**
         * Method to remove the control in the map
         * @param {SMC.Map} map - Map to be removed
         */
		onRemove: function(map) {
			var data = this._historyLayers;
			for (var d in data) {
				if (data[d].actual) {
					data[d]._slidermove = false;
					data[d].onRemove(map);

				}

			}

		},

 		/**
         * Method to load the control in the map
         * @param {SMC.Map} map - Map to be added
         */
		onAdd: function(map) {
			SMC.layers.aggregation.AggregatingLayer.prototype.addTo.call(this, map);
			var value;
			if (this._node != null) {
				value = this._node.children[1].children[0].value;
			} else
				value = 0;

			var data = this._historyLayers;
			for (var d in data) {
				if (data[d].actual) {
					data[d]._slidermove = false;
					data[d].onAdd(map);

				}
			}

		

		}



	});