;(function(exports) {
  var Isla;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
  } else { // browser
    Isla = window.Isla;
  }

  var demo, terminal, textGrabber;
  var DemoRunner = function(Demo) {
    $(document).ready(function() {
      demo = new Demo($('#canvas')[0].getContext('2d'));
      var envStore = new EnvStore();
      envStore.write({ event:"temp", env:Isla.Library.getInitialEnv() });
      envStore.write({ event:"commit" });

      terminal = new Terminal();
      terminal.events.bind(this, 'keypress', function(line) {
        terminal.setPromptText({
          html: getHighlightedSyntax(line),
          cursor: true
        });
      });

      terminal.events.bind(this, 'history', function(line) {
        terminal.setPromptText({
          html: getHighlightedSyntax(line),
          cursor: true
        });
      });

      terminal.events.bind(this, 'submit', function(line) {
        var result;
        try {
          var env = Isla.Interpreter.interpret(line, envStore.latestCommitted());
          env.ctx = demo.write(env.ctx);
          envStore.write({ event:"temp", env:env });
          envStore.write({ event:"commit" });
          result = { msg: env.ret || "", error: false };
        } catch(e) {
          result = { msg: e.message, error: true };
        }

        terminal.setPromptText({
          html: getHighlightedSyntax(line),
          cursor: false
        });

        terminal.setResult(result);
      });

      var helper = new Helper(terminal, envStore);
    });
  };

  // Two code run scenarios:
  // - As you type (fn below). Fails silently. Updates demo w new env.
  // - On submit.  Prints any errors.  Doesn't update demo (don't want new
  //   random vals when code re-run).
  var runDemoCode = function(line, envStore) {
    try {
      var env = Isla.Interpreter.interpret(line, envStore.latestCommitted());
      env.ctx = demo.write(env.ctx);
      envStore.write({ event:"temp", env:env });
    } catch(e) {
      // fail silently
    }

    terminal.setPromptText({ html: getHighlightedSyntax(line), cursor: true });
  };

  var getHighlightedSyntax = function(code) {
    var markup = Highlighter.highlight(code);
    if (markup === undefined) {
      markup = code;
    }

    return markup;
  };

  exports.DemoRunner = DemoRunner;
})(typeof exports === 'undefined' ? this : exports)
