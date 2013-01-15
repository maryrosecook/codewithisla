;(function(exports) {
  var Isla, _, mapper, codeAnalyzer;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
    _ = require("Underscore");
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
    nodeDescriber = require('../src/node-describer').nodeDescriber;
    expressionDescriber = require('../src/expression-describer').expressionDescriber;
    Mapper = require('../src/mapper').Mapper;
  } else { // browser
    Isla = window.Isla;
    _ = window._;
    codeAnalyzer = window.codeAnalyzer;
    nodeDescriber = window.nodeDescriber;
    expressionDescriber = window.expressionDescriber;
    Mapper = window.Mapper;
  }

  var Helper = function(terminal, envStore, steps) {
    //this.steps
    var mouser = new Mouser("div.jquery-console-inner");
    mouser.events.bind(this, "data", function(e) {
      if (e.event === "mousemove") {
        handleHelp(terminal, e.point, envStore, mapper);
      } else if (e.event === "mouseout") {
        clearHelp();
      }
    });
  };

  // handle help mouse point
  var handleHelp = function(terminal, point, envStore) {
    clearHelp();
    var mapper = new Mapper(terminal);
    var text = terminal.getText();
    var charDimes = terminal.getCharDimes();
    var index = mapper.getIndex(text, point);
    if (index !== undefined &&
        codeAnalyzer.getSyntaxTokenIndex(text, index) !== undefined &&
        getTokenHelp(text, index, envStore) !== undefined) {
      // show help for token
      indicateToken(text, index);
      displayHelp(getTokenHelp(text, index, envStore));
    } else if (mapper.getLineNumber(text, point, charDimes) !== undefined &&
               (index === undefined ||
                codeAnalyzer.expressionTokens(text) === undefined)) {
      // show help for whole line
      var lineNumber = mapper.getLineNumber(text, point, charDimes);
      var line = text.split("\n")[lineNumber];
      if (line.length > 0) {
        indicateLine(mapper.getLineNumber(text, point, charDimes));
        displayHelp(getLineHelp(line, envStore));
      }
    }
  }

  var clearHelp = function() {
    $('#help').text("");
    unindicateAllTokens();
    unindicateAllLines();
  };

  // lowlight all tokens in whole console
  var unindicateAllTokens = function() {
    var tokens = $('.jquery-console-prompt').children('span')
                 .not('.jquery-console-cursor');
    _.map(tokens, function(x) {
      $(x).css({ "background-color": "#000" })
    });
  };

  var unindicateAllLines = function() {
    _.map($('.jquery-console-prompt-box'), function(x) {
      $(x).css({ "background-color": "#000" })
    });
  };

  // draw attention to current token
  var indicateToken = function(text, index) {
    var lineNumber = codeAnalyzer.getLineNumber(text, index);
    var syntaxTokens = $($('.jquery-console-prompt')[lineNumber]).children()
                         .not('.jquery-console-cursor');
    var syntaxTokenIndex = codeAnalyzer.getSyntaxTokenIndex(text, index);
    $(syntaxTokens[syntaxTokenIndex]).css({ "background-color": "#444" });
  };

  var getTokenHelp = function(text, index, envStore) {
    return nodeDescriber.describe(text, index, envStore.latest());
  };

  // draw attention to current line
  var indicateLine = function(lineNumber) {
    // line background
    $($('.jquery-console-prompt-box')[lineNumber])
      .css({ "background-color": "#444" });

    // backgrounds of tokens in line
    var tokens = $($('.jquery-console-prompt')[lineNumber]).children()
                   .not('.jquery-console-cursor');
    _.map(tokens, function(x) {
      $(x).css({ "background-color": "#444" })
    });
  };

  var getLineHelp = function(line, envStore) {
    var node = codeAnalyzer.expression(line);
    return expressionDescriber.describe(node, envStore.latest());
  };

  var displayHelp = function(help) {
    $('#help').text(help.body);
  };

  exports.Helper = Helper;
})(typeof exports === 'undefined' ? this : exports)
