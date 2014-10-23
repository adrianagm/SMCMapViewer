require("./controls.js");
require("../../lib/leaflet.draw/dist/leaflet.draw-src.js");

SMC.controls.IsochroneControl = L.Control.Draw.extend({
	options: {
		 draw: {
            polyline: false,
            polygon: false,
            rectangle: false,
            circle: false,
            marker:false
         },
     
	},
	inputs:{
            walkTime: "num",
            mode: {
            	walk: 'WALK',
            	transit: 'TRANSIT',
            	car: 'CAR'
            },
            maxWalkDistance: "num",
            time: "date",
            arriveBy: {
            	yes: 'yes',
            	no: 'no'
            },
            walkSpeed: 'num',
            bikeSpeed: 'num', 
            output: {
            	shed: 'SHED',
            	edges:'EDGES'
            },
            label:"text"
     },
     params:{
     	label: 'Isocrona'
     },

	

	initialize: function (map) {
		if(map.iso){
			return;
		}
		L.Control.Draw.prototype.initialize.call(this, this.options);
		map.addControl(this);
		map.iso = true;

		var self = this;
		map.on('draw:startIso', function(e){
			self.setForm(e.toolbar);
		});

		map.on('draw:created', function (e) {
				var lat = e.layer._latlng.lat;
				var lng = e.layer._latlng.lng;
				var paramsRequest = self.params;
				paramsRequest.fromPlace = lat +"," + lng;
	            map.loadLayers([{
		            type: "SMC.layers.IsochroneLayer",
		            params:[paramsRequest]
		         },{
	   			 type: "L.Marker",
	             params: [
	                [lat, lng], {
	                    label: self.params.label + ' Marker'
	                }
	            ]

			    }]);

	    });

       
	},

	

	setForm: function(toolbar){
		toolbar._disabled();
		var self = this;
		
		
		var container = this._container;
		container.style.width = '26px';
		var table = document.createElement('table');
		table.id = 'formIsochrone';
		table.className = 'leaflet-form';
		table.onmouseenter = function() {
			console.debug("test");
			self._map.dragging.disable();
			self._map.keyboard.disable();
			return false;
		}

		table.onmouseleave = function() {
			self._map.dragging.enable();
			self._map.keyboard.enable();
		}
		for(var i in this.inputs){
			var e = this.inputs[i];
			var tr = document.createElement('tr');
			var td1 = document.createElement('td');
			var label = document.createElement('span');
			label.innerHTML = i;
			td1.appendChild(label);
			tr.appendChild(td1);
			var td2 = document.createElement('td');
			var input;
			if(e == 'num' || e == 'text'){
				input = document.createElement('input');
				input.type = 'text';
				label.appendChild(input);
				if(e == 'num'){
					input.onkeypress = function(event){
						if ((event.keyCode < 48) || (event.keyCode > 57)) 
  							event.returnValue = false;
					}
				}
			}
			if(e == 'date'){
				input = document.createElement('input');
				input.type = 'datetime-local';
				label.appendChild(input);
			}
			
			if(e instanceof Object){
				var input = document.createElement('select');
				for(var o in e){
					var option = document.createElement('option');
					option.value = e[o];
					option.innerHTML = o;
					input.appendChild(option);
					
				}
			
			}
			input.id = i;
			input.style.width = '120px';
			input.style.float = 'right';
			
			td2.appendChild(input);
			tr.appendChild(td2);
			table.appendChild(tr);
			
		}
		
		
		var buttons = document.createElement('tr');
		var tdsave = document.createElement('td');
		var save =  document.createElement('input');
		save.type = 'button';
		save.value = 'Save';
		tdsave.appendChild(save);
		tdsave.style.textAlign = 'right';
		buttons.appendChild(tdsave);
		var tdcancel = document.createElement('td');
		var cancel =  document.createElement('input');
		cancel.type = 'button';
		cancel.value = 'Cancel';
		tdcancel.appendChild(cancel);
		buttons.appendChild(tdcancel);
		table.appendChild(buttons);
		container.appendChild(table);
		
		cancel.onclick = function(){
			self._cancel(toolbar);
		}
		save.onclick = function(){
			self._save(toolbar, table);
		}


	},

	_cancel: function(toolbar){
		toolbar._enabled();
		$('#formIsochrone').remove();
		//L.Control.Draw.prototype.initialize.call(this, this.options);

	},
	_save: function(toolbar, form){
		$('#formIsochrone').remove();
		var form = form.getElementsByTagName('tr');
		for(var i= 0; i < form.length -2; i++){
			var option = form[i].lastChild.children[0];
			if(option.value != ''){
				this.params[option.id] = option.value;
			}
		}
		toolbar._enabled();


	}



 
	
});

SMC.isochroneControl = function(map) {
    return new SMC.controls.IsochroneControl(map);
};