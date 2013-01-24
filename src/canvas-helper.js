;(function(exports) {
  var Isla, _, codeAnalyzer, nodeDescriber, expressionDescriber, mapper;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
    _ = require("Underscore");
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
    mapper = require('../src/mapper').mapper;
  } else { // browser
    Isla = window.Isla;
    _ = window._;
    codeAnalyzer = window.codeAnalyzer;
    mapper = window.mapper;
  }

  var CanvasHelper = function(terminal, demoTalker) {
    this.write = function(e) {
      if (e.event === "mousemove") {
        handleHelp(terminal, e.point, demoTalker);
      } else if (e.event === "mouseout") {
        demoTalker.emit("isla:mouse:mouseout");
      }
    };

    var handleHelp = function(terminal, point, demoTalker) {
      var text = terminal.getText();
      var index = mapper.getIndex(terminal, text, point);
      if (isOverToken(terminal, point)) {
        var syntaxNode = codeAnalyzer.getSyntaxNode(text, index);
        demoTalker.emit("isla:mouse:mouseover", {
          syntaxNode:syntaxNode, thing:"token"
        });
      } else if (isOverLine(terminal, point)) {
        var lineNumber = mapper.getLineNumber(terminal, text, point);
        var line = codeAnalyzer.getLine(text, lineNumber);
        if (line.length > 0) {
          var syntaxTokens = codeAnalyzer.expressionSyntaxTokens(line);
          demoTalker.emit("isla:mouse:mouseover", {
            syntaxTokens:syntaxTokens, thing:"line"
          });
        }
      }
    };
  };

  var isOverToken = function(terminal, point) {
    var text = terminal.getText();
    var index = mapper.getIndex(terminal, text, point);
    return index !== undefined &&
      codeAnalyzer.getSyntaxTokenIndex(text, index) !== undefined;
  };

  var isOverLine = function(terminal, point) {
    var text = terminal.getText();
    return mapper.getLineNumber(terminal, text, point) !== undefined &&
      (mapper.getIndex(terminal, text, point) === undefined ||
       codeAnalyzer.parses(text) === undefined);
  };

  exports.CanvasHelper = CanvasHelper;
})(typeof exports === 'undefined' ? this : exports)
