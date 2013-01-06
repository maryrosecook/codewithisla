var _ = require('Underscore');

var Draw = require('../src/plugins/draw').Draw;
var Interpreter = require('../node_modules/isla/src/interpreter').Interpreter;

var ctx = function() {
  return {
    canvas: {
      width: 300,
      height: 300,
    },
    fillRect: function() {}
  };
};

describe('Draw', function() {
  describe('instantiation', function() {
    it('should complain if no canvas passed', function() {
      expect(function(){
        new Draw();
      }).toThrow("You must provide a canvas context to draw to.");
    });

    it('should not complain if canvas passed', function() {
      (new Draw(ctx())).end();
    });
  });

  describe('draw loop', function() {
    it('should start drawing upon instantiation', function() {
      runs(function() {
        var draw = new Draw(ctx());
        var i = 0;
        draw._draw = function() {
          i++;
          this.end();
        }

        setTimeout(function() {
          expect(i > 0).toEqual(true);
        }, 100);
      });
    });

    it('should stop drawing when told stream has ended', function() {
      runs(function() {
        var draw = new Draw(ctx());
        var i = 0;
        draw._draw = function() {
          i++;
          this.end();
        }

        setTimeout(function() {
          expect(i === 1).toEqual(true);
        }, 100);
      });
    });
  });

  describe('stream api', function(){
    it('should accept an environment via the write stream', function() {
      var draw = new Draw(ctx());
      draw.write({ a: { _meta: { type: "circle" } }});
      draw.end();
    });

    it('should allow end to be called', function() {
      var draw = new Draw(ctx());
      draw.end();
    });
  });

  describe('basic drawing', function() {
    describe('should draw basic shapes', function() {
      var draw;
      beforeEach(function() {
        draw = new Draw(ctx());
      });

      it('should draw a triangle', function() {
        draw.write({ a: { _meta: { type: "triangle" } }});
      });

      it('should draw a square', function() {
        draw.write({ a: { _meta: { type: "triangle" } }});
      });

      it('should draw a circle', function() {
        draw.write({ a: { _meta: { type: "circle" } }});
      });

      it('should draw a rectangle', function() {
        draw.write({ a: { _meta: { type: "rectangle" } }});
      });

      it('should draw an oblong', function() {
        draw.write({ a: { _meta: { type: "oblong" } }});
      });

      it('should draw a pentagon', function() {
        draw.write({ a: { _meta: { type: "pentagon" } }});
      });

      it('should draw a hexagon', function() {
        draw.write({ a: { _meta: { type: "hexagon" } }});
      });

      it('should draw a heptagon', function() {
        draw.write({ a: { _meta: { type: "heptagon" } }});
      });

      it('should draw an octagon', function() {
        draw.write({ a: { _meta: { type: "octagon" } }});
      });

      afterEach(function() {
        expect(draw.operations.length).toEqual(1);
        draw.end();
      });
    });

    it('should not draw an unknown shape', function() {
      var draw = new Draw(ctx());
      draw.write({ a: { _meta: { type: "whatevs" } }});
      expect(draw.operations.length).toEqual(0);
      draw.end();
    });

    it('should allow updating of an existing context with new data for op', function() {
      var draw = new Draw(ctx());
      var newCtx = draw.write({ a: { _meta: { type: "square" } }});
      newCtx.b = { _meta: { type: "circle" } };
      draw.write(newCtx);
      expect(draw.operations.length).toEqual(2);
      draw.end();
    });

    it('should allow updating of an existing context with data not for op', function() {
      var draw = new Draw(ctx());
      var newCtx = draw.write({ a: { _meta: { type: "square" } }});
      newCtx.b = { };
      newCtx = draw.write(newCtx);
      expect(newCtx.b).toEqual({});
      expect(draw.operations.length).toEqual(1);
      draw.end();
    });

    it('should overwrite old ops when new ctx written', function() {
      var draw = new Draw(ctx());
      draw.write({ a: { _meta: { type: "square" } },
                   b: { _meta: { type: "square" } }});
      expect(draw.operations.length).toEqual(2);

      draw.write({ a: { _meta: { type: "square" } }});
      expect(draw.operations.length).toEqual(1);

      draw.end();
    });

    it('should correctly write out list in ctx that has been passed back and forth', function() {
      // regression. ctx gets copied w jquery extend.  This clobbers
      // the prototype chain which meant lists in the ctx were not being
      // identified during resolution and so were not being resolved.
      // This meant write listwithobjinit wrote out a ref instead of the
      // obj attributes.  Lists now identified by _meta.type so are resolved
      // correctly.
      var draw = new Draw(ctx());
      var initCtx = Interpreter.interpret("basket is a list\nx is a thing\nx y is '1'\nadd x to basket").ctx;
      var copiedCtx = draw.write(initCtx);
      var out = Interpreter.interpret("write basket", { ctx: copiedCtx }).ret;
      expect(out).toEqual("a list\n  a thing\n    y is '1'\n");
      draw.end();
    });
  });
});
