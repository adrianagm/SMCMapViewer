require("./Styler.js");
require("../../../lib/LeafletHtmlIcon.js");
var Mustache = require("../../../lib/mustache.js/mustache.js");


/**
 * Parser of MarkerCSS, for user with SMC Viewer's marker layers.
 *
 * @class
 * @extends SMC.layers.stylers.Styler
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.stylers.MarkerCssStyler = SMC.layers.stylers.Styler.extend(
    /** @lends SMC.layers.stylers.MarkerCssStyler# */
    {
        initialize: function(options){
            this._parser_url = "../../src/layers/stylers/parser.txt";
            SMC.layers.stylers.Styler.prototype.initialize.apply(this, arguments);
        },
        applyStyle: function(marker, zoom) {
            var properties = marker.properties;
            var style = this._createStyles(marker, zoom);
            if (!style)
                style = "";

            var icon, width, height, anchorLeft, anchorTop;

            width = style.markerWidth || 0;
            height = style.markerHeight || 0;

            anchorLeft = style.anchorLeft || 0;
            anchorTop = style.anchorTop || 0;

            var disableClustering = !! style.disableClustering;

            if (style.iconUrl) {
                // Load normal marker icon with the specified url.


                icon = new L.icon({
                    iconUrl: style.iconUrl,
                    iconSize: [width, height],
                    iconAnchor: [anchorLeft, anchorTop]
                });

            } else if (style.templateUrl) {
                // Load the given page from its url in an iframe.

                icon = new L.HtmlIcon({
                    //html: "<iframe src=" + style.templateUrl + ' style=" border: none;width:' + width + 'px;height:' + height + 'px;margin-top:-' + anchorTop + 'px;margin-left:-' + anchorLeft + 'px"></iframe>',
                    html: this._createHTMLElement("iframe", {
                        "src": style.templateUrl
                    }, {
                        "border": "none",
                        "width": {
                            value: width,
                            units: "px"
                        },
                        "height": {
                            value: height,
                            units: "px",
                        },
                        "margin-top": {
                            value: "-" + anchorTop,
                            units: "px"
                        },
                        "margin-left": {
                            value: "-" + anchorLeft,
                            units: "px"
                        }
                    })
                });


            } else if (style.htmlTemplate) {
                // Load the template into the marker.
                // TODO: "inflate the template" using mustache.
                var data = {};
                for (var propKey in properties) {
                    data[propKey] = properties[propKey];
                }


                var output = Mustache.render(style.htmlTemplate, data);


                //var container = '<div style=" width:' + width + 'px;height:' + height + 'px;margin-top:-' + anchorTop + 'px;margin-left:-' + anchorLeft + 'px">' + output + "</div>";

                icon = new L.HtmlIcon({
                    html: this._createHTMLElement("div", {

                    }, {
                        "width": {
                            value: width,
                            units: "px"
                        },
                        "height": {
                            value: height,
                            units: "px",
                        },
                        "margin-top": {
                            value: "-" + anchorTop,
                            units: "px"
                        },
                        "margin-left": {
                            value: "-" + anchorLeft,
                            units: "px"
                        }
                    }, output),

                });

            } else if (style.iconClassName) {

                icon = new L.HtmlIcon({
                    //html: '<div class="'+style.iconClassName+'" style=" border: none;width:' + width + 'px;height:' + height + 'px;margin-top:-' + anchorTop + 'px;margin-left:-' + anchorLeft + 'px"></div>',
                    html: this._createHTMLElement("div", {
                        "class": style.iconClassName
                    }, {
                        "border": "none",
                        "width": {
                            value: width,
                            units: "px"
                        },
                        "height": {
                            value: height,
                            units: "px",
                        },
                        "margin-top": {
                            value: anchorTop,
                            units: "px"
                        },
                        "margin-left": {
                            value: anchorLeft,
                            units: "px"
                        }
                    }),

                });
            } else {
                icon = new L.icon({
                    iconUrl: L.Icon.Default.imagePath + "/marker-icon.png",
                    iconAnchor: [13, 41]
                });
            }

            return {
                icon: icon,
                disableClustering: disableClustering
            };

        },

        _createHTMLElement: function(elementType, attributes, styles, content) {

            if (!content) {
                content = "";
            }

            var attributesString = "";
            for (var attrKey in attributes) {
                attributesString += attrKey + '="' + attributes[attrKey] + '"';
            }

            var stylesString = "";
            for (var styleKey in styles) {
                var style = styles[styleKey];
                if (!style) {
                    continue;
                } else if (typeof style == "object") {
                    if (style.value) {
                        stylesString += styleKey + ":" + style.value;
                        if (style.units) {
                            stylesString += style.units;
                        }
                        stylesString += ";";
                    }
                } else {
                    stylesString += styleKey + ":" + style;
                    stylesString += ";";
                }

            }


            return "<" + elementType + " " + attributesString + " style=\"position:absolute;" + stylesString + "\">" + content + "</" + elementType + ">";
        },

        addPopUp: function(marker, zoom) {

            if (marker.popup) {
                marker.unbindPopup();
            }


            var style = this._addContentPopUp(marker.properties, zoom);
            if (!style)
                style = "";
            var offsetLeft = style.offsetLeft || 0;
            var offsetTop = style.offsetTop || 0;


            var content;
            if (style.popUpTemplate) {
                var data = {};
                for (var propKey in marker.properties) {
                    data[propKey] = marker.properties[propKey];
                }

                var output = Mustache.render(style.popUpTemplate, data);

                content = output;

            } else if (style.popUpUrl) {
                content = "<iframe src=" + style.popUpUrl + "/>";

            } else if (style.noPopUp) {
                marker.unbindPopup();

            } else {
                var data = {};
                var template = "";
                for (var propKey in marker.properties) {
                    data[propKey] = marker.properties[propKey];
                    template += propKey + ": <b>{{" + propKey + "}}</b><br>";
                }

                content = Mustache.render(template, data);

            }



            var offset = [offsetLeft, offsetTop];
            if (content) {
                marker.bindPopup(content, {
                    offset: offset
                });
            }



        },

        _addContentPopUp: function(properties, zoom) {
            // To be overriden in derivate classes.
            return {
                defaultPopUp: true
            };
        }
    });
