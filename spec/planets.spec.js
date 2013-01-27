var _ = require('Underscore');
var Eventer = require('../src/eventer').Eventer;
var Draw = require('../src/demos/planets').Planets;
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
    moveTo: noop
  };
};

var demoTalker = function() {
  return new Eventer();
};

describe('Planets', function() {
  describe('basics', function() {
    it('', function() {
    });
  });
});
