;(function(exports) {
  var Isla, _, mapper, codeAnalyzer;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
    _ = require("Underscore");
    codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
    nodeDescriber = require('../src/node-describer').nodeDescriber;
    mapper = require('../src/mapper').mapper;
  } else { // browser
    Isla = window.Isla;
    _ = window._;
    codeAnalyzer = window.codeAnalyzer;
    nodeDescriber = window.nodeDescriber;
    mapper = window.mapper;
  }

  var Helper = function(terminal, envStore, steps) {
    //this.steps
    var characterDimensions = { x:11, y:17 };
    var padding = { t:0, l:17 };
    var mouser = new Mouser("div.jquery-console-inner");
    mouser.events.bind(this, "data", function(e) {
      if (e.event === "mousemove") {
        var text = terminal.getText();
        var index = mapper.getIndex(text, mapper.offset(e.point, padding),
                                    characterDimensions);
        indicate(text, index);
        displayHelp(text, index, envStore);
      }
    });
  };

  var indicate = function(text, index) {
    // lowlight all tokens in whole console
    var tokens = $('.jquery-console-prompt').children('span')
                 .not('.jquery-console-cursor');
    _.map(tokens, function(x) {
      $(x).css({ "background-color": "#000" })
    });

    if (index !== undefined) { // highlight current token
      var lineNumber = codeAnalyzer.getLineNumber(text, index);
      var tokens = $($('.jquery-console-prompt')[lineNumber]).children()
                   .not('.jquery-console-cursor');

      var syntaxTokenIndex = codeAnalyzer.getSyntaxTokenIndex(text, index);
      $(tokens[syntaxTokenIndex]).css({ "background-color": "#444" });
    }
  };

  var displayHelp = function(text, index, envStore) {
    if (index !== undefined) { // highlight current token
      var line = codeAnalyzer.getLine(text, index);
      var tokens = codeAnalyzer.expressionTokens(line);
      var syntaxTokenIndex = codeAnalyzer.getSyntaxTokenIndex(text, index);
      if (syntaxTokenIndex !== undefined) { // not over nl char
        var node = tokens[syntaxTokenIndex];
        var description = nodeDescriber.describe(node, envStore.latest());
        $('#help').text(description.body);
      }
    } else {
      $('#help').text("");
    }
  };

  exports.Helper = Helper;
})(typeof exports === 'undefined' ? this : exports)
