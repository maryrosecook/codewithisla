;(function(exports) {
  var Isla, _, multimethod;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
    _ = require("Underscore");
    multimethod = require('multimethod');
  } else { // browser
    Isla = window.Isla;
    _ = window._;
    multimethod = window.multimethod;
  }

  var nodeDescriber = {
    describe: multimethod()
      .dispatch(function(node) {
        return node.tag;
      })

      .when("assignee", function(node, env) {
        var val = Isla.Interpreter.evaluateValue(node.c[0], env).val;
        var body = "";
        if (val != null) {
          body = val.toString();
        }

        return {
          body: body
        };
      })

      .default(function() {
        return { body:"" };
      })
  };

  exports.nodeDescriber = nodeDescriber;
})(typeof exports === 'undefined' ? this : exports)
