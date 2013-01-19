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

  var id = "textHelper";

  var TextHelper = function(terminal, consoleIndicator, envStore) {
    this.write = function(e) {
      if (e.event === "mousemove") {
        handleHelp(terminal, e.point, envStore);
      } else if (e.event === "mouseout") {
        clearHelp();
      }
    };

    var indicate = function(event, data) {
      consoleIndicator.write({ event:event, data:data, id:id });
    };

    var clearHelp = function() {
      $('#help').text("");
      indicate("clear", {});
    };

    var handleHelp = function(terminal, point, envStore) {
      var text = terminal.getText();
      if (isThereHelpForToken(terminal, point, envStore)) {
        var index = mapper.getIndex(terminal, text, point);
        clearHelp();
        indicate("indicate", { thing:"token", index: index });
        displayHelp(getTokenHelp(text, index, envStore));
        return;
      } else if (isOverLine(terminal, point)) {
        var lineNumber = mapper.getLineNumber(terminal, text, point);
        var line = text.split("\n")[lineNumber];
        if (line.length > 0) {
          clearHelp();
          indicate("indicate", { thing:"line", lineNumber: lineNumber });
          displayHelp(getLineHelp(line, envStore));
          return;
        }
      }

      clearHelp();
    };
  };


  var isThereHelpForToken = function(terminal, point, envStore) {
    var text = terminal.getText();
    var index = mapper.getIndex(terminal, text, point);
    return index !== undefined &&
      codeAnalyzer.getSyntaxTokenIndex(text, index) !== undefined &&
      getTokenHelp(text, index, envStore) !== undefined;
  };

  var isOverLine = function(terminal, point) {
    var text = terminal.getText();
    return mapper.getLineNumber(terminal, text, point) !== undefined &&
      (mapper.getIndex(terminal, text, point) === undefined ||
       codeAnalyzer.expressionTokens(text) === undefined);
  };

  var getTokenHelp = function(text, index, envStore) {
    return nodeDescriber.describe(text, index, envStore.latest());
  };

  var getLineHelp = function(line, envStore) {
    var node = codeAnalyzer.expression(line);
    return expressionDescriber.describe(node, envStore.latest());
  };

  var displayHelp = function(help) {
    $('#help').text(help.body);
  };

  exports.TextHelper = TextHelper;
})(typeof exports === 'undefined' ? this : exports)
