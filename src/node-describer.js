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

  var describe = multimethod()
    .dispatch(function(node) {
      return node.syntax;
    })

    .when("variable", function(node, env) {
      var val = Isla.Interpreter.evaluateValue(node, env).val;
      var body = "This thing has no value, yet.";
      if (val !== undefined) {
        body = val.toString();
        if(Isla.Utils.type(val) === "String") {
          body = "A thing: '" + val + "'";
        }
      }

      return {
        body: body
      };
    })

    .when("type", function(node, env) {
      return {
        body: "A type of thing. For example: a circle.",
      };
    })

    .when("literal", function(node, env) {
      return {
        body: "Some words.",
      };
    })

    .when("keyword", function(node, env) {
      if (node.tag === "is_a") {
        return { body: "Helps make a new thing. For example: a circle.", };
      } else if (node.tag === "is") {
        return { body: "Gives a thing a name.", };
      } else if (node.tag === "add") {
        return { body: "Add a thing to a list.", };
      } else if (node.tag === "take") {
        return { body: "Take a thing out of a list.", };
      } else if (node.tag === "to_from") {
        if (node.code === "to") {
          return { body: "Goes with 'add' to add a thing to a list.", };
        } else if (node.code === "from") {
          return { body: "Goes with 'take' to take a thing from a list.", };
        }
      }
    })

    .default(function(node, env) { // undefined syntax
      return describe(node.c[0], env);
    })

  var nodeDescriber = {
    describe: describe
  };

  exports.nodeDescriber = nodeDescriber;
})(typeof exports === 'undefined' ? this : exports)
