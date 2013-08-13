;(function(exports) {
  var Isla;
  if(typeof module !== 'undefined' && module.exports) { // node
    Isla = require('../node_modules/isla/src/isla.js').Isla;
  } else { // browser
    Isla = window.Isla;
  }

  var EnvStore = function() {
    var committedEnvs = [];
    var tempEnv = undefined;

    this.write = function(e) {
      if (e.event === "commit") {
        if (tempEnv !== undefined) {
          committedEnvs.push(tempEnv);
          tempEnv = undefined;
        } else {
          throw "Temp environment is null or undefined"
        }
      } else {
        if (e.env != null) {
          tempEnv = e.env.clone();
        } else {
          throw "Environment is null or undefined"
        }
      }
    },

    this.latestCommitted = function() {
      return committedEnvs[committedEnvs.length - 1].clone();
    };

    this.latest = function() {
      var env;
      if (tempEnv === undefined) {
        env = committedEnvs[committedEnvs.length - 1];
      } else {
        env = tempEnv;
      }

      return env.clone();
    };
  };

  exports.EnvStore = EnvStore;
})(typeof exports === 'undefined' ? this : exports)
