;(function(exports) {
  var codeAnalyzer;
  if(typeof module !== 'undefined' && module.exports) { // node
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
  } else { // browser
    codeAnalyzer = window.codeAnalyzer;
  }

  mapper = {
    // returns cell that text point is at
    getIndex: function(terminal, text, relativePoint) {
      var charDimes = terminal.getCharDimes();
      var point = offset(relativePoint, terminal.getOffset());
      for (var i = 0, x = 0, y = charDimes.y; i < text.length; i++) {
        if (codeAnalyzer.isAtNewline(text, i)) {
          y += charDimes.y;
          x = 0;
        } else  { // not reached end of line
          x += charDimes.x
        }

        if (point.x >= 0 && point.x >= x - charDimes.x && point.x < x &&
            point.y >= y - charDimes.y && point.y < y) {
          return i;
        }
      }

      return undefined;
    },

    getLineNumber: function(terminal, text, relativePoint) {
      var charDimes = terminal.getCharDimes();
      var point = offset(relativePoint, terminal.getLineOffset());

      if (point.x < 0 || point.x >= terminal.getWidth()) {
        return undefined;
      }

      var lines = text.split("\n");
      for (var i = 0, y = charDimes.y; i < lines.length; i++) {
        if (point.y >= y - charDimes.y && point.y < y) {
          return i;
        }
        y += charDimes.y;
      }

      return undefined;
    },

    getLine: function(terminal, text, relativePoint) {
      var lineNumber = mapper.getLineNumber(terminal, text, relativePoint);
      return codeAnalyzer.getLine(text, lineNumber);
    }
  };

  var offset = function(point, offset) {
    return {
      x: point.x - offset.l,
      y: point.y - offset.t
    };
  };

  exports.mapper = mapper;
})(typeof exports === 'undefined' ? this : exports)
