;(function(exports) {
  var Isla, _;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
    _ = require("Underscore");
  } else { // browser
    Isla = window.Isla;
    _ = window._;
  }

  var codeAnalyzer = {
    expressionTokens: function(line) {
      try {
        var ast = Isla.Parser.parse(line);
        return Isla.Parser.extract(ast, "root", 0, "block", 0,
                                        "expression", 0).c;
      } catch(e) {
        return undefined;
      }
    },

    expressionSyntaxTokens: function(line) {
      var tokens = codeAnalyzer.expressionTokens(line)
      if (tokens !== undefined) {
        return expressionSyntaxTokens(tokens, []);
      } else {
        return undefined;
      }
    },

    getLineNumber: function(text, index) {
      var lineNumber;
      if (index !== undefined) {
        lineNumber = 0;
        for (var i = 0; i < text.length; i++) {
          if (codeAnalyzer.isAtNewlineStart(text, i)) {
            lineNumber++;
          } else if (i === index) {
            break;
          }
        }
      }
      return lineNumber;
    },

    getLine: function(text, index) {
      var lineNumber = codeAnalyzer.getLineNumber(text, index);
      if(lineNumber !== undefined) {
        return text.split("\n")[lineNumber];
      }
    },

    getSyntaxTokenIndex: function(text, index) {
      if (codeAnalyzer.isInNewline(text, index)) {
        return undefined; // abort if on line but hovering over nl
      }

      var line = codeAnalyzer.getLine(text, index);
      var syntaxTokens = codeAnalyzer.expressionSyntaxTokens(line);
      if (syntaxTokens === undefined) {
        return undefined;
      }

      var lineIndex = getLineIndex(text, index);
      return _.reduce(syntaxTokens, function(acc, x, i) {
        return lineIndex >= x.index - 1 ? i : acc;
      }, 0);
    },

    isAtNewlineStart: function(text, index) {
      return text.substring(index, index + 1) === "\n"
    },

    isInNewline: function(text, index) {
      return text.substring(index, index + 1) === "\n" ||
        text.substring(index - 1, index) === "\n";
    },
  };

  var expressionSyntaxTokens = function(tokens, pieces) {
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (token.syntax !== undefined) {
        var piece = {};
        piece.code = getCode(token);
        piece.syntax = token.syntax;
        piece.index = token.index;
        pieces.push(piece);
      } else {
        expressionSyntaxTokens(token.c, pieces);
      }
    }

    return pieces;
  };

  var getLineIndex = function(text, index) {
    var lineNumber = codeAnalyzer.getLineNumber(text, index);
    return index - _.reduce(text.split("\n"), function(acc, x, i) {
      return i < lineNumber ? acc + x + "\n" : acc;
    }, "\n").length - 1; // start w nl because all subsequent lines have them
  };

  var getCode = function(token) {
    if (token.c[0].tag !== undefined) { // explore down ast
      return getCode(token.c[0]);
    } else {
      return token.code || token.c[0];
    }
  };

  exports.codeAnalyzer = codeAnalyzer;
})(typeof exports === 'undefined' ? this : exports)
