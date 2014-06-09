require("./Styler.js");
var Mustache = require("../../../lib/mustache.js/mustache.js");

/**
 * MapCSS styles parser, for user with SMC Viewer's geometry layers.
 *
 * @class
 * @extends SMC.layers.stylers.Styler
 *
 * @author Luis Román (lroman@emergya.com)
 */
SMC.layers.stylers.MapCssStyler = SMC.layers.stylers.Styler.extend(
    /** @lends SMC.layers.stylers.MapCSSStyler# */
    {
        labels: [],
        applyStyle: function(feature, ctx, zoom) {

            var style = this._createStyles(feature, zoom);
            if (!style)
                style = "";

            if (feature.geometry.type == 'Point' || feature.geometry.type == 'MultiPoint') {
                var path;
                switch (style.symbol) {
                    case 'Circle':
                        path = new ctx.canvas._paper.Path.Circle({
                            radius: style.radius || 3
                        });
                        break;

                    case 'Rectangle':
                        path = new ctx.canvas._paper.Path.Rectangle({
                            size: style.size || [10, 10]
                        });
                        break;

                    case 'Ellipse':
                        path = new ctx.canvas._paper.Path.Ellipse({
                            size: style.size || [10, 8]
                        });
                        break;

                    case 'RegularPolygon':
                        path = new ctx.canvas._paper.Path.RegularPolygon({
                            sides: style.sides || 3,
                            radius: style.radius || 5
                        });
                        break;

                    case 'Star':
                        path = new ctx.canvas._paper.Path.Star({
                            points: style.points || 5,
                            radius1: style.radius1 || 3,
                            radius2: style.radius2 || 5
                        });
                        break;
                    default:
                        path = new ctx.canvas._paper.Path.Circle({
                            radius: 3
                        });
                        break;

                }


            }

            if (feature.geometry.type == 'LineString' || feature.geometry.type == 'MultiLineString') {
                style.fillColor = 'rgba(0,0,0,0)';
                style.strokeColor = style.strokeColor || "black";
            }

            var pathStyle = {

                fillColor: style.fillColor || 'rgba(0,0,0,0)',
                strokeColor: style.strokeColor || style.fillColor || "black",
                strokeWidth: style.strokeWidth || 2,
                strokeJoin: style.strokeJoin || 'miter',
                dashArray: style.dashArray || [],
                strokeCap: style.strokeCap || 'butt',
                dashOffset: style.dashOffset || 0,
                miterLimit: style.miterLimit || 10,
                windingRule: style.windingRule || 'nonzero',
                selectedColor: style.selectedColor || 'aqua',
                shadowColor: style.shadowColor || 'black',
                shadowBlur: style.shadowBlur || 0,
                shadowOffset: style.shadowOffset || []


            }
            var opacity = style.opacity ? style.opacity : 1;
            var offset = style.offset ? style.offset : 0;
            var zIndex = style.zIndex ? style.zIndex : 0;
            var visible = !style.invisible ? true : false;

            return {
                pathStyle: pathStyle,
                opacity: opacity,
                path: path,
                offset: offset,
                zIndex: zIndex,
                visible: visible
            }



        },

        _createStyles: function(feature, zoom) {
            return {
                style: null
            };

        },

        addLabelStyle: function(feature, zoom) {

            var labelStyle = this._createLabel(feature, zoom);


            var content;
            if (labelStyle.content) {
                if (labelStyle.uniqueLabel) {

                    if (this.labels.length == 0) {
                        this.labels.push(labelStyle.content);
                        content = labelStyle.content;
                    } else {
                        var i = 0;
                        var exists = false;
                        while ((i < this.labels.length) && !exists) {
                            if (labelStyle.content == this.labels[i]) {
                                exists = true;
                            }
                            i++;
                        }
                        if (!exists) {
                            this.labels.push(labelStyle.content);
                            content = labelStyle.content;
                        }
                    }


                } else
                    content = labelStyle.content;
            }

            var style = {
                fillColor: labelStyle.fillColor || 'black',
                fontFamily: labelStyle.fontFamily || 'sans-serif',
                fontWeight: labelStyle.fontWeight || 'normal',
                fontSize: labelStyle.fontSize || 10,
                leading: labelStyle.leading || labelStyle.fontSize * 1.2,
                shadowColor: labelStyle.shadowColor || 'black',
                shadowBlur: labelStyle.shadowBlur || 0,
                shadowOffset: labelStyle.shadowOffset || []
            }



            return {
                content: content,
                style: style
            };
        },

        _createLabel: function(feature, zoom) {
            return {
                labelStyle: null
            };
        },

        addPopUp: function(feature, zoom) {


            var style = this._addContentPopUp(feature, zoom);
            var offsetLeft = style.offsetLeft || 0;
            var offsetTop = style.offsetTop || 0;


            var content;
            if (style.popUpTemplate) {
                var data = {};
                for (var propKey in feature.properties) {
                    data[propKey] = feature.properties[propKey];
                }

                content = Mustache.render(style.popUpTemplate, data);



            } else if (style.popUpUrl) {
                content = "<iframe src=" + style.popUpUrl + "/>";

            } else if (style.noPopUp) {
                content = null;

            } else {
                var data = {};
                var template = "";
                for (var propKey in feature.properties) {
                    data[propKey] = feature.properties[propKey];
                    template += propKey + ": <b>{{" + propKey + "}}</b><br>";
                }

                content = Mustache.render(template, data);

            }



            var offset = [offsetLeft, offsetTop];

            return {
                content: content,
                offset: offset
            }



        },

        _addContentPopUp: function(feature, zoom) {
            // To be overriden in derivate classes.
            return {
                defaultPopUp: true
            };
        }


    });
