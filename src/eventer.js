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
      for(var i in callbacks) {
        if(callbacks[i].obj === obj) {
          delete callbacks[i];
          break;
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
