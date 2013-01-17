;(function(exports) {
  var Isla, _, codeAnalyzer;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
    _ = require("Underscore");
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
  } else { // browser
    Isla = window.Isla;
    _ = window._;
    codeAnalyzer = window.codeAnalyzer;
  }

  var ConsoleIndicator = function(terminal) {
    var controllerId;

    this.write = function(e) {
      if (e.event === "indicate") {
        if (e.data.thing === "token") {
          controllerId = e.id;
          indicateToken(terminal.getText(), e.data.index);
        } else if (e.data.thing === "line") {
          controllerId = e.id;
          indicateLine(e.data.lineNumber);
        }
      } else if (e.event === "clear") {
        if (e.id === controllerId) {
          unindicate();
        }
      }
    };
  };

  var unindicate = function() {
    unindicateAllTokens();
    unindicateAllLines();
  };

  // draw attention to current token
  var indicateToken = function(text, index) {
    var lineNumber = codeAnalyzer.getLineNumber(text, index);
    var syntaxTokens = $($('.jquery-console-prompt')[lineNumber]).children()
                         .not('.jquery-console-cursor');
    var syntaxTokenIndex = codeAnalyzer.getSyntaxTokenIndex(text, index);
    $(syntaxTokens[syntaxTokenIndex]).css({ "background-color": "#444" });
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

  exports.ConsoleIndicator = ConsoleIndicator;
})(typeof exports === 'undefined' ? this : exports)
