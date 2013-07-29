;(function(exports) {
  var Isla, codeAnalyzer;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
    _ = require("Underscore");
  } else { // browser
    Isla = window.Isla;
    codeAnalyzer = window.codeAnalyzer;
    _ = window._;
  }

  var spaceToNbsp = function(str) {
    return str.replace(/ /g, "&nbsp;");
  };

  var toSpan = function(t) {
    return "<span class='" + t.syntax + "'>" + spaceToNbsp(t.code) + "</span>";
  };

  var addSpaceToken = function(tokens, spaceLen) {
    return spaceLen > 0 ? tokens.concat({ code: new Array(spaceLen).join(" ") }) : tokens;
  };

  var codeLen = function(tokens) {
    return _.reduce(tokens, function(a, x) {
      return a + x.code.length;
    }, 0);
  };

  exports.Highlighter = {};

  exports.Highlighter.highlight = function(str) {
    var markupPieces = codeAnalyzer.expressionSyntaxTokens(str);

    if (markupPieces === undefined) {
      return spaceToNbsp(str);
    } else {
      // reintroduce spaces from orig code between marked up tokens
      var spacedMarkup = _.reduce(markupPieces, function(a, x) {
        return addSpaceToken(a, x.index + 1 - codeLen(a)).concat(x);
      }, []);
      spacedMarkup = addSpaceToken(spacedMarkup, str.length + 1 - codeLen(spacedMarkup));

      return _.reduce(spacedMarkup, function(a, x) {
        return a + (x.syntax === undefined ? spaceToNbsp(x.code) : toSpan(x));
      }, "");
    }
  };
})(typeof exports === 'undefined' ? this : exports)
