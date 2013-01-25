;(function(exports) {
  var TextGrabber = function() {
    this.submittedText = [];
    this.currentLine = {};
  };

  TextGrabber.prototype = {
    write: function(e) {
      if (e.event === "permanent") {
        var lines = e.text.split("\n");
        for (var i = 0; i < lines.length; i++) {
          if (lines[i] !== "") {
            this.submittedText.push(newLine(lines[i] + "\n", e.io));
          }
        }
        this.currentLine = newLine("", "input");
      } else {
        this.currentLine = newLine(e.text, e.io);
      }
    },

    getPlainText: function() {
      var out = "";
      for (var i = 0; i < this.submittedText.length; i++) {
        out += this.submittedText[i].text;
      }

      out += this.currentLine.text;
      return out;
    },

    // returns text as array of lines, each line labelled as input or output
    getCategorisedText: function() {
      var out = [];
      for (var i = 0; i < this.submittedText.length; i++) {
        out.push(this.submittedText[i]);
      }

      out.push(this.currentLine);
      return out;
    }
  };

  var newLine = function(text, io) {
    return { text:text, io:io };
  };

  exports.TextGrabber = TextGrabber;
})(typeof exports === 'undefined' ? this : exports)
