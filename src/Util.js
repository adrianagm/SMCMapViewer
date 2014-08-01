require("./SMC.js");


SMC.Util = {
    deepClassInclude: function(classes) {
        var result = [];
        for (var i = 0; i < classes.length; i++) {
            var c = classes[i];
            var parentIncludes;
            if (c.__super__) {
                parentIncludes = SMC.Util.deepClassInclude([c.__super__]);
                for (var j = 0; j < parentIncludes.length; j++) {
                    result.push(parentIncludes[j]);
                }
            }

            if (c.prototype) {
                result.push(c.prototype);
            } else {
                result.push(c);
            }
        }

        return result;
    },

    /**
     * Returns a class object from its name (including path).
     */
    getClass: function(className) {
        var typePaths = className.split(".");
        var classObject = window;
        for (var i = 0; i < typePaths.length; i++) {
            classObject = classObject[typePaths[i]];
        }

        if (!classObject.prototype) {
            throw new Error("SMC.layers.LayerLoader::_loadLayerConfig: layer config in position " + idx + " defined type '" + type + "' is not a valid class");
        }

        return classObject;
    },

    /**
     * Gets a constructor function for the specified class.
     */
    getConstructor: function(classObject) {
        return (function() {
            function F(args) {
                if (arguments.length > 1) {
                    return classObject.apply(this, args);
                } else {
                    return classObject.apply(this, args[0]);
                }

            }
            F.prototype = classObject.prototype;

            return function(args) {
                return new F(arguments);
            };
        })();
    }
};

/**
 * We override the extend function so we have the __super__ property avalaible also in the class prototype.
 * This allows us to have a complete class hierarchy for use in SMC.Util.deepClassInclude
 */
L.Class.extend = function(props) {

    // extended class with the new prototype
    var NewClass = function() {

        // call the constructor
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }

        // call all constructor hooks
        if (this._initHooks) {
            this.callInitHooks();
        }
    };

    // instantiate class without calling constructor
    var F = function() {};
    F.prototype = this.prototype;

    var proto = new F();
    proto.constructor = NewClass;

    NewClass.prototype = proto;

    //inherit parent's statics
    for (var i in this) {
        if (this.hasOwnProperty(i) && i !== 'prototype') {
            NewClass[i] = this[i];
        }
    }

    // mix static properties into the class
    if (props.statics) {
        L.extend(NewClass, props.statics);
        delete props.statics;
    }

    // mix includes into the prototype
    if (props.includes) {
        L.Util.extend.apply(null, [proto].concat(props.includes));
        delete props.includes;
    }

    // merge options
    if (props.options && proto.options) {
        props.options = L.extend({}, proto.options, props.options);
    }

    // mix given properties into the prototype
    L.extend(proto, props);

    proto._initHooks = [];

    var parent = this;
    // jshint camelcase: false
    NewClass.__super__ = parent.prototype;
    NewClass.prototype.__super__ = parent.prototype;

    // add method for calling all hooks
    proto.callInitHooks = function() {

        if (this._initHooksCalled) {
            return;
        }

        if (parent.prototype.callInitHooks) {
            parent.prototype.callInitHooks.call(this);
        }

        this._initHooksCalled = true;

        for (var i = 0, len = proto._initHooks.length; i < len; i++) {
            proto._initHooks[i].call(this);
        }
    };

    return NewClass;
};
