var _ = require('Underscore');

var Draw = require('../src/plugins/draw').Draw;
var Interpreter = require('../node_modules/isla/src/interpreter').Interpreter;
var Eventer = require('../src/eventer').Eventer;

var ctx = function() {
  return {
    canvas: {
      width: 300,
      height: 300,
    },
    fillRect: function() {},
    beginPath: function() {},
    closePath: function() {},
    lineTo: function() {},
    fill: function() {},
    arc: function() {},
    moveTo: function() {}
  };
};

var demoTalker = function() {
  return new Eventer();
};

describe('Draw', function() {
  describe('instantiation', function() {
    it('should complain if no canvas passed', function() {
      expect(function(){
        new Draw();
      }).toThrow("You must provide a canvas context to draw to.");
    });

    it('should complain if no demoTalker passed', function() {
      expect(function(){
        new Draw(ctx());
      }).toThrow("You must provide a demo talker to communicate with.");
    });

    it('should not complain if canvas and demoTalker passed', function() {
      (new Draw(ctx(), demoTalker())).end();
    });
  });

  describe('draw loop', function() {
    it('should start drawing upon instantiation', function() {
      var ran;
      runs(function() {
        var draw = new Draw(ctx(), demoTalker());
        draw._draw = function() {
          ran = true;
          this.end();
        }
      });

      waits(100);
      runs(function() {
        expect(ran).toEqual(true);
      });
    });

    it('should stop drawing when told stream has ended', function() {
      var i = 0;
      runs(function() {
        var draw = new Draw(ctx(), demoTalker());
        draw._draw = function() {
          i++;
          this.end();
        }
      });

      waits(100);
      runs(function() {
        expect(i).toEqual(1);
      });
    });
  });

  describe('basic drawing', function() {
    describe('draw all the basic shapes', function() {
      var dt, draw;
      beforeEach(function() {
        dt = demoTalker();
        draw = new Draw(ctx(), dt);
      });

      it('should draw a triangle', function() {
        dt.emit("isla:ctx:new", { a: { _meta: { type: "triangle" } } });
      });

      it('should draw a circle', function() {
        dt.emit("isla:ctx:new", { a: { _meta: { type: "circle" } } });
      });

      it('should draw a rectangle', function() {
        dt.emit("isla:ctx:new", { a: { _meta: { type: "rectangle" } } });
      });

      it('should draw a oblong', function() {
        dt.emit("isla:ctx:new", { a: { _meta: { type: "oblong" } } });
      });

      it('should draw a square', function() {
        dt.emit("isla:ctx:new", { a: { _meta: { type: "square" } } });
      });

      // it('should draw a line', function() {
      //   dt.emit("isla:ctx:new", { a: { _meta: { type: "line" } } });
      // });

      it('should draw a pentagon', function() {
        dt.emit("isla:ctx:new", { a: { _meta: { type: "pentagon" } } });
      });

      it('should draw a hexagon', function() {
        dt.emit("isla:ctx:new", { a: { _meta: { type: "hexagon" } } });
      });

      it('should draw a heptagon', function() {
        dt.emit("isla:ctx:new", { a: { _meta: { type: "heptagon" } } });
      });

      it('should draw a octagon', function() {
        dt.emit("isla:ctx:new", { a: { _meta: { type: "octagon" } } });
      });

      afterEach(function() {
        expect(draw.operations.a).toBeDefined();
        draw.end();
      });

    });

    it('should not draw an unknown shape', function() {
      var dt = demoTalker();
      var draw = new Draw(ctx(), dt);
      dt.emit("isla:ctx:new", {
        a: { _meta: { type: "circle" }},
        b: { _meta: { type: "whatevs" }}
      });

      expect(draw.operations.a).toBeDefined();
      expect(draw.operations.b).toBeUndefined();
      draw.end();
    });

    it('should allow updating of an existing context with new op', function() {
      var ran;
      runs(function() {
        var dt = demoTalker(); // 1
        var draw = new Draw(ctx(), dt);
        var self = this;
        dt.on(self, "demo:ctx:new", function(newCtx) { // 3
          newCtx.b = { _meta: { type: "circle" } };
          dt.removeListener(self, "demo:ctx:new");
          dt.on(this, "demo:ctx:new", function() { // 5
            expect(draw.operations.a).toBeDefined();
            expect(draw.operations.b).toBeDefined();
            ran = true;
            draw.end();
          });
          dt.emit("isla:ctx:new", newCtx); // 4
        });
        dt.emit("isla:ctx:new", { a: { _meta: { type: "square" } }}); // 2
      });
      runs(function() { expect(ran).toEqual(true); }); // check ran
    });

    it('should allow updating of an existing context with data not for op', function() {
      var ran;
      runs(function() {
        var dt = demoTalker(); // 1
        var draw = new Draw(ctx(), dt);
        var self = this;
        dt.on(self, "demo:ctx:new", function(newCtx) { // 3
          newCtx.b = { };
          dt.removeListener(self, "demo:ctx:new");
          dt.on(this, "demo:ctx:new", function(newCtx2) { // 5
            expect(newCtx2.b).toEqual({});
            expect(draw.operations.a).toBeDefined();
            expect(draw.operations.b).toBeUndefined();
            ran = true;
            draw.end();
          });
          dt.emit("isla:ctx:new", newCtx); // 4
        });
        dt.emit("isla:ctx:new", { a: { _meta: { type: "square" } }}); // 2
      });
      runs(function() { expect(ran).toEqual(true); }); // check ran
    });

    it('should overwrite old ops when new ctx written', function() {
      var ran;
      runs(function() {
        var dt = demoTalker(); // 1
        var draw = new Draw(ctx(), dt);
        var self = this;
        dt.on(self, "demo:ctx:new", function(newCtx) { // 3
          dt.removeListener(self, "demo:ctx:new");
          dt.on(this, "demo:ctx:new", function(newCtx2) { // 5
            expect(draw.operations.a).toBeDefined();
            expect(draw.operations.b).toBeUndefined();
            ran = true;
            draw.end();
          });
          dt.emit("isla:ctx:new", { a: { _meta: { type: "square" } }}); // 4
        });
        dt.emit("isla:ctx:new", { a: { _meta: { type: "square" } },
                                  b: { _meta: { type: "square" } }}); // 2
      });
      runs(function() { expect(ran).toEqual(true); }); // check ran
    });

    it('should correctly write out list in ctx that has been passed back and forth', function() {
      // regression. ctx gets copied w jquery extend.  This clobbers
      // the prototype chain which meant lists in the ctx were not being
      // identified during resolution and so were not being resolved.
      // This meant write listwithobjinit wrote out a ref instead of the
      // obj attributes.  Lists now identified by _meta.type so are resolved
      // correctly.
      var ran = false;
      runs(function() {
        // 1
        var dt = demoTalker();
        var draw = new Draw(ctx(), dt);
        var initCtx = Interpreter.interpret("basket is a list\nx is a thing\nx y is '1'\nadd x to basket").ctx;
        dt.on(this, "demo:ctx:new", function(ctx) { // 3
          var out = Interpreter.interpret("write basket", { ctx: ctx }).ret;
          expect(out).toEqual("a list\n  a thing\n    y is '1'\n");
          draw.end();
          ran = true;
        });

        dt.emit("isla:ctx:new", initCtx); // 2
      });

      runs(function() { expect(ran).toEqual(true); }); // check ran
    });
  });
});
