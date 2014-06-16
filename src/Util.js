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
