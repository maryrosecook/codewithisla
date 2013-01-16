;(function(exports) {
  var Helper = function(terminal, envStore) {
    var consoleIndicator = new ConsoleIndicator(terminal);
    var mouser = new Mouser("div.jquery-console-inner");

    var textHelper = new TextHelper(terminal, consoleIndicator, envStore);
    mouser.events.bind(textHelper, "data", textHelper.write);
  };


  exports.Helper = Helper;
})(typeof exports === 'undefined' ? this : exports)
