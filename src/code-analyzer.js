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
    parses: function(code) {
      try {
        Isla.Parser.parse(code);
        return true;
      } catch(e) {
        return false;
      }
    },

    expression: function(code) {
      var block;
      try {
        var ast = Isla.Parser.parse(code);
        block = Isla.Parser.extract(ast, "root", 0, "block");
      } catch(e) {
        return undefined;
      }

      if (block.length > 1) {
        throw "You passed code with more than one expression.";
      } else {
        return Isla.Parser.extract(block, 0, "expression", 0);
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
      if (index !== undefined) {
        var lineNumber = 0;
        for (var i = 0; i < text.length; i++) {
          if (i === index && codeAnalyzer.isAtNewline(text, i)) {
            return undefined;
          } else if (codeAnalyzer.isAtNewline(text, i)) {
            lineNumber++;
          } else if (i === index) {
            return lineNumber;
          }
        }
      }
    },

    getLine: function(text, lineNumber) {
      if (lineNumber !== undefined) {
        return codeAnalyzer.splitLines(text)[lineNumber];
      }
    },

    getSyntaxTokenIndex: function(text, index) {
      var lineNumber = codeAnalyzer.getLineNumber(text, index);
      var line = codeAnalyzer.getLine(text, lineNumber);
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
      return index - _.reduce(codeAnalyzer.splitLines(text),
        function(acc, x, i) {
          return i < lineNumber ? acc + x + "\n" : acc;
        }, "").length;
    },

    splitLines: function(text) {
      return text.split("\n");
    },

    getSyntaxNode: function(text, index) {
      var lineNumber = codeAnalyzer.getLineNumber(text, index);
      var line = codeAnalyzer.getLine(text, lineNumber);
      var syntaxTokens = codeAnalyzer.expressionSyntaxTokens(line);
      var syntaxTokenIndex = codeAnalyzer.getSyntaxTokenIndex(text, index);
      return syntaxTokens[syntaxTokenIndex];
    },

    getExpressionTokenFromWholeCode: function(text, index) {
      var lineNumber = codeAnalyzer.getLineNumber(text, index);
      var line = codeAnalyzer.getLine(text, lineNumber);
      var tokens = codeAnalyzer.expressionTokens(line);
      var lineIndex = codeAnalyzer.getLineIndex(text, index);

      var tokenIndex = _.reduce(tokens, function(a, x, i) {
        return lineIndex >= x.index ? i : a;
      }, 0);

      return tokens[tokenIndex];
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
