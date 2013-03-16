;(function(exports) {
  var consoleController, textGrabber;
  var Terminal = function() {
    consoleController = setUpConsoleController(this);
    this.events = new Eventer();

    var self = this;
    textGrabber = new TextGrabber();
    this.events.on(this, "submit", function(line) {
      textGrabber.write({ event: "permanent", text: line, io:"input" });
      self.events.emit("text:new");
    });
    this.events.on(this, "keypress", function(line) {
      textGrabber.write({ event: "impermanent", text: line, io:"input" });
      self.events.emit("text:new");
    });
    this.events.on(this, "history", function(line) {
      textGrabber.write({ event: "impermanent", text: line, io:"input" });
      self.events.emit("text:new");
    });
    this.events.on(this, "result", function(result) {
      if (result !== "") {
        textGrabber.write({ event: "permanent", text: result, io:"output" });
        self.events.emit("text:new");
      }
    });
  };

  Terminal.prototype = {
    setResult: function(result) {
      result.msg = formatResult(result.msg, this.getCharsPerLine());
      var className = "jquery-console-message-value";
      if (result.error === true) {
        className = "jquery-console-message-error";
      }

      lowlightAndAddQuestionMarkToOldPrompt();
      consoleController.commandResult([{
        msg: toHtml(result.msg), className: className
      }]);

      this.events.emit("result", result.msg);
    },

    submit: function(line) {
      consoleController.typer.consoleInsert(line);
      consoleController.commandTrigger()
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
      return textGrabber.getPlainText();
    },

    getCategorisedText: function() {
      return textGrabber.getCategorisedText();
    },

    getPadding: function() {
      return { t:0, l:17 };
    },

    getOffset: function() {
      var innerConsole = $('.jquery-console-inner');
      return {
        t: this.getPadding().t - innerConsole.scrollTop(),
        l: this.getPadding().l - innerConsole.scrollLeft()
      };
    },

    getLineOffset: function() {
      var innerConsole = $('.jquery-console-inner');
      return {
        t: -innerConsole.scrollTop(),
        l: -innerConsole.scrollLeft()
      };
    },

    getWidth: function() {
      return $('.jquery-console-inner').width();
    },

    getCharsPerLine: function() {
      return (this.getWidth() - this.getPadding().l) / this.getCharDimes().x;
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

    // cursor blinking for focus

    consoleController.typer.bind("focus", function() {
      $('.jquery-console-cursor').blink();
    });

    consoleController.typer.bind("blur", function() {
      $('.jquery-console-cursor').unblink();
    });

    // syntax highlighting as you type

    consoleController.typer.bind("keypress", function(e) {
      terminal.events.emit("keypress", consoleController.promptText());
    });

    // extra for backspace because not caught by keydown.
    // Price is that highlight update is delayed until key goes up so
    // get tiny text flash during backspace
    consoleController.typer.bind("keyup", function(e) {
      if (isCursorMovementKey(e)) {
        terminal.events.emit("keypress", consoleController.promptText());
      }
      $('.jquery-console-cursor').blink();
    });

    // tell terminal when history item gets recalled
    consoleController.typer.bind("history", function(e) {
      terminal.events.emit("history", consoleController.promptText());
    });

    return consoleController;
  };

  var isCursorMovementKey = function(e) {
    return e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 39;
  };

  // prepares execution result for console
  var formatResult = function(result, charsPerLine) {
    var out = "";
    for (var i = 0, curLineChars = 0; i < result.length; i++, curLineChars++) {
      if (result[i] === "\n") {
        curLineChars = 0;
      } else if (curLineChars === charsPerLine) {
        curLineChars = 0;
        out += "\n";
      }
      out += result[i];
    }
    return out;
  };

  var toHtml = function(str) {
    var out = str;
    var out = str.replace(/  /g, "&nbsp; ");
    return out;
  };

  var commandValid = function(line) {
    return line !== "";
  };

  var lowlightAndAddQuestionMarkToOldPrompt = function() {
    $("span.jquery-console-prompt-label").last().css({ color: "#555" });
    $("span.jquery-console-prompt-label").text("#");
  };

  exports.Terminal = Terminal;
})(typeof exports === 'undefined' ? this : exports)
