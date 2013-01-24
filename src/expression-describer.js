;(function(exports) {
  var Isla, _, multimethod, codeAnalyzer;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
    _ = require("Underscore");
    multimethod = require('multimethod');
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
  } else { // browser
    Isla = window.Isla;
    _ = window._;
    multimethod = window.multimethod;
    codeAnalyzer = window.codeAnalyzer;
  }

  // returns full reference as str - 'age' or 'mary age'
  var getReferenceStr = function(node, env) {
    var refId = Isla.Interpreter.evaluateValue(node, env).ref;
    if (Isla.Utils.type(refId) === "String") {
      return refId;
    } else {
      return refId[0] + " " + refId[1];
    }
  };

  // returns literal if literal or ref if variable
  var getValueStr = function(node, env) {
    if (node.c[0].tag === "literal") { // print actual value
      return codeAnalyzer.getCode(node);
    } else {
      return getReferenceStr(node.c[0], env);
    }
  };

  var describe = multimethod()
    .dispatch(function(node) {
      return node.tag;
    })

    .when("type_assignment", function(node, env) {
      var ref = getReferenceStr(node.c[0].c[0], env);
      var type = Isla.Interpreter.interpretAst(node.c[2], env);
      return "Makes a " + type + " called " + ref + ".";
    })

    .when("value_assignment", function(node, env) {
      var assiRef = getReferenceStr(node.c[0].c[0], env);
      var value = getValueStr(node.c[2], env);
      return assiRef + " is now " + value + ".";
    })

    .when("list_assignment", function(node, env) {
      var listRef = getReferenceStr(node.c[3].c[0], env);
      var value = getValueStr(node.c[1], env);

      var operation = Isla.Parser.extract(node.c, 0, "list_operation", 0).tag;
      if (operation === "add") {
        return "Puts " + value + " into the list called " + listRef + ".";
      } else if (operation === "take") {
        return "Takes " + value + " out of the list called " + listRef + ".";
      }
    })

    .when("invocation", function(node, env) {
      var fnNameNode = Isla.Parser.extract(node, "invocation", 0);
      var fnId = Isla.Interpreter.interpretAst(fnNameNode, env);
      var descriptionFn = Isla.Interpreter.resolve({
        ref: fnId
      }, env).description;
      var paramValue = getValueStr(node.c[1], env);
      return descriptionFn(paramValue);
    })

  var expressionDescriber = {
    describe: describe
  };

  exports.expressionDescriber = expressionDescriber;
})(typeof exports === 'undefined' ? this : exports)
