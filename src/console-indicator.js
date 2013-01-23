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
        var text = terminal.getText();
        if (e.data.thing === "token") {
          var lineNumber = codeAnalyzer.getLineNumber(text, e.data.index);
          var lineBox = getLineBox(terminal.getCategorisedText(), lineNumber,
                                   $('.jquery-console-prompt'));
          if (lineBox !== undefined) {
            controllerId = e.id;
            indicateToken(lineBox, terminal.getText(), e.data.index);
          }
        } else if (e.data.thing === "line") {
          controllerId = e.id;
          var lineBox = getLineBox(terminal.getCategorisedText(),
                                   e.data.lineNumber,
                                   $('.jquery-console-prompt-box'));
          if (lineBox !== undefined) {
            indicateLine(lineBox);
          }
        }
      } else if (e.event === "clear" && e.id === controllerId) {
        unindicate();
      }
    };
  };

  var unindicate = function() {
    unindicateAllTokens();
    unindicateAllLines();
  };

  var getLineBox = function(categorisedText, lineNumber, elements) {
    for (var i = 0, iPrompt; i < categorisedText.length; i++) {
      if (categorisedText[i].io === "input") {
        iPrompt = iPrompt === undefined ? 0 : iPrompt + 1;
        if (i === lineNumber) {
          return $(elements[iPrompt]);
        }
      }
    }
  };

  // draw attention to current token
  var indicateToken = function(lineBox, text, index) {
    var syntaxTokens = lineBox.children().not('.jquery-console-cursor');
    var syntaxTokenIndex = codeAnalyzer.getSyntaxTokenIndex(text, index);
    $(syntaxTokens[syntaxTokenIndex]).css({ "background-color": "#444" });
  };

  // draw attention to current line
  var indicateLine = function(lineBox) {
    // line background
    lineBox.css({ "background-color": "#444" });
    // backgrounds of tokens in line
    var tokens = lineBox.children().children().not('.jquery-console-cursor');
    _.map(tokens, function(x) {
      $(x).css({ "background-color": "#444" })
    });
  };

  // lowlight all tokens in whole console
  var unindicateAllTokens = function() {
    var tokens = $('.jquery-console-prompt').children('span')
                 .not('.jquery-console-cursor');
    _.map(tokens, function(x) {
      $(x).css({ "background-color": "transparent" })
    });
  };

  var unindicateAllLines = function() {
    _.map($('.jquery-console-prompt-box'), function(x) {
      $(x).css({ "background-color": "transparent" })
    });
  };

  exports.ConsoleIndicator = ConsoleIndicator;
})(typeof exports === 'undefined' ? this : exports)
