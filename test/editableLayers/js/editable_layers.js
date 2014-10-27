/**
 * Test class to check providers functions
 *
 * @author Moisés Arcos (marcos@emergya.com)
 */

function initMap() {
        SMC.BASE_URL = "../../dist/"
        L.Icon.Default.imagePath = "../../dist/images";
        var map = SMC.map('map');
        map.setView([37.383333, -4.983333], 8);
        // Add base layer from OSM
        var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(map);
        // Add layers to control group
        var baseLayer = {
            "Open Street Map": OpenStreetMap_Mapnik
        };

        var leyenda = SMC.layerTreeControl(baseLayer, {
            collapsed: false
        }).addTo(map);

        var tree = [{
            type: "folder",
            label: 'REDIAM',
            layers: [{
                type: "folder",
                label: "Paisajes",
                layers: [{
                    type: "SMC.layers.WMSLayer",
                    url: "http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_mapa_paisaje_andalucia",
                    params: [{
                        layers: "categ_paisaj",
                        format: 'image/png',
                        transparent: true,
                        crs: L.CRS.EPSG4326,
                        attribution: "Map data &copy; REDIAM",
                        label: "Categorias paisajisticas",
                        zIndex: 10
                    }]
                }]
            }, {
                type: "folder",
                label: "Vias Pecuarias",
                layers: [{
                    type: "SMC.layers.WMSLayer",
                    url: "http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Inventario_VVPP",
                    params: [{
                        layers: "linea_base_deslindada",
                        format: 'image/png',
                        transparent: true,
                        crs: L.CRS.EPSG4326,
                        attribution: "Map data &copy; REDIAM",
                        label: "Linea Base Deslindada",
                        zIndex: 1000
                    }]
                }]
            }]
        }, {
            type: "folder",
            label: "Capas WFS-T",
            layers: [{
                type: "SMC.layers.markers.WFSTMarkerLayer",
                params: [{
                    serverURL: "http://geoemerg-win2008.emergya.es/geoserver/s/wfs",
                    typeName: "s:EDITABLE_PUNTO",
                    label: "Prueba WFST"
                }]
            }, {
                type: "SMC.layers.markers.WFSTMarkerLayer",
                params: [{
                    serverURL: "http://www.ideandalucia.es/dea100/wfs",
                    typeName: "ideandalucia:it01_puerto_pun",
                    label: "Puertos"
                }]
            }]
        }];
        map.loadLayers(tree);
    }
    // On load the page call init map function
window.onload = initMap;
