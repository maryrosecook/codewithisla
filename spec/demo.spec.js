var _ = require('Underscore');
var Eventer = require('../src/eventer').Eventer;

// list all demos to do basic tests on here
var demos = [
  require('../src/demos/draw').Draw,
  require('../src/demos/planets').Planets
]

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

// runs all the basic tests on the passed hemo
var runTests = function(Demo) {
  describe('Basic demo functionality', function() {
    describe('instantiation', function() {
      it('should complain if no canvas passed', function() {
        expect(function(){
          new Demo();
        }).toThrow("You must provide a canvas context to draw to.");
      });

      it('should complain if no demoTalker passed', function() {
        expect(function(){
          new Demo(ctx());
        }).toThrow("You must provide a demo talker to communicate with.");
      });

      it('should not complain if canvas and demoTalker passed', function() {
        (new Demo(ctx(), demoTalker())).end();
      });
    });

    describe('draw loop', function() {
      it('should start drawing upon instantiation', function() {
        var ran;
        runs(function() {
          var demo = new Demo(ctx(), demoTalker());
          demo._draw = function() {
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
          var demo = new Demo(ctx(), demoTalker());
          demo._draw = function() {
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
  });
}

// go through demos, running basic tests on each
for (var i = 0; i < demos.length; i++) {
  runTests(demos[i])
}
