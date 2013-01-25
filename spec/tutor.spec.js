var Tutor = require('../src/tutor').Tutor;

describe('Tutor', function() {
  describe('all', function() {
    it('should hide the box if 0 steps', function() {
      var hidden = false;
      var t = new Tutor([], {
        hide: function() { hidden = true; }
      });

      expect(hidden).toEqual(true);
    });

    it('should display first code automatically', function() {
      var displayed = [];
      var t = new Tutor(["a"], {
        displayCode: function(m) { displayed.push(m); }
      });

      expect(displayed[0]).toEqual("a");
    });

    it('should display code in order of array', function() {
      var displayed = [];
      var t = new Tutor(["a", "b", "c"], {
        displayCode: function(m) { displayed.push(m); }
      });

      t.write({ event:"demo:code:new", code:"a" });
      t.write({ event:"demo:code:new", code:"b" });
      expect(displayed[0]).toEqual("a");
      expect(displayed[1]).toEqual("b");
      expect(displayed[2]).toEqual("c");
    });

    it('should display no more code message when at end of messages', function() {
      var displayed = [];
      var t = new Tutor(["a", "b"], {
        displayMessage: function(m) { displayed.push(m); },
        displayCode: function(m) { displayed.push(m); }
      });

      t.write({ event:"demo:code:new", code:"a" });
      t.write({ event:"demo:code:new", code:"b" });
      expect(displayed[0]).toEqual("a");
      expect(displayed[2]).toEqual("Make up your own code");
    });

    it('should keep no code msg displayed regardless of further new code', function() {
      var displayed = [];
      var t = new Tutor(["a"], {
        displayMessage: function(m) { displayed.push(m); },
        displayCode: function(m) { displayed.push(m); }
      });

      t.write({ event:"demo:code:new", code:"a" });
      expect(displayed[0]).toEqual("a");
      t.write({ event:"demo:code:new", code:"a" });
      t.write({ event:"demo:code:new", code:"a" });
      expect(displayed[1]).toEqual("Make up your own code");
      expect(displayed[2]).toBeUndefined();
    });

    it('should still be writeable even if no steps', function() {
      var t = new Tutor([], {
        hide: function() {}
      });

      t.write({ event:"demo:code:new", code:"a" });
    });
  });
});
