var CanvasHelper = require('../src/canvas-helper').CanvasHelper;
var codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;

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

describe('CanvasHelper', function() {
  describe('mouseout', function() {
    it('should emit mouseout event to demoTalker on mouseout', function() {
      var events = [];
      var ch = new CanvasHelper({}, {
        emit: function(e) { events.push(e); }
      });

      ch.write({ event:"mouseout" });
      expect(events[0]).toEqual("isla:mouse:mouseout");
    });
  });

  describe('mousemove', function() {
    it('should emit mouseover token event when hover token', function() {
      var events = [], data = [];
      var t = term("a is '1'\n");
      var ch = new CanvasHelper(t, {
        emit: function(e, d) {
          events.push(e);
          data.push(d);
        }
      });

      ch.write({ event:"mousemove", point:{ x:5, y:5 }});
      expect(events[0]).toEqual("isla:mouse:mouseover");
      expect(data[0].thing).toEqual("token");
      expect(data[0].syntaxNode)
        .toEqual(codeAnalyzer.getSyntaxNode(t.getText(), 0));
    });

    it('should emit mouseover token event when hover line', function() {
      var events = [], data = [];
      var t = term("a is '1'\n");
      var ch = new CanvasHelper(t, {
        emit: function(e, d) {
          events.push(e);
          data.push(d);
        }
      });

      var point = { x:200, y:5 };
      var lineNumber = mapper.getLineNumber(t, t.getText(), point);
      var line = codeAnalyzer.getLine(t.getText(), lineNumber);
      ch.write({ event:"mousemove", point:point});
      expect(events[0]).toEqual("isla:mouse:mouseover");
      expect(data[0].thing).toEqual("line");
      expect(data[0].syntaxTokens)
        .toEqual(codeAnalyzer.expressionSyntaxTokens(line));
    });
  });
});
