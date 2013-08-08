;(function(exports) {
  var Isla, _, multimethod;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
    _ = require("Underscore");
  } else { // browser
    Isla = window.Isla;
    codeAnalyzer = window.codeAnalyzer;
    _ = window._;
  }

  var nodeDescriber = {
    describe: function(text, index, env) {
      var syntaxNode = codeAnalyzer.getSyntaxNode(text, index);
      if (syntaxNode.node.syntax === "variable" || syntaxNode.node.syntax === "attribute") {
        var token = codeAnalyzer.getExpressionTokenFromWholeCode(text, index);
        var objToken = Isla.Parser.find(token, "variable");
        var indexOnLine = codeAnalyzer.getLineIndex(text, index);
        objToken.c = getVariablePart(objToken.c, indexOnLine); // hack off trailing idents
        var val = Isla.Interpreter.evaluateValue(objToken, env);

        return describeValue(val, env);
      } else {
        return undefined;
      }
    }
  };

  // takes full variable token (a b c) and returns part up to index
  var getVariablePart = function(token, index) {
    return _.reduce(token, function(a, x) {
      return index >= x.index ? a.concat(x) : a;
    }, []);
  };

  var describeValue = function(val, env) {
    var description = "Has no value.";
    if (val !== undefined) {
      if(Isla.Utils.type(val) === "String") {
        description = "'" + val + "'";
      } else {
        // can't just use Isla's toString - want to exclude _private attrs
        description = "";
        var lines = val.toString().split("\n");
        for (var i = 0; i < lines.length; i++) {
          if (lines[i].indexOf("_") === -1) { // exclude private attrs
            description += lines[i];
            if (i < lines.length - 1) {
              description += "\n";
            }
          }
        }
      }
    }

    return description;
  }

  exports.nodeDescriber = nodeDescriber;
})(typeof exports === 'undefined' ? this : exports)
