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
    expression: function(code) {
      try {
        var ast = Isla.Parser.parse(code);
        return Isla.Parser.extract(ast, "root", 0, "block", 0,
                                        "expression", 0);
      } catch(e) {
        return undefined;
      }
    },

    expressionTokens: function(code) {
      var expression = codeAnalyzer.expression(code);
      return expression !== undefined ? expression.c : undefined;
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
          if (codeAnalyzer.isAtNewline(text, i)) {
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
      if (lineNumber !== undefined) {
        return text.split("\n")[lineNumber];
      }
    },

    getSyntaxTokenIndex: function(text, index) {
      var line = codeAnalyzer.getLine(text, index);
      var syntaxTokens = codeAnalyzer.expressionSyntaxTokens(line);
      if (syntaxTokens === undefined) {
        return undefined;
      }

      var lineIndex = codeAnalyzer.getLineIndex(text, index);
      var tokenIndex = undefined;
      for (var i = 0; i < syntaxTokens.length; i++) {
        var tok = syntaxTokens[i];
        if(lineIndex >= tok.index && lineIndex < tok.index + tok.code.length) {
          tokenIndex = i;
          break;
        }
      }

      return tokenIndex;
    },

    isAtNewline: function(text, index) {
      return text.substring(index, index + 1) === "\n";
    },

    getCode: function(token) {
      if (token.c[0].tag !== undefined) { // explore down ast
        return codeAnalyzer.getCode(token.c[0]);
      } else {
        return token.code || token.c[0];
      }
    },

    getLineIndex: function(text, index) {
      var lineNumber = codeAnalyzer.getLineNumber(text, index);
      return index - _.reduce(text.split("\n"), function(acc, x, i) {
        return i < lineNumber ? acc + x + "\n" : acc;
      }, "").length;
    }
  };

  var expressionSyntaxTokens = function(tokens, pieces) {
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (token.syntax !== undefined) {
        var piece = {};
        piece.code = codeAnalyzer.getCode(token);
        piece.syntax = token.syntax;
        piece.index = token.index;
        piece.node = token;
        pieces.push(piece);
      } else {
        expressionSyntaxTokens(token.c, pieces);
      }
    }

    return pieces;
  };

  exports.codeAnalyzer = codeAnalyzer;
})(typeof exports === 'undefined' ? this : exports)
