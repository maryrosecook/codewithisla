;(function(exports) {
  var codeAnalyzer;
  if(typeof module !== 'undefined' && module.exports) { // node
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
  } else { // browser
    codeAnalyzer = window.codeAnalyzer;
  }

  var Mapper = function(terminal) {
    this.terminal = terminal;
  };

  Mapper.prototype = {
    // returns cell that text point is at
    getIndex: function(text, relativePoint, characterDimensions) {
      var point = offset(relativePoint, this.terminal.getOffset());
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
    },

    getLineNumber: function(text, relativePoint, characterDimensions) {
      var point = offset(relativePoint, this.terminal.getLineOffset());
      if (point.x < 0 || point.x >= this.terminal.getWidth()) {
        return undefined;
      }

      var lines = text.split("\n");
      for (var i = 0, y = characterDimensions.y; i < lines.length; i++) {
        if (point.y >= y - characterDimensions.y && point.y < y) {
          return i;
        }
        y += characterDimensions.y;
      }

      return undefined;
    }
  };

  var offset = function(point, offset) {
    return {
      x: point.x - offset.l,
      y: point.y - offset.t
    };
  };

  exports.Mapper = Mapper;
})(typeof exports === 'undefined' ? this : exports)
