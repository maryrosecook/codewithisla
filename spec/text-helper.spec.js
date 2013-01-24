var TextHelper = require('../src/text-helper').TextHelper;

// simple terminal w no padding
var term = function(text) {
  return {
    getText: function() { return text; },
    getOffset: function() { return { l:0, t:0 }; },
    getLineOffset: function() { return { l:0, t:0 }; },
    getWidth: function() { return 400; },
    getCharDimes: function() { return { x:10, y:10 }; }
  };
};

var envStore = function(ctx) {
  return {
    latest: function() { return { ctx:ctx }; }
  };
};

var noop = function() {

};

describe('TextHelper', function() {
  describe('token help', function() {
    // just some integration tests

    it('should clear text and indication prior to new help', function() {
      var displayedMessages = [], events = [];
      var th = new TextHelper(term("a is '1'\n"), {}, envStore({ a:"1" }), {
        displayMessage: function(m) { displayedMessages.push(m); },
        indicate: function(__, e, __) {
          events.push(e);
        }
      });

      th.write({ event:"mousemove", point:{ x:5, y:5 } }); // in a of age
      expect(displayedMessages[0]).toEqual("");
      expect(events[0]).toEqual("clear");
    });

    it('should display var value in text box when hover over', function() {
      var displayedMessage;
      var th = new TextHelper(term("a is '1'\n"), {}, envStore({ a:"1" }), {
        displayMessage: function(m) { displayedMessage = m; },
        indicate:noop
      });

      th.write({ event:"mousemove", point:{ x:5, y:5 } }); // in a of age
      expect(displayedMessage).toEqual("'1'");
    });

    it('should indicate var value when hover over', function() {
      var event, data;
      var th = new TextHelper(term("a is '1'\n"), {}, envStore({ a:"1" }), {
        displayMessage: noop,
        indicate: function(__, e, d) {
          event = e;
          data = d;
        }
      });

      th.write({ event:"mousemove", point:{ x:5, y:5 } }); // in a of age
      expect(event).toEqual("indicate");
      expect(data.thing).toEqual("token");
      expect(data.index).toEqual(0);
    });
  });

  describe('line help', function() {
    // just some integration tests

    it('should clear text and indication prior to new help', function() {
      var displayedMessages = [], events = [];
      var th = new TextHelper(term("a is '1'\n"), {}, envStore({ a:"1" }), {
        displayMessage: function(m) { displayedMessages.push(m); },
        indicate: function(__, e, __) {
          events.push(e);
        }
      });

      th.write({ event:"mousemove", point:{ x:200, y:5 } }); // line position
      expect(displayedMessages[0]).toEqual("");
      expect(events[0]).toEqual("clear");
    });

    it('should display var value in text box when hover over', function() {
      var displayedMessage;
      var th = new TextHelper(term("a is '1'\n"), {}, envStore({ a:"1" }), {
        displayMessage: function(m) { displayedMessage = m; },
        indicate:noop
      });

      th.write({ event:"mousemove", point:{ x:200, y:5 } }); // line position
      expect(displayedMessage).toEqual("a is now '1'.");
    });

    it('should indicate var value when hover over', function() {
      var event, data;
      var th = new TextHelper(term("a is '1'\n"), {}, envStore({ a:"1" }), {
        displayMessage: noop,
        indicate: function(__, e, d) {
          event = e;
          data = d;
        }
      });

      th.write({ event:"mousemove", point:{ x:200, y:5 } }); // line position
      expect(event).toEqual("indicate");
      expect(data.thing).toEqual("line");
      expect(data.lineNumber).toEqual(0);
    });
  });

  describe('secondary help', function() {
    it('should clear text and indication prior to new help', function() {
      var displayedMessages = [], events = [];
      var th = new TextHelper(term("1\n2"), {}, {}, {
        displayMessage: function(m) { displayedMessages.push(m); },
        indicate: function(__, e, __) {
          events.push(e);
        }
      });

      th.write({ event:"text:new" });
      expect(displayedMessages[0]).toEqual("");
      expect(events[0]).toEqual("clear");
    });

    it('should display if new console text if console has >1 line', function() {
      var displayed = false;
      var th = new TextHelper(term("1\n2"), {}, {}, {
        displayMessage: function() { displayed = true; },
        indicate:noop
      });
      th.write({ event:"text:new" });
      expect(displayed).toEqual(true);
    });

    it('should display on mouseout if console has >1 line', function() {
      var displayed = false;
      var th = new TextHelper(term("1\n2"), {}, {}, {
        displayMessage: function() { displayed = true; },
        indicate:noop
      });
      th.write({ event:"mouseout" });
      expect(displayed).toEqual(true);
    });

    it('should not display if console has 1 line', function() {
      var displayed = false;
      var th = new TextHelper(term("1"), {}, {}, {
        displayMessage: function(m) { displayed = true; },
        indicate:noop
      });
      th.write({ event:"text:new" });
      th.write({ event:"mouseout" });
      expect(displayed).toEqual(false);
    });
  });
});
