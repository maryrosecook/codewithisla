;(function(exports) {
  var codeAnalyzer;
  if(typeof module !== 'undefined' && module.exports) { // node
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
  } else { // browser
    codeAnalyzer = window.codeAnalyzer;
  }

  var mapper = {
    offset: function(point, padding) {
      return {
        x: point.x - padding.l,
        y: point.y - padding.t
      };
    },

    // returns cell that text point is at
    getIndex: function(text, point, characterDimensions) {
      for (var i = 0, x = 0, y = characterDimensions.y; i < text.length; i++) {
        if (codeAnalyzer.isAtNewlineStart(text, i)) {
          y += characterDimensions.y;
          x = 0;
          i++; // skip over nl char
        } else  { // not reached end of line
          x += characterDimensions.x
        }

        if (point.x >= x - characterDimensions.x && point.x < x &&
            point.y >= y - characterDimensions.y && point.y < y) {
          return i;
        }
      }

      return undefined;
    }
  };

  exports.mapper = mapper;
})(typeof exports === 'undefined' ? this : exports)
