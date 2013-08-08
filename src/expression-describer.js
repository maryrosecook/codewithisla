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

  // returns var name as str - 'age' or 'mary age'
  var getVariableNameStr = function(node, env) {
    return _.reduce(Isla.Parser.extract(node, "variable"), function(a, x) {
      return a + x.c + " ";
    }, "").slice(0, -1);
  };

  // returns literal if literal or var name if variable
  var getValueStr = function(node, env) {
    if (node.c[0].tag === "literal") { // print actual value
      return codeAnalyzer.getCode(node);
    } else {
      return getVariableNameStr(node.c[0], env);
    }
  };

  var errorMessage = function(line, env) {
    try {
      Isla.Interpreter.interpret(line, env.clone());
    } catch (e) {
      return e.message;
    }
  };

  var describe = multimethod()
    .dispatch(function(line) {
      return codeAnalyzer.expression(line).tag;
    })

    .when("type_assignment", function(line, env) {
      var node = codeAnalyzer.expression(line);
      var assigneeNode = node.c[0].c[0];
      var ref = getVariableNameStr(assigneeNode, env);
      var type = Isla.Interpreter.interpretAst(node.c[2], env);
      return "Makes a " + type + " called " + ref + ".";
    })

    .when("value_assignment", function(line, env) {
      var node = codeAnalyzer.expression(line);
      var assigneeNode = node.c[0].c[0];
      return errorMessage(line, env) ||
        getVariableNameStr(assigneeNode, env) + " is now " +
        getValueStr(node.c[2], env) + ".";
    })

    .when("list_assignment", function(line, env) {
      var error = errorMessage(line, env);
      if (error !== undefined) {
        return error;
      } else {
        var node = codeAnalyzer.expression(line);
        var listNode = node.c[3].c[0];
        var listName = getVariableNameStr(listNode, env);
        var value = getValueStr(node.c[1], env);

        var operation = Isla.Parser.extract(node.c, 0, "list_operation", 0).tag;
        if (operation === "add") {
          return "Puts " + value + " into the list called " + listName + ".";
        } else if (operation === "take") {
          return "Takes " + value + " out of the list called " + listName + ".";
        }
      }
    })

    .when("invocation", function(line, env) {
      var error = errorMessage(line, env);
      if (error !== undefined) {
        return error;
      } else {
        var node = codeAnalyzer.expression(line);
        var fnNameNode = Isla.Parser.extract(node, "invocation", 0);
        var fn = Isla.Interpreter.evaluateValue(fnNameNode, env);
        var paramValue = getValueStr(node.c[1], env);
        return fn.description(paramValue);
      }
    })

  var expressionDescriber = {
    describe: describe
  };

  exports.expressionDescriber = expressionDescriber;
})(typeof exports === 'undefined' ? this : exports)
