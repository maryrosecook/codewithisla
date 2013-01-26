var _ = require('Underscore');
var Eventer = require('../src/eventer').Eventer;
var Draw = require('../src/demos/planets').Planets;
var Planets = require('../src/demos/planets').Planets;


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

describe('Planets', function() {
  describe('basics', function() {
    it('', function() {
    });
  });
});
