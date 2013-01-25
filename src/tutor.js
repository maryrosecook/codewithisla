;(function(exports) {
  var Tutor = function(steps, ui) {
    this.write = function(e) {
      if (e.event = "demo:code:new") {
        if (isEquivalent(e.code, currentStep)) {
          nextStep();
        }
      }
    };

    if (steps.length === 0) {
      ui.hide();
      return;
    }

    var currentStep;
    var nextStep = function() {
      var step = steps.shift();
      currentStep = step;
      if (step !== undefined) {
        ui.displayCode(step);
      } else {
        ui.displayMessage("Make up your own code");
      }
    };

    nextStep();
  };

  var isEquivalent = function(code1, code2) {
    return code1 === code2;
  };

  exports.Tutor = Tutor;
})(typeof exports === 'undefined' ? this : exports)
