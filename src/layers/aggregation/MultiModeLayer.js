require("../layers.js");
require("../../LayerLoader.js");
require("./AggregatingLayer.js");



/**
 * Class formed by the aggregation of several layers.
 *
 * @class
 * @extends SMC.aggregation.AggregatingLayer
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.aggregation.MultiModeLayer = SMC.layers.aggregation.AggregatingLayer.extend(
	/** @lends SMC.layers.history.AggregatingHistoryLayer# */
	{
		node: null,

		/**
         * Initialize the object with the params
         * @param {Object} options - Object with extra information
         */
		initialize: function(options) {
			L.Util.setOptions(this, options);
			SMC.layers.aggregation.AggregatingLayer.prototype.initialize.apply(this, arguments);
			L.LayerGroup.prototype.initialize.call(this, arguments);
			this.checked = true;
		},

		 /**
         * Method to create an HTML node for the name of the layer.
         * @returns {String} HTML code representing the code to be added to the layer's entry in the layer tree.
         */
		createNodeHTML: function() {

			var node = document.createElement("div");
			node.id = this._leaflet_id;

			var label = document.createElement('label');
			var checked = this.getMap().hasLayer(this);

			var input = document.createElement('input');
			input.type = 'checkbox';
			input.defaultChecked = checked;
			var name = document.createElement('span');
			name.innerHTML = ' ' + this.options.label;

			label.appendChild(input);
			label.appendChild(name);

			label.style.cursor = "pointer";


			input.onchange = function(event) {
				self._clickOnMultiLayer(node);
			};
			node.appendChild(label);

			var layers = this._aggregatingLayers;

			//create buttons container
			var modes = document.createElement("div");

			for (var l in layers) {
				//create buttons
				var button = document.createElement("input");
				button.setAttribute('type', 'button');
				button.style.cursor = "pointer";
				button.value = layers[l].options.label;

				modes.appendChild(button);
				var self = this;
				button.onclick = function(event) {
					self._onActive(event, modes);
				};

			};


			node.appendChild(modes);
			if (this.node == null) {
				this.node = node;
				this._initializeButtons(modes);
				var active = this._getActiveLayer();

			}

			return node;
		},

		_initializeButtons: function(modes) {
			var active = this._getActiveLayer();
			var buttons = modes.children;
			for (var i = 0; i < buttons.length; i++) {
				if (buttons[i].value == active.options.label) {
					buttons[i].style.backgroundColor = '#ddd';
				} else
					buttons[i].style.backgroundColor = '#fff';
			}

			var multiLayers = this._aggregatingLayers;

			for (var l in multiLayers) {
				multiLayers[l].addTo(this.getMap());
				if (!multiLayers[l].active) {
					L.FeatureGroup.prototype.onRemove.call(this, map);
					multiLayers[l].onRemove(map);
				}

			};
		},

		/**
         * Retrieves the features from its source.
         */
		load: function() {

		},

		_initializeTree: function() {

			var multiLayers = this._aggregatingLayers;
			for (var l in multiLayers) {
				if (multiLayers[l].active) {
					//add node of active layer
					if ((multiLayers[l] instanceof SMC.layers.aggregation.AggregatingLayer || multiLayers[l] instanceof SMC.layers.markers.WFSTMarkerLayer) && this.checked) {
						this._addNode(multiLayers[l].options.label);
					} else
						this._addNode('none');

				}

			}

		},



		_getActiveLayer: function(multiLayers) {
			var i = 0;
			var multiLayers = this._aggregatingLayers;
			var active;
			var defaultActive;
			for (var l in multiLayers) {
				if (i == 0) {
					defaultActive = multiLayers[l];
				}
				if (multiLayers[l].options.active || multiLayers[l].active) {
					multiLayers[l].active = true;
					active = multiLayers[l];
					multiLayers[l].setVisible(true);

				} else {
					multiLayers[l].active = false;

				}
				i++;

			}

			if (!active) {
				defaultActive.active = true;
				active = defaultActive;

			}

			return active;


		},

		_onActive: function(event, modes) {
			//active/desactive layers
			var multiLayers = this._aggregatingLayers;
			var buttons = modes.children;
			for (var i = 0; i < buttons.length; i++) {
				if (buttons[i] == event.target) {
					buttons[i].style.backgroundColor = '#ddd';
				} else
					buttons[i].style.backgroundColor = '#fff';
			}

			for (var l in multiLayers) {
				var layer;
				if (multiLayers[l].options.label != event.target.value) {

					if (multiLayers[l].active) {
						var pause = document.getElementsByClassName('fa fa-pause');
						for (var i = 0; i < pause.length; i++) {
							pause[i].className = 'fa fa-play';
						}
						clearInterval(multiLayers[l]._timer);

						if (multiLayers[l]._finishEditControl) {
							multiLayers[l]._finishEditControl();
						}

						multiLayers[l].onRemove(map);
						multiLayers[l].active = false;
					}



				} else {
					if (!multiLayers[l].active) {

						multiLayers[l].onAdd(map);
						multiLayers[l].active = true;

						if (multiLayers[l] instanceof SMC.layers.aggregation.AggregatingLayer || multiLayers[l] instanceof SMC.layers.markers.WFSTMarkerLayer) {
							this._addNode(multiLayers[l].options.label);
						} else {
							this._addNode('none');
						}
					}

				}

			}

			

		},

		_addNode: function(label) {
			var id = this._leaflet_id;
			var tree = document.getElementById(id);
			if (!tree) {
				return;
			}
			var treeNodes = tree.parentNode.nextElementSibling;
			var tree = treeNodes.children;
			
			treeNodes.style.display = 'block';
			for (var i = 0; i < tree.length; i++) {
				
					tree[i].style.display = 'none';
					search(tree[i]);

			}

			//search node active layer
			function search(tree) {
				var node = tree.children;
				for (var i = 0; i < node.length; i++) {
					if (node[i].innerHTML.trim() != label) {
							if(node[i].type == 'checkbox' || node[i].nodeName == 'BR'){
								node[i].style.display = 'none';	
							}
						
						if (node[i].children.length != 0)
							search(node[i]);


					} else {
						node[i].style.display = 'none';
						node[i].parentNode.style.display = 'block';
						node[i].parentNode.parentNode.style.display = 'block';
						node[i].parentNode.parentNode.parentNode.style.display = 'block';
						node[i].parentNode.parentNode.parentNode.parentNode.style.display = 'block';
					
					}
				}

			}



		},

		_clickOnMultiLayer: function(node) {
			//active/desactive multimode layer

			var nodesLayers = event.target.parentNode.parentNode.parentNode.nextElementSibling;
			var pause = nodesLayers.getElementsByClassName('fa fa-pause');
			var multiLayers = this._aggregatingLayers;

			if (node.children[1].style.display != 'none') {
				this.checked = false;
				node.children[1].style.display = 'none';
				nodesLayers.style.display = 'none';
				node.children[0].checked = false;
				for (var d in multiLayers) {
					if (multiLayers[d].active) {
						if (multiLayers[d] instanceof SMC.layers.history.AggregatingHistoryLayer) {
							for (var i = 0; i < pause.length; i++) {
								clearInterval(multiLayers[d]._timer);
								pause[i].className = 'fa fa-play';
							}
							
						}

						if (multiLayers[d] instanceof SMC.layers.markers.WFSTMarkerLayer) {
							multiLayers[d]._finishEditControl();
						}
						multiLayers[d].onRemove(map);
					}
				}
			} else {
				this.checked = true;
				node.children[1].style.display = 'block';
				nodesLayers.style.display = 'block';
				node.children[0].checked = true;
				for (var l in multiLayers) {
					if (multiLayers[l].active) {
						multiLayers[l].onAdd(map);
						if ((multiLayers[l] instanceof SMC.layers.aggregation.AggregatingLayer || multiLayers[l] instanceof SMC.layers.markers.WFSTMarkerLayer) && this.checked) {
							this._addNode(multiLayers[l].options.label);
						} else
							this._addNode('none');
						
					}
				}



			}

		},


	}, [SMC.layers.SingleLayer]);