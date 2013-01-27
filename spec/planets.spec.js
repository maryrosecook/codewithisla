var _ = require('Underscore');
var Eventer = require('../src/eventer').Eventer;
var Planets = require('../src/demos/planets').Planets;

var noop = function() {

};

var canvasCtx = function() {
  return {
    canvas: {
      width: 300,
      height: 300,
    },
    fillRect: noop,
    beginPath: noop,
    closePath: noop,
    lineTo: noop,
    fill: noop,
    arc: noop,
    moveTo: noop,
    stroke:noop
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

describe('Planets', function() {
  describe('new ctx from code input', function() {
    it('should pass back new ctx upon receipt', function() {
      var dt = demoTalker();
      var p = new Planets(canvasCtx(), dt);
      withCtx(dt, {}, "a", { _meta: { type: "planet" }}, function(ctx1) {
        expect(ctx1.a).toBeDefined()
        p.end();
      });
    });

    it('should set planet defaults on new planet obj in ctx', function() {
      var dt = demoTalker();
      var p = new Planets(canvasCtx(), dt);
      withCtx(dt, {}, "a", { _meta: { type: "planet" }}, function(ctx1) {
        expect(ctx1.a.size.length > 0).toEqual(true);
        expect(ctx1.a.color.length > 0).toEqual(true);
        expect(ctx1.a.density.length > 0).toEqual(true);
        expect(ctx1.a._x >= 0).toEqual(true);
        expect(ctx1.a._y >= 0).toEqual(true);
        expect(ctx1.a._xSpeed).toBeDefined();
        expect(ctx1.a._ySpeed).toBeDefined();
        p.end();
      });
    });

    it('should allow updating of an existing context with new planet', function() {
      var ran;
      runs(function() {
        var dt = demoTalker();
        var p = new Planets(canvasCtx(), dt);
        withCtx(dt, {}, "a", { _meta: { type: "planet" }}, function(ctx1) {
          withCtx(dt, ctx1, "b", { _meta: { type: "planet" }}, function(ctx2) {
            expect(ctx2.a).toBeDefined();
            expect(ctx2.b).toBeDefined();
            ran = true;
            p.end();
          });
        });
      });
      runs(function() { expect(ran).toEqual(true); }); // check ran
    });

    it('should overwrite old planet w new one w same name', function() {
      var ran;
      runs(function() {
        var dt = demoTalker();
        var p = new Planets(canvasCtx(), dt);
        withCtx(dt, {}, "a", { _meta: { type: "planet" }}, function(ctx1) {
          withCtx(dt, ctx1, "a", { b:1, _meta: { type: "planet" }}, function(ctx2) {
            expect(ctx2.a.b).toEqual(1);
            ran = true;
            p.end();
          });
        });
      });
      runs(function() { expect(ran).toEqual(true); }); // check ran
    });
  });

  describe('moving planets', function() {
    it('should translate human sizes and densities', function() {
      var p, ctxes = [];
      runs(function() {
        var dt = demoTalker();
        p = new Planets(canvasCtx(), dt);
        var startCtx = {
          p1: {
            _x:"400", _y:"400", _xSpeed:"0", _ySpeed:"0",
            size:"big", density:"heavy", _meta:{type:"planet"}
          },
          p2: { _x:"0", _y:"0", _meta: { type:"planet"} },
        };

        dt.on(this, "demo:ctx:new", function(ctx1) { // 3
          ctxes.push(ctx1);
        });
        dt.emit("isla:ctx:new", startCtx); // 2
      });

      waits(50);
      runs(function() {
        expect(ctxes[1].p1._xSpeed < 0).toEqual(true);
        p.end();
      });
    });

    it('should adjust move planet towards other planet', function() {
      var p, startCtx, ctxes = [];
      runs(function() {
        var dt = demoTalker();
        p = new Planets(canvasCtx(), dt);
        startCtx = {
          p1: { _x:"5", _y:"5", _xSpeed:"0", _ySpeed:"0", _meta: { type:"planet"} },
          p2: { _x:"0", _y:"0", _meta: { type:"planet"} },
        };

        dt.on(this, "demo:ctx:new", function(ctx1) { // 3
          ctxes.push(ctx1);
        });
        dt.emit("isla:ctx:new", startCtx); // 2
      });

      waits(50);
      runs(function() {
        expect(ctxes[1].p1._xSpeed < 0).toEqual(true);
        expect(ctxes[1].p1._ySpeed < 0).toEqual(true);
        expect(ctxes[1].p1._x < 5).toEqual(true);
        expect(ctxes[1].p1._y < 5).toEqual(true);
        p.end();
      });
    });

    it('should move planet towards sun', function() {
      var p, startCtx, ctxes = [];
      runs(function() {
        var dt = demoTalker();
        p = new Planets(canvasCtx(), dt);
        startCtx = {
          p1: { _x:"5", _y:"5", _xSpeed:"0", _ySpeed:"0", _meta: { type:"planet"} },
          sun: { _x:"0", _y:"0", _meta: { type:"star"} },
        };

        dt.on(this, "demo:ctx:new", function(ctx1) { // 3
          ctxes.push(ctx1);
        });
        dt.emit("isla:ctx:new", startCtx); // 2
      });

      waits(50);
      runs(function() {
        expect(ctxes[1].p1._xSpeed < 0).toEqual(true);
        expect(ctxes[1].p1._ySpeed < 0).toEqual(true);
        expect(ctxes[1].p1._x < 5).toEqual(true);
        expect(ctxes[1].p1._y < 5).toEqual(true);
        p.end();
      });
    });

    it('should not move sun', function() {
      var p, startCtx, ctxes = [];
      runs(function() {
        var dt = demoTalker();
        p = new Planets(canvasCtx(), dt);
        startCtx = {
          p1: { _x:"5", _y:"5", _xSpeed:"0", _ySpeed:"0", _meta: { type:"planet" }},
          sun: { _x:"0", _y:"0", _meta: { type:"star" }},
        };

        dt.on(this, "demo:ctx:new", function(ctx1) { // 3
          ctxes.push(ctx1);
        });
        dt.emit("isla:ctx:new", startCtx); // 2
      });

      waits(50);
      runs(function() {
        expect(ctxes[1].p1._xSpeed < 0).toEqual(true);
        expect(ctxes[1].sun._x).toEqual("0");
        expect(ctxes[1].sun._y).toEqual("0");
        p.end();
      });
    });

    it('should not get screwed up by non-celestial body in ctx', function() {
      var p, startCtx, ctxes = [];
      runs(function() {
        var dt = demoTalker();
        p = new Planets(canvasCtx(), dt);
        startCtx = {
          p1: { _x:"5", _y:"5", _xSpeed:"0", _ySpeed:"0", _meta: { type:"planet"} },
          sun: { _x:"0", _y:"0", _meta: { type:"star"} },
          whatevs: {}
        };

        dt.on(this, "demo:ctx:new", function(ctx1) { // 3
          ctxes.push(ctx1);
        });
        dt.emit("isla:ctx:new", startCtx); // 2
      });

      waits(50);
      runs(function() {
        expect(ctxes[1].p1._xSpeed < 0).toEqual(true);
        p.end();
      });
    });
  });
});
