require("../layers.js");
require("../../LayerLoader.js");
require("./AggregatingLayer.js");



/**
 * Class formed by the aggregation of several history layers.
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
		includes: SMC.Util.deepClassInclude([]),

		initialize: function(options) {
			L.Util.setOptions(this, options);
			L.LayerGroup.prototype.initialize.call(this, arguments);

		},


		createNodeHTML: function() {

			var node = document.createElement("div");
			node.id = this.options.label;
			var label = document.createElement("i");
			label.className = 'fa fa-check-square-o';
			label.style.cursor = "pointer";
			label.innerHTML = " " + this.options.label;

			label.onclick = function(event) {
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
				multiLayers[l].addTo(map);
				if (!multiLayers[l].active) {
					multiLayers[l].onRemove(map);
				}

			};
		},

		load: function() {

		},

		_initializeTree: function() {
			this._getActiveLayer();
			var multiLayers = this._aggregatingLayers;
			for (var l in multiLayers) {
				if (multiLayers[l].active) {
					//add node of active layer
					var id = this.options.label;
					var tree = document.getElementById(id);
					var treeNodes = tree.parentNode.nextElementSibling;
					tree = tree.parentNode.nextElementSibling.children;
					var label = multiLayers[l].options.label;
					if (multiLayers[label] instanceof SMC.layers.aggregation.AggregatingLayer) {
						this._addNode(tree, treeNodes, label);
					}

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
							if (pause[i].parentNode.style.display != 'none') {
								pause[i].className = 'fa fa-play';
							}
						}
						clearInterval(multiLayers[l]._timer);
						multiLayers[l].onRemove(map);
						multiLayers[l].active = false;
					}


				} else {
					if (!multiLayers[l].active) {
						multiLayers[l].onAdd(map);
						multiLayers[l].active = true;


					}

				}

			}

			var tree = event.target.parentNode.parentNode.parentNode.nextElementSibling.children;
			var treeNodes = event.target.parentNode.parentNode.parentNode.nextElementSibling;
			var label = event.target.value;
			if (multiLayers[label] instanceof SMC.layers.aggregation.AggregatingLayer) {
				this._addNode(tree, treeNodes, label);
			}



		},

		_addNode: function(tree, treeNodes, label) {
			var node = null;
			search(tree);
			treeNodes.style.display = 'block';

			//search node active layer
			function search(tree) {

				for (var i = 0; i < tree.length; i++) {
					if (tree[i].innerHTML.trim() != label) {

						if (tree[i].parentNode == treeNodes) {
							tree[i].style.display = 'none';
						}
						if (node != null) {
							var sibling = node.nextElementSibling;
							if (sibling && sibling.children) {
								for (var k = 0; k < sibling.children.length; k++) {
									if (sibling.children[k] == tree[i]) {
										tree[i].parentNode.style.display = 'block';
										break;
									}
								}
							}
						} else {
							tree[i].parentNode.style.display = 'none';

						}

						if (tree[i].children.length != 0)
							search(tree[i].children);


					} else {

						for (var j = 0; j < tree.length; j++) {
							tree[j].style.display = 'inline-block';
						}
						tree[i].style.display = 'none';
						tree[i].parentNode.style.display = 'block';
						tree[i].parentNode.parentNode.style.display = 'block';
						tree[i].parentNode.parentNode.parentNode.style.display = 'block';
						tree[i].parentNode.parentNode.parentNode.parentNode.style.display = 'block';
						node = tree[i];
					}
				}

			}



		},

		_clickOnMultiLayer: function(node) {
			//active/desactive multimode layer

			var nodesLayers = event.target.parentNode.parentNode.nextElementSibling;
			var data = this._aggregatingLayers;

			if (node.children[1].style.display != 'none') {
				node.children[1].style.display = 'none';
				event.target.parentNode.parentNode.nextElementSibling.style.display = 'none';
				node.children[0].className = 'fa fa-square-o';
				for (var d in data) {
					if (data[d].active) {
						if (data[d] instanceof SMC.layers.history.AggregatingHistoryLayer) {

							var pause = nodesLayers.getElementsByClassName('fa fa-pause');

							if (pause.length != 0) {
								clearInterval(data[d]._timer);
								
							}



						}
						data[d].onRemove(map);
					}
				}
			} else {
				node.children[1].style.display = 'block';
				event.target.parentNode.parentNode.nextElementSibling.style.display = 'block';
				node.children[0].className = 'fa fa-check-square-o';
				for (var d in data) {
					if (data[d].active) {
						if (data[d] instanceof SMC.layers.history.AggregatingHistoryLayer) {

							var pause = nodesLayers.getElementsByClassName('fa fa-pause');

							for (var i = 0; i < pause.length; i++) {
								if (pause[i].parentNode.style.display != 'none') {
									pause[i].className = 'fa fa-play';
								}
							}
						}



						data[d].onAdd(map);
					}
				}
			}

		},


	});