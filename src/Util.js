require("./SMC.js");


SMC.Util = {
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