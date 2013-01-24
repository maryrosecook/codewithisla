;(function(exports) {
  var Helper = function(terminal, envStore, demoTalker) {
    var consoleIndicator = new ConsoleIndicator(terminal);
    var mouser = new Mouser("div.jquery-console-inner");

    var textHelper = new TextHelper(terminal, consoleIndicator,
                                    envStore, ui.textHelper);
    mouser.events.on(textHelper, "data", textHelper.write);
    terminal.events.on(textHelper, "text:new", function() {
      textHelper.write({ event: "text:new" });
    });

    demoTalker.on(this, "demo:indicator:indicate", function(e) {
      consoleIndicator.write({ event:"indicate", data:data });
    });
    var canvasHelper = new CanvasHelper(terminal, demoTalker);
    mouser.events.on(canvasHelper, "data", canvasHelper.write);
  };

  exports.Helper = Helper;
})(typeof exports === 'undefined' ? this : exports)
