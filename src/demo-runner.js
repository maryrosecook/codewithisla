;(function(exports) {
  // no imports because only used in browser - no tests for now

  var DemoRunner = function(Demo) {
    $(document).ready(function() {
      var demoTalker = new Eventer();
      var demo = new Demo($('#canvas')[0].getContext('2d'), demoTalker);

      var envStore = new EnvStore();
      envStore.write({ event:"temp", env:Isla.Library.getInitialEnv() });
      envStore.write({ event:"commit" });

      demoTalker.on(this, "demo:ctx:new", function(ctx) {
        var env = Isla.Library.getInitialEnv();
        env.ctx = ctx;
        envStore.write({ event:"temp", env: env });
        envStore.write({ event:"commit" });
      });

      var terminal = setupTerminal(demoTalker, envStore);
      var helper = new Helper(terminal, envStore, demoTalker);
      var tutor = setupTutor(demo, terminal);
      var tipper = setupTipper(terminal);
    });
  };

  var setupTipper = function(terminal) {
    var tipper = new Tipper(terminal, ui.tipper);
    terminal.events.on(this, "text:new", function(line) {
      tipper.write("text:new");
    });

    return tipper;
  };

  var setupTutor = function(demo, terminal) {
    var tutor = new Tutor(demo.getTutorSteps(), ui.tutor);
    terminal.events.on(this, "submit", function(line) {
      tutor.write({ event:"demo:code:new", code:line });
    });

    return tutor;
  };

  var setupTerminal = function(demoTalker, envStore) {
    var terminal = new Terminal();
    terminal.events.on(this, 'keypress', function(line) {
      terminal.setPromptText({
        html: getHighlightedSyntax(line),
        cursor: true
      });
    });

    terminal.events.on(this, 'history', function(line) {
      terminal.setPromptText({
        html: getHighlightedSyntax(line),
        cursor: true
      });
    });

    terminal.events.on(this, 'submit', function(line) {
      var result;
      try {
        var env = Isla.Interpreter.interpret(line, envStore.latestCommitted());
        demoTalker.emit("isla:ctx:new", env.ctx);
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

    return terminal;
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
