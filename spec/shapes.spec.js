var _ = require('Underscore');

var Shapes = require('../src/demos/shapes').Shapes;
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

var withCtx = function(dt, ctx, id, value, cb) {
  dt.removeListener(dt, "demo:ctx:new");
  dt.on(dt, "demo:ctx:new", function(newCtx) {
    cb(newCtx);
  });

  ctx[id] = value;
  dt.emit("isla:ctx:new", ctx);
};

describe('Shapes', function() {
  describe('basic drawing', function() {
    describe('draw all the basic shapes', function() {
      var dt, draw;
      beforeEach(function() {
        dt = demoTalker();
        shapes = new Shapes(ctx(), dt);
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
        expect(shapes.operations()[0]).toBeDefined();
        shapes.end();
      });

    });

    it('should not draw an unknown shape', function() {
      var dt = demoTalker();
      var shapes = new Shapes(ctx(), dt);
      dt.emit("isla:ctx:new", {
        a: { _meta: { type: "circle" }},
        b: { _meta: { type: "whatevs" }}
      });

      expect(shapes.operations()[0]).toBeDefined();
      expect(shapes.operations()[1]).toBeUndefined();
      shapes.end();
    });

    it('should allow updating of an existing context with new op', function() {
      var ran;
      runs(function() {
        var dt = demoTalker();
        var shapes = new Shapes(ctx(), dt);
        withCtx(dt, {}, "a", { _meta: { type: "square" }}, function(ctx1) {
          withCtx(dt, ctx1, "b", { _meta: { type: "circle" }}, function(ctx2) {
            expect(shapes.operations()[0]).toBeDefined();
            expect(shapes.operations()[1]).toBeDefined();
            ran = true;
            shapes.end();
          });
        });
      });
      runs(function() { expect(ran).toEqual(true); }); // check ran
    });

    it('should allow updating of an existing context with data not for op', function() {
      var ran;
      runs(function() {
        var dt = demoTalker(); // 1
        var shapes = new Shapes(ctx(), dt);
        withCtx(dt, {}, "a", { _meta: { type: "square" }}, function(ctx1) {
          withCtx(dt, ctx1, "b", {}, function(ctx2) {
            expect(ctx2.b).toEqual({});
            expect(shapes.operations()[0]).toBeDefined();
            expect(shapes.operations()[1]).toBeUndefined();
            ran = true;
            shapes.end();
          });
        });
      });
      runs(function() { expect(ran).toEqual(true); }); // check ran
    });

    it('should overwrite old ops when new ctx written', function() {
      var ran;
      runs(function() {
        var dt = demoTalker(); // 1
        var shapes = new Shapes(ctx(), dt);
        var self = this;
        dt.on(self, "demo:ctx:new", function(newCtx) { // 3
          dt.removeListener(self, "demo:ctx:new");
          dt.on(this, "demo:ctx:new", function(newCtx2) { // 5
            expect(shapes.operations()[0]).toBeDefined();
            expect(shapes.operations()[1]).toBeUndefined();
            ran = true;
            shapes.end();
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
        var shapes = new Shapes(ctx(), dt);
        var initCtx = Interpreter.interpret("basket is a list\nx is a thing\nx y is '1'\nadd x to basket").ctx;
        dt.on(this, "demo:ctx:new", function(ctx) { // 3
          var out = Interpreter.interpret("write basket", { ctx: ctx }).ret;
          expect(out).toEqual("a list\n  a thing\n    y is '1'\n");
          shapes.end();
          ran = true;
        });

        dt.emit("isla:ctx:new", initCtx); // 2
      });

      runs(function() { expect(ran).toEqual(true); }); // check ran
    });
  });

  describe('draw order', function() {
    it('should order three ops in order of addition', function() {
      var ran;
      runs(function() {
        var dt = demoTalker();
        var shapes = new Shapes(ctx(), dt);
        withCtx(dt, {}, "c", { _meta: { type: "square" }}, function(ctx1) {
          withCtx(dt, ctx1, "b", { _meta: { type: "square" }}, function(ctx2) {
            withCtx(dt, ctx2, "a", { _meta: { type: "square" }}, function(ctx3) {
              expect(shapes.operations()[0].name).toEqual("c");
              expect(shapes.operations()[1].name).toEqual("b");
              expect(shapes.operations()[2].name).toEqual("a");
              ran = true;
              shapes.end();
            });
          });
        });
      });

      runs(function() { expect(ran).toEqual(true); }); // check ran
    });
  });
});
