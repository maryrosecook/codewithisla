;(function(exports) {
  var Isla, _, codeAnalyzer, nodeDescriber, expressionDescriber, mapper;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
    _ = require("Underscore");
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
    nodeDescriber = require('../src/node-describer').nodeDescriber;
    expressionDescriber = require('../src/expression-describer')
                          .expressionDescriber;
    mapper = require('../src/mapper').mapper;
  } else { // browser
    Isla = window.Isla;
    _ = window._;
    codeAnalyzer = window.codeAnalyzer;
    nodeDescriber = window.nodeDescriber;
    expressionDescriber = window.expressionDescriber;
    mapper = window.mapper;
  }

  var TextHelper = function(terminal, consoleIndicator, envStore, ui) {
    var clearHelp = function() {
      ui.displayMessage("");
      ui.indicate(consoleIndicator, "clear", {});
    };

    var secondaryHelp = function() {
      if (codeAnalyzer.splitLines(terminal.getText()).length > 1) {
        clearHelp();
        ui.displayMessage("Hover over <u>words</u> and # signs to learn more");
      }
    };

    this.write = function(e) {
      if (e.event === "mousemove") {
        handleHelp(terminal, e.point, envStore);
      } else if (e.event === "mouseout" || e.event === "text:new") {
        secondaryHelp();
      }
    };

    var handleHelp = function(terminal, point, envStore) {
      var text = terminal.getText();
      if (isHelpForToken(terminal, point, envStore)) {
        var index = mapper.getIndex(terminal, text, point);
        clearHelp();
        ui.indicate(consoleIndicator, "indicate", {
          thing:"token", index:index
        });

        ui.displayMessage(getTokenHelp(text, index, envStore));
        return;
      } else if (isHelpforLine(terminal, point)) {
        clearHelp();
        ui.indicate(consoleIndicator, "indicate", {
          thing:"line",
          lineNumber: mapper.getLineNumber(terminal, text, point)
        });

        ui.displayMessage(getLineHelp(mapper.getLine(terminal, text, point), envStore));
      } else {
        secondaryHelp();
      }
    };
  };

  var isHelpForToken = function(terminal, point, envStore) {
    var text = terminal.getText();
    var index = mapper.getIndex(terminal, text, point);
    return index !== undefined &&
      codeAnalyzer.getSyntaxTokenIndex(text, index) !== undefined &&
      getTokenHelp(text, index, envStore) !== undefined;
  };

  var isHelpforLine = function(terminal, point) {
    var text = terminal.getText();
    var line = mapper.getLine(terminal, text, point);
    return mapper.getLineNumber(terminal, text, point) !== undefined &&
      codeAnalyzer.expression(line) !== undefined &&
      mapper.getIndex(terminal, text, point) === undefined;
  };

  var getTokenHelp = function(text, index, envStore) {
    try {
      return nodeDescriber.describe(text, index, envStore.latest());
    } catch (e) {
      return e.message;
    }
  };

  var getLineHelp = function(line, envStore) {
    return expressionDescriber.describe(line, envStore.latest());
  };

  exports.TextHelper = TextHelper;
})(typeof exports === 'undefined' ? this : exports)
