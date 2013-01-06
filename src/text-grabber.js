;(function(exports) {
  var TextGrabber = function() {
    this.submittedText = "";
    this.currentLine = "";
  };

  TextGrabber.prototype = {
    write: function(e) {
      if (e.event === "submit") {
        this.submittedText += e.text + "\n";
        this.currentLine = "";
      } else {
        this.currentLine = e.text + "\n";
      }
    },

    getText: function() {
      return this.submittedText + this.currentLine;
    }
  };

  exports.TextGrabber = TextGrabber;
})(typeof exports === 'undefined' ? this : exports)
