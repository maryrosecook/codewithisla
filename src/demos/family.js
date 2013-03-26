;(function(exports) {
  var EnvStore, demoUtils, _, Isla;
  if(typeof module !== 'undefined' && module.exports) { // node
    EnvStore = require('../env-store.js').EnvStore;
    demoUtils = require('../demo-utils.js').demoUtils;
    _ = require("Underscore");
    Isla = require('../node_modules/isla/src/isla.js').Isla;
  } else { // browser
    Isla = window.Isla;
    EnvStore = window.EnvStore;
    demoUtils = window.demoUtils;
    _ = window._;
  }

  function Family(canvasCtx, demoTalker) {
    if (canvasCtx == null) {
      throw "You must provide a canvas context to draw to.";
    }

    if (demoTalker == null) {
      throw "You must provide a demo talker to communicate with.";
    }

    if (canvasCtx.fillRect === undefined) {
      throw "The variable you passed does not seem to be a canvas context.";
    }

    var _currentCtx;
    var currentCtx = function(inCtx) {
      if (inCtx !== undefined) {
        _currentCtx = inCtx;
        demoTalker.emit("demo:ctx:new", _currentCtx);
      } else {
        return _currentCtx;
      }
    };

    var _indications = {};
    this.indications = function(inIndications) {
      if (inIndications !== undefined) {
        _indications = inIndications;
      } else {
        return _indications;
      }
    };

    // setupHelp(demoTalker, this);

    // main draw loop
    this._draw = function() {
      drawBackground(canvasCtx);
      if (currentCtx() !== undefined) { // no ctx until sent 1st one by runner
        drawBears(canvasCtx, currentCtx(), this.indications());
      }
    };

    // sets up cb to take latest Isla ctx, process bears and issue update
    demoTalker.on(this, "isla:ctx:new", function(ctx) {
      try {
        var retCtx = EnvStore.extend(true, {}, ctx); // ctx unres, refs no wk
        for (var i in defaultFns) {
          for (var j in retCtx) {
            if (demoUtils.isIslaType(retCtx[j], "bear")) {
              retCtx[j] = defaultFns[i](canvasCtx, retCtx[j], retCtx);
            }
          }
        }
        currentCtx(retCtx);
      } catch(e) {
        console.log(e.message);
        throw e;
      }
    });

    // set draw loop going
    var self = this;
    this.interval = setInterval(function() {
      self._draw();
    }, 33);
  }

  Family.prototype = {
    getTutorSteps: function() {
      return STEPS;
    },

    // stop drawing
    end: function() {
      clearInterval(this.interval);
    },

    init: function() {},

    intro: function() {
      return [
        "mum is a bear",
        "dad is a bear",
        "phil is a bear",
        "gilly is a bear",
        "jess is a bear",
        "matt is a bear",
        "em is a bear",
        // "soph is a bear",
        // "isla is a bear"
      ];
    }
  };

  var pf = parseFloat;

  var nextId = function(ctx) {
    var id = 0;
    for (var i in ctx) {
      if (ctx[i]._id > id) {
        id = ctx[i]._id;
      }
    }
    return id + 1;
  };

  var defaultFns = {
    id: function(canvasCtx, bear, ctx) {
      var retBear = EnvStore.extend(true, {}, bear);
      retBear._id = retBear._id || nextId(ctx);
      return retBear;
    },

    size: function(canvasCtx, bear, ctx) {
      var retBear = EnvStore.extend(true, {}, bear);
      retBear.size = retBear.size || demoUtils.random(SIZES);
      return retBear;
    },

    x: function(canvasCtx, bear, ctx) {
      var retBear = EnvStore.extend(true, {}, bear);
      retBear._x = bearX(canvasCtx, ctx, bear);
      return retBear;
    },

    rest: function(canvasCtx, bear, ctx) {
      var retBear = EnvStore.extend(true, {}, bear);
      retBear._y = retBear._y || canvasCtx.canvas.height * 0.95;
      if (retBear.eyes === undefined) {
        var eyes = Isla.Interpreter.instantiateType("eyes", ctx);
        eyes.color = "brown";
        retBear.eyes = eyes;
      }
      return retBear;
    }
  };

  var drawBackground = function(canvasCtx) {
    canvasCtx.fillStyle = "#fff";
    canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
  };

  var drawBears = function(canvasCtx, ctx, indications) {
    for (var i in ctx) {
      if (demoUtils.isIslaType(ctx[i], "bear")) {
        drawBear(canvasCtx, ctx[i], indications[i]);
      }
    }
  };

  var BEAR_COLOR = "#542400";

  var bearCoords = function(bear) {
    var d = bearDims(bear);

    // nose
    d.xNose = bear._x + d.w / 2;
    d.yNose = bear._y - d.h + d.dHead / 2;

    // ears
    d.xLeftEar = d.xNose - d.dHead / 2.5;
    d.xRightEar = d.xNose + d.dHead / 2.5;
    d.yEars = d.yNose - d.dHead / 4;

    // eyes
    d.xLeftEye = d.xNose - d.dHead / 5;
    d.xRightEye = d.xNose + d.dHead / 5;
    d.yEyes = d.yNose - d.dHead / 8;

    // torso
    d.xNeck = d.xNose;
    d.yNeck = d.yNose + d.dHead * 0.85;
    d.xTummy = d.xNose;
    d.yHips = d.yNeck + d.hTorso;

    // arms
    d.xLeftShoulder = d.xNeck - d.oxShoulder;
    d.xLeftHand = d.xLeftShoulder - d.oxHandFromShoulder;
    d.xRightShoulder = d.xNeck + d.oxShoulder;
    d.xRightHand = d.xRightShoulder + d.oxHandFromShoulder;
    d.yShoulder = d.yNeck - d.oyShoulder;
    d.yHand = d.yShoulder + d.oyHandFromShoulder;

    // clothes
    d.xNeckline = d.xNeck;
    d.yNeckline = d.yNose + d.dHead / 2;
    d.xLeftOfShoulder = d.xLeftShoulder - d.wArm / 2;

    // legs
    d.xLeftHip = d.xNeck - d.oxHip;
    d.xLeftFoot = d.xLeftHip - d.oxFootFromHip;
    d.xRightHip = d.xNeck + d.oxHip;
    d.xRightFoot = d.xRightHip + d.oxFootFromHip;
    d.yFeet = d.yHips + d.oyFootFromHip;

    // helpers
    d.l = d.xNose - d.w / 2;
    d.r = d.xNose + d.w / 2;
    d.t = bear._y - d.h;

    return d;
  };

  var bearDims = function(bear) {
    var d = {};
    d.dHead = size(bear.size);
    d.dEar = d.dHead / 2;
    d.wEye = d.dHead / 4;
    d.hEye = d.wEye / 1.4;
    d.dIris = d.dHead / 7;
    d.dPupil = d.dHead / 20;

    d.oxShoulder = d.dHead / 3;
    d.oxHandFromShoulder = d.dHead / 2.20;
    d.oyShoulder = d.dHead / 5;
    d.oyHandFromShoulder = d.dHead / 1.3;

    d.oxHip = d.dHead / 4;
    d.oxFootFromHip = d.dHead / 6;
    d.oyHip = d.dHead / 3;
    d.oyFootFromHip = d.dHead / 1.1;

    // torso
    d.wTorso = d.dHead;
    d.hTorso = size(bear.size) * 0.6;

    // arms
    d.wArm = d.dHead / 2;

    // legs
    d.wLeg = d.dHead / 2;

    // clothes
    d.wTop = d.oxShoulder * 2;

    // helpers
    d.w = d.oxShoulder * 2 + d.oxHandFromShoulder * 2 + d.wArm;
    d.h = d.dHead / 2 + d.hTorso + d.wTorso + d.oyFootFromHip;

    return d;
  };

  var drawHead = function(canvasCtx, bear, indicate) {
    var d = bearCoords(bear);
    canvasCtx.fillStyle = demoUtils.color(BEAR_COLOR);

    canvasCtx.beginPath();
    canvasCtx.arc(d.xNose, d.yNose, d.dHead / 2, 0, Math.PI * 2, true);
    canvasCtx.closePath();
    canvasCtx.fill();

    // ears

    canvasCtx.beginPath();
    canvasCtx.arc(d.xLeftEar, d.yEars, d.dEar / 2, 0, Math.PI * 2, true);
    canvasCtx.closePath();
    canvasCtx.fill();

    canvasCtx.beginPath();
    canvasCtx.arc(d.xRightEar, d.yEars, d.dEar / 2, 0, Math.PI * 2, true);
    canvasCtx.closePath();
    canvasCtx.fill();

    // eye whites

    canvasCtx.fillStyle = "white";

    drawEllipse(canvasCtx, d.xLeftEye - d.wEye / 2, d.yEyes - d.hEye / 2,
                d.wEye, d.hEye);
    canvasCtx.fill();

    drawEllipse(canvasCtx, d.xRightEye - d.wEye / 2, d.yEyes - d.hEye / 2,
                d.wEye, d.hEye);
    canvasCtx.fill();

    // irises

    canvasCtx.fillStyle = bear.eyes.color;

    canvasCtx.beginPath();
    canvasCtx.arc(d.xLeftEye, d.yEyes, d.dIris / 2, 0, Math.PI * 2, true);
    canvasCtx.closePath();
    canvasCtx.fill();

    canvasCtx.beginPath();
    canvasCtx.arc(d.xRightEye, d.yEyes, d.dIris / 2, 0, Math.PI * 2, true);
    canvasCtx.closePath();
    canvasCtx.fill();

    // pupils

    canvasCtx.fillStyle = "black";

    canvasCtx.beginPath();
    canvasCtx.arc(d.xLeftEye, d.yEyes, d.dPupil / 2, 0, Math.PI * 2, true);
    canvasCtx.closePath();
    canvasCtx.fill();

    canvasCtx.beginPath();
    canvasCtx.arc(d.xRightEye, d.yEyes, d.dPupil / 2, 0, Math.PI * 2, true);
    canvasCtx.closePath();
    canvasCtx.fill();
  };

  var drawEllipse = function(ctx, x, y, w, h) {
    var kappa = .5522848;
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
  };

  var drawTorso = function(canvasCtx, bear, indicate) {
    var d = bearCoords(bear);
    canvasCtx.strokeStyle = demoUtils.color(BEAR_COLOR);
    canvasCtx.lineCap = 'round';
    canvasCtx.lineWidth = d.wTorso;

    canvasCtx.beginPath();
    canvasCtx.moveTo(d.xNeck, d.yNeck);
    canvasCtx.lineTo(d.xTummy, d.yHips);
    canvasCtx.stroke();
    canvasCtx.closePath();
  };

  var drawArms = function(canvasCtx, bear, indicate) {
    var d = bearCoords(bear);
    canvasCtx.strokeStyle = demoUtils.color(BEAR_COLOR);
    canvasCtx.lineWidth = d.wArm;

    canvasCtx.beginPath();
    canvasCtx.moveTo(d.xLeftShoulder, d.yShoulder);
    canvasCtx.lineTo(d.xLeftHand, d.yHand);
    canvasCtx.moveTo(d.xRightShoulder, d.yShoulder);
    canvasCtx.lineTo(d.xRightHand, d.yHand);
    canvasCtx.stroke();
    canvasCtx.closePath();
  };

  var drawLegs = function(canvasCtx, bear, indicate) {
    var d = bearCoords(bear);
    canvasCtx.strokeStyle = demoUtils.color(BEAR_COLOR);
    canvasCtx.lineWidth = d.wLeg;

    canvasCtx.beginPath();
    canvasCtx.moveTo(d.xLeftHip, d.yHips);
    canvasCtx.lineTo(d.xLeftFoot, d.yFeet);
    canvasCtx.moveTo(d.xRightHip, d.yHips);
    canvasCtx.lineTo(d.xRightFoot, d.yFeet);
    canvasCtx.stroke();
    canvasCtx.closePath();
  };

  var drawShirt = function(canvasCtx, bear) {
    var d = bearCoords(bear);
    canvasCtx.fillStyle = "green";
    canvasCtx.lineWidth = 1;
    canvasCtx.fillRect(d.xLeftShoulder, d.yNeckline,
                       d.wTop, 10);
  };

  var drawClothes = function(canvasCtx, bear) {
    drawShirt(canvasCtx, bear);
  };

  var drawBear = function(canvasCtx, bear, indicate) {
    var d = bearCoords(bear);
    canvasCtx.lineWidth = 1;
    // canvasCtx.strokeRect(d.l, d.t, 2, d.h);
    // canvasCtx.strokeRect(bearCoords(bear).xNose, 0, 1, 400);
    drawLegs(canvasCtx, bear, indicate);
    drawTorso(canvasCtx, bear, indicate);
    drawArms(canvasCtx, bear, indicate);
    drawHead(canvasCtx, bear, indicate);
    drawClothes(canvasCtx, bear);
  };

  // var setupHelp = function(demoTalker, demo) {
  //   demoTalker.on(this,  "isla:mouse:mouseover", function(data) {
  //     if (data.thing === "token" && data.syntaxNode.syntax === "variable") {
  //       var indications = EnvStore.extend(true, {}, demo.indications());
  //       indications[data.syntaxNode.code] = true;
  //       demo.indications(indications);
  //     }
  //   });

  //   demoTalker.on(this, "isla:mouse:mouseout", function() {
  //     demo.indications({});
  //   });
  // };

  var clearHelp = function() {
    indicate("clear");
  };

  var indicate = function(event, data) {
    consoleIndicator.write({ event: event, data: data, id: id});
  };

  var SIZES = { small:40, medium:50, big:60 };

  var size = function(sizeStr) {
    return demoUtils.translateNumberWord(sizeStr, SIZES);
  };

  // first bear in middle, second to left of middle, third to right of middle,
  // fourth to left of bear on left of middle...
  var bearX = function(canvasCtx, ctx, bear) {
    var bears = [];
    for (var i in ctx) {
      if (demoUtils.isIslaType(ctx[i], "bear") && ctx[i]._id < bear._id) {
        bears.push(ctx[i]);
      }
    }

    bears = bears.sort(function(a, b) {
      return a._id - b._id;
    });

    var x = middle = canvasCtx.canvas.width / 2;
    if (bears.length === 0) {
      return x;
    } else if (bears.length % 2 === 0) { // bear belongs on right
      for (var i = 0; i < bears.length; i++) {
        if (bearCoords(bears[i]).xNose >= middle) {
          x = bearCoords(bears[i]).r;
        }
      }
      return x;
    } else { // bear belongs on left
      for (var i = 0; i < bears.length; i++) {
        if (bearCoords(bears[i]).xNose < middle) {
          x = bearCoords(bears[i]).l;
        }
      }
      return x - bearCoords(bear).w;
    }
  };

  var STEPS = [
  ];

  exports.Family = Family;
})(typeof exports === 'undefined' ? this : exports)
