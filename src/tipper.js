;(function(exports) {
  var Tipper = function(terminal, ui) {
    var showingHoverTip = false;
    this.write = function(e) {
      if (e.event = "text:new") {
        if (!showingHoverTip && terminal.getCategorisedText().length > 1) {
          ui.displayMessage("Hover over underlined words to learn more");
          showingHoverTip = true;
        }
      }
    };
  };

  exports.Tipper = Tipper;
})(typeof exports === 'undefined' ? this : exports)
