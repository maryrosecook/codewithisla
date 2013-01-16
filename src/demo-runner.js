;(function(exports) {
  // no imports because only used in browser - no tests for now

  var demo, terminal, textGrabber;
  var DemoRunner = function(Demo) {
    $(document).ready(function() {
      demo = new Demo($('#canvas')[0].getContext('2d'), this);
      var envStore = new EnvStore();
      envStore.write({ event:"temp", env:Isla.Library.getInitialEnv() });
      envStore.write({ event:"commit" });

      this.write = function(e) {
        if (e.event === "newctx") {
          var env = Isla.Library.getInitialEnv();
          env.ctx = e.ctx;
          envStore.write({ event:"temp", env: env });
          envStore.write({ event:"commit" });
        }
      };

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
          demo.write({ event:"newctx", ctx:env.ctx });
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
