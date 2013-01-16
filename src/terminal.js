;(function(exports) {
  var consoleController, textGrabber;
  var Terminal = function() {
    consoleController = setUpConsoleController(this);
    this.events = new Eventer();

    textGrabber = new TextGrabber();
    this.events.on(this, "submit", function(line) {
      textGrabber.write({ event: "submit", text: line });
    });
    this.events.on(this, "keypress", function(line) {
      textGrabber.write({ event: "keypress", text: line });
    });
    this.events.on(this, "history", function(line) {
      textGrabber.write({ event: "keypress", text: line });
    });
  };

  Terminal.prototype = {
    setResult: function(result) {
      var className = "jquery-console-message-value";
      if (result.error === true) {
        className = "jquery-console-message-error";
      }

      lowlightOldPrompt();
      consoleController.commandResult([{
        msg: toHtml(result.msg), className: className
      }]);
    },

    setPromptText: function(data) {
      var markup = data.html;
      if (data.cursor === true) {
        markup += consoleController.cursor;
      }

      $("span.jquery-console-prompt").last().html(markup);
      consoleController.updateCursorOffset();
    },

    getText: function() {
      return textGrabber.getText();
    },

    getOffset: function() {
      var innerConsole = $('.jquery-console-inner');
      var padding = { t:0, l:17 };
      return {
        t: padding.t - innerConsole.scrollTop(),
        l: padding.l - innerConsole.scrollLeft()
      };
    },

    getLineOffset: function() {
      var innerConsole = $('.jquery-console-inner');
      var padding = { t:0, l:-17 }; // include chevron
      return {
        t: padding.t - innerConsole.scrollTop(),
        l: padding.l - innerConsole.scrollLeft()
      };
    },

    getWidth: function() {
      return $('.jquery-console-inner').width();
    },

    getCharDimes: function() {
      return { x:11, y:18 };
    }
  };

  var setUpConsoleController = function(terminal) {
    var consoleController = $("#console").console({
      promptLabel: '>',
      commandValidate: commandValid,
      commandHandle: function(line) {
        terminal.events.emit('submit', line);
      },
      autofocus:true,
      promptHistory:true
    });

    // cursor blinking

    consoleController.typer.bind("keyup", function() {
      $('.jquery-console-cursor').blink();
    });

    consoleController.typer.bind("focus", function() {
      $('.jquery-console-cursor').blink();
    });

    consoleController.typer.bind("blur", function() {
      $('.jquery-console-cursor').unblink();
    });

    // syntax highlighting as you type

    consoleController.typer.keypress(function(e) {
      terminal.events.emit("keypress", consoleController.promptText());
    });

    // extra for backspace because not caught by keydown.
    // Price is that highlight update is delayed until key goes up so
    // get tiny text flash during backspace
    consoleController.typer.keyup(function(e) {
      if (e.keyCode === 8) {
        terminal.events.emit("keypress", consoleController.promptText());
      }
    });

    // tell terminal when history item gets recalled
    consoleController.typer.bind("history", function(e) {
      terminal.events.emit("history", consoleController.promptText());
    });

    return consoleController;
  };

  var toHtml = function(str) {
    var out = str;
    var out = str.replace(/  /g, "&nbsp; ");
    return out;
  };

  var commandValid = function(line) {
    return line !== "";
  };

  var lowlightOldPrompt = function() {
    $("span.jquery-console-prompt-label").last().css({ color: "#555" });
  };

  exports.Terminal = Terminal;
})(typeof exports === 'undefined' ? this : exports)
