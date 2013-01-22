;(function(exports) {
  function Eventer() {
    var callbacks = {};

    this.addListener = function(obj, event, callback) {
      callbacks[event] = callbacks[event] || [];
      callbacks[event].push({
        obj: obj,
        callback: callback
      });

      return this;
    };

    this.addListener
    this.on = this.addListener;

    this.removeListener = function(obj, event) {
      if (callbacks[event] !== undefined) {
        for(var i = 0; i < callbacks[event].length; i++) {
          if(callbacks[event][i].obj === obj) {
            callbacks[event].splice(i, 1);
            break;
          }
        }
      }
    };

    this.emit = function(event, data) {
      var eventCallbacks = callbacks[event];
      if(eventCallbacks !== undefined) {
        for(var i = 0; i < eventCallbacks.length; i++) {
          var callbackObj = eventCallbacks[i];
          callbackObj.callback.call(callbackObj.obj, data);
        }
      }

      return this;
    };
  }

  exports.Eventer = Eventer;
})(typeof exports === 'undefined' ? this : exports)
