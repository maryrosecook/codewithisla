;(function(exports) {
  var EnvStore, _, demoUtils;
  if(typeof module !== 'undefined' && module.exports) { // node
    EnvStore = require('../env-store.js').EnvStore;
    _ = require("Underscore");
    demoUtils = require('../demo-utils.js').demoUtils;
  } else { // browser
    EnvStore = window.EnvStore;
    _ = window._;
    demoUtils = window.demoUtils;
  }

  function Shapes(canvasCtx, demoTalker) {
    if (canvasCtx == null) {
      throw "You must provide a canvas context to draw to.";
    }

    if (demoTalker == null) {
      throw "You must provide a demo talker to communicate with.";
    }

    if (canvasCtx.fillRect === undefined) {
      throw "The variable you passed does not appear to be a canvas context.";
    }

    this.canvasCtx = canvasCtx;

    var operations = [];
    this.operations = function(inOperations) {
      if (inOperations !== undefined) {
        operations = inOperations;
      } else {
        return operations.sort(function(a, b) { return a.order - b.order; });
      }
    };

    setupCtxProcessing(demoTalker, this);
    setupHelp(demoTalker, this);

    // start drawing
    var self = this;
    this.interval = setInterval(function() {
      self._draw();
    }, 50);
  }

  Shapes.prototype = {
    getTutorSteps: function() {
      return steps;
    },

    // stop drawing
    end: function() {
      clearInterval(this.interval);
    },

    // main draw loop would have preferred this to be private,
    // but then it would be hard to test
    _draw: function() {
      this.canvasCtx.fillStyle = "#fff";
      this.canvasCtx.fillRect(0, 0, this.canvasCtx.canvas.width,
                              this.canvasCtx.canvas.height);
      var operations = this.operations();
      for(var i = 0; i < operations.length; i++) {
        operations[i].fn(operations[i].indicate);
      }
    },

    init: function() {}
  };

  // sets up cb to take latest Isla ctx and make draw ops from objects
  var setupCtxProcessing = function(demoTalker, demo) {
    demoTalker.on(demo, "isla:ctx:new", function(ctx) {
      // NB: ctx is unresolved so will not wk for complex assocs
      var retCtx = EnvStore.extend(true, {}, ctx);

      retCtx = order(retCtx);
      var operations = [];
      for (var i in retCtx) {
        if (retCtx[i]._meta !== undefined) {
          var type = retCtx[i]._meta.type;
          if (shapes[type] !== undefined) {
            retCtx[i] = shapes[type].defaults(demo.canvasCtx, retCtx[i]);
            operations.push(makeOperation(demo.canvasCtx, retCtx[i], i));
          }
        }
      }

      demo.operations(operations);
      demoTalker.emit("demo:ctx:new", retCtx);
    });
  };

  // mark new ctx entry w order (can only be one, max)
  var order = function(ctx) {
    var retCtx = EnvStore.extend(true, {}, ctx);
    var newElement = _.find(retCtx, function(x) {
      return x._meta !== undefined && x._meta.order === undefined;
    });

    var lastCtxElement = _.max(retCtx, function(x) {
      return x._meta !== undefined ? x._meta.order : undefined;
    });

    if (newElement !== undefined) { // got new element of ctx - add order
      if (lastCtxElement === undefined) {
        newElement._meta.order = 0;
      } else {
        newElement._meta.order = lastCtxElement._meta.order + 1;
      }
    }
    return retCtx;
  };

  var setupHelp = function(demoTalker, demo) {
    demoTalker.on(this, "isla:mouse:mouseover", function(data) {
      if (data.thing === "token" && data.syntaxNode.syntax === "variable") {
        var operations = demo.operations();
        for (var i = 0; i < operations.length; i++) {
          if (operations[i].name === data.syntaxNode.code) {
            operations[i].indicate = true;
          }
        }
      }
    });

    demoTalker.on(this, "isla:mouse:mouseout", function() {
      var operations = demo.operations();
      for (var i = 0; i < operations.length; i++) {
        operations[i].indicate = false;
      }
    });
  };

  var clearHelp = function() {
    indicate("clear");
  };

  var indicate = function(event, data) {
    consoleIndicator.write({ event: event, data: data, id: id});
  };

  var makeOperation = function(canvasCtx, obj, name) {
    return {
      indicate: false,
      order: obj.order,
      name: name,
      fn: function(indicate) {
        shapes[obj._meta.type].fn(canvasCtx, obj, indicate);
      }
    };
  };

  var SIZES = {
    small: 50,
    medium: 100,
    big: 150
  };

  var size = function(sizeStr) {
    return demoUtils.translateNumberWord(sizeStr, SIZES);
  };

  var basicDefaults = function(canvasCtx, obj) {
    var retObj = EnvStore.extend(true, {}, obj);
    retObj.color = retObj.color || demoUtils.random(demoUtils.COLORS);
    retObj._x = retObj._x || demoUtils.random(canvasCtx.canvas.width);
    retObj._y = retObj._y || demoUtils.random(canvasCtx.canvas.height);
    return retObj;
  };

  var drawPolygon = function(canvasCtx, obj, indicate) {
    var x = parseFloat(obj._x);
    var y = parseFloat(obj._y);
    var objSize = size(obj.size);

    canvasCtx.fillStyle = demoUtils.color(obj.color);
    canvasCtx.beginPath();
    canvasCtx.moveTo(x + objSize * Math.cos(obj._meta.rot),
                     y + objSize * Math.sin(obj._meta.rot));

    for (var i = 1; i <= obj._meta.sides; i += 1) {
      canvasCtx.lineTo(x + objSize * Math.cos(obj._meta.rot + i * 2 *
                                              Math.PI / obj._meta.sides),
                       y + objSize * Math.sin(obj._meta.rot + i * 2 *
                                              Math.PI / obj._meta.sides));
    }

    canvasCtx.closePath();
    canvasCtx.fill();
    if (indicate) {
      canvasCtx.lineWidth = 4;
      canvasCtx.stroke();
    }
  };

  var polygonDefaults = function(canvasCtx, obj, polyConfig) {
    var retObj = basicDefaults(canvasCtx, EnvStore.extend(true, {}, obj));
    retObj.size = retObj.size || demoUtils.random(SIZES);
    retObj._meta.sides = polyConfig.sides;
    retObj._meta.rot = polyConfig.rot;
    return retObj;
  };

  var circle = {
    fn: function(canvasCtx, obj, indicate) {
      var objSize = size(obj.size);
      canvasCtx.fillStyle = demoUtils.color(obj.color);
      canvasCtx.beginPath();
      canvasCtx.arc(obj._x, obj._y, objSize / 2, 0, Math.PI * 2, true);
      canvasCtx.closePath();
      canvasCtx.fill();
      if (indicate) {
        canvasCtx.lineWidth = 4;
        canvasCtx.stroke();
      }
    },

    defaults: function(canvasCtx, obj) {
      var retObj = basicDefaults(canvasCtx, EnvStore.extend(true, {}, obj));
      retObj.size = retObj.size || demoUtils.random(SIZES);
      return retObj;
    }
  };

  var rectangle = {
    fn: function(canvasCtx, obj, indicate) {
      var width = size(obj.width);
      var height = size(obj.height)
      canvasCtx.fillStyle = demoUtils.color(obj.color);
      canvasCtx.fillRect(obj._x - width / 2, obj._y - height / 2,
                         width, height);
      if (indicate) {
        canvasCtx.lineWidth = 4;
        canvasCtx.strokeRect(obj._x - width / 2, obj._y - height / 2,
                             width, height);
      }
    },

    defaults: function(canvasCtx, obj) {
      var retObj = basicDefaults(canvasCtx, EnvStore.extend(true, {}, obj));
      retObj.width = retObj.width || demoUtils.random(SIZES);
      retObj.height = retObj.height || demoUtils.random(SIZES);
      return retObj;
    }
  };

  var square = {
    fn: function(canvasCtx, obj, indicate) {
      var objSize = size(obj.size);
      canvasCtx.fillStyle = demoUtils.color(obj.color);
      canvasCtx.fillRect(obj._x - objSize / 2, obj._y - objSize / 2,
                         objSize, objSize);
      if (indicate) {
        canvasCtx.lineWidth = 4;
        canvasCtx.strokeRect(obj._x - objSize / 2, obj._y - objSize / 2,
                             objSize, objSize);
      }
    },

    defaults: function(canvasCtx, obj) {
      var retObj = basicDefaults(canvasCtx, EnvStore.extend(true, {}, obj));
      retObj.size = retObj.size || demoUtils.random(SIZES);
      return retObj;
    }
  };

  var triangle = {
    fn: function(canvasCtx, obj, indicate) {
      var x = parseFloat(obj._x);
      var y = parseFloat(obj._y);
      var objSize = size(obj.size);
      var h = objSize * Math.sqrt(3)/2;

      canvasCtx.fillStyle = demoUtils.color(obj.color);
      canvasCtx.beginPath();
      canvasCtx.lineTo(x - objSize / 2, y + h / 2);
      canvasCtx.lineTo(x + objSize / 2, y + h / 2);
      canvasCtx.lineTo(x, y - h / 2);
      canvasCtx.closePath();
      canvasCtx.fill();
      if (indicate) {
        canvasCtx.lineWidth = 4;
        canvasCtx.stroke();
      }
    },

    defaults: function(canvasCtx, obj) {
      var retObj = basicDefaults(canvasCtx, EnvStore.extend(true, {}, obj));
      retObj.size = retObj.size || demoUtils.random(SIZES);
      return retObj;
    }
  };

  var line = {
    fn: function(canvasCtx, obj) {
      throw "implement me";
    },

    defaults: function(canvasCtx, obj) {
      return {};
    }
  };

  var shapes = {
    circle: circle,
    triangle: triangle,
    square: square,
    rectangle: rectangle,
    line: line,
    oblong: rectangle
  };

  var makePolygonCode = function(polyConfig) {
    return {
      fn: function(canvasCtx, obj, indicate) {
        drawPolygon(canvasCtx, obj, indicate);
      },

      defaults: function(canvasCtx, obj) {
        return polygonDefaults(canvasCtx, obj, polyConfig);
      }
    };
  }

  var steps = [
    "cherry is a circle",
    "melon is a circle",
    "grape is a circle",
    "cup is a square",
    "grape color is 'red'",
    "grape color is 'green'",
    "cherry color is 'red'",
    "melon color is 'yellow'",
    "cherry size is 'small'",
    "cup color is 'gray'",
    "grape size is 'small'",
    "melon size is 'big'",
    "pizza is a triangle",
  ];

  var polygons = {
    "pentagon": { rot: 0.94, sides:5 },
    "hexagon": { rot: 0, sides:6 },
    "heptagon": { rot: 0.22, sides:7 },
    "octagon": { rot: 0.39, sides:8 },
  };

  for (var i in polygons) {
    shapes[i] = makePolygonCode(polygons[i]);
  }

  exports.Shapes = Shapes;
})(typeof exports === 'undefined' ? this : exports)
