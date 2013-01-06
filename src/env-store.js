;(function(exports) {
  var Isla;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
  } else { // browser
    Isla = window.Isla;
  }

  var EnvStore = function() {
    var committedEnvs = [];
    var tempEnv = undefined;

    this.write = function(e) {
      if (e.event === "commit") {
        if (tempEnv !== undefined) {
          committedEnvs.push(tempEnv);
          tempEnv = undefined;
        } else {
          throw "Temp environment is null or undefined"
        }
      } else {
        if (e.env != null) {
          tempEnv = extend(true, {}, e.env);
        } else {
          throw "Environment is null or undefined"
        }
      }
    },

    this.latest = function() {
      var env;
      if (tempEnv === undefined) {
        env = committedEnvs[committedEnvs.length - 1];
      } else {
        env = tempEnv;
      }

      return extend(true, {}, env);
    }
  };

  // copied from jquery to avoid plugin dependency on jq.
  var extend = function() {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" &&
      !Isla.Utils.type(target) === "Function" ) {
      target = {};
    }

    for ( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) != null ) {
        // Extend the base object
        for ( name in options ) {
          src = target[ name ];
          copy = options[ name ];

          // Prevent never-ending loop
          if ( target === copy ) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if ( deep && copy && ( Isla.Utils.type(copy) === "Object" ||
              (copyIsArray = (Isla.Utils.type(copy) === "Array")) ) ) {
            if ( copyIsArray ) {
              copyIsArray = false;
              clone = src && Isla.Utils.type(src) === "Array" ? src : [];

            } else {
              clone = src && Isla.Utils.type(src) === "Object" ? src : {};
            }

            // Never move original objects, clone them
            target[ name ] = extend( deep, clone, copy );

          // Don't bring in undefined values
          } else if ( copy !== undefined ) {
            target[ name ] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  };

  exports.EnvStore = EnvStore;
  exports.EnvStore.extend = extend;
})(typeof exports === 'undefined' ? this : exports)
