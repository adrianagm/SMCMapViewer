require("./SMC.js");


SMC.Util = {
    deepClassInclude: function(classes) {
        var result = [];
        for (var i = 0; i < classes.length; i++) {
            var c = classes[i];

            if (c.__super__) {
                var parentIncludes = SMC.Util.deepClassInclude([c.__super__]);
                for (var j = 0; j < parentIncludes.length; j++) {
                    result.push(parentIncludes[j]);
                }
            }

            if (c.prototype) {
                result.push(c.prototype);
            } else if (c.__proto__) {
                result.push(c.__proto__);
            } else {
                result.push(c);
            }
        }

        return result;
    }
};
