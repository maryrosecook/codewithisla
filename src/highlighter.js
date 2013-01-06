;(function(exports) {
  var Isla, codeAnalyzer;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
  } else { // browser
    Isla = window.Isla;
    codeAnalyzer = window.codeAnalyzer;
  }

  exports.Highlighter = {};

  exports.Highlighter.highlight = function(str) {
    var markupPieces = codeAnalyzer.expressionSyntaxTokens(str);
    if (markupPieces === undefined) {
      return undefined;
    } else {
      var markup = "";
      for (var i = 0, iStr = 0; i < markupPieces.length; i++) {
        var piece = markupPieces[i];
        markup += "<span class='" + piece.syntax + "'>";

        var tokenCapped = false;
        var iToken = 0;
        while (true) {
          if (iToken < piece.code.length && piece.code[iToken] === " ") {
            markup += "&nbsp;";
            iStr++;
            iToken++;
          } else if (!tokenCapped && iToken === piece.code.length) {
            markup += "</span>";
            tokenCapped = true;
          } else if (str[iStr] === " ") {
            markup += "&nbsp;";
            iStr++;
          } else if(iToken < piece.code.length) {
            markup += piece.code[iToken];
            iStr++;
            iToken++;
          } else {
            break; // end of tok or end of code
          }
        }
      }

      return markup;
    }
  };
})(typeof exports === 'undefined' ? this : exports)
