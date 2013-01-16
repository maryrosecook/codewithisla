;(function(exports) {
  function Eventer() {
    this.callbacks = {};
  }

  var addListener = function(obj, event, callback) {
    this.callbacks[event] = this.callbacks[event] || [];
    this.callbacks[event].push({
      obj: obj,
      callback: callback
    });

    return this;
  };

  var removeListener = function(obj, event) {
    for(var i in this.callbacks) {
      if(this.callbacks[i].obj === obj) {
        delete this.callbacks[i];
        break;
      }
    }
  };

  Eventer.prototype = {
    addListener: addListener,
    removeListener: removeListener,
    on: addListener,

    emit: function(event, data) {
      var callbacks = this.callbacks[event];
      if(callbacks !== undefined) {
        for(var i = 0; i < callbacks.length; i++) {
          var callbackObj = callbacks[i];
          callbackObj.callback.call(callbackObj.obj, data);
        }
      }

      return this;
    }
  };

  exports.Eventer = Eventer;
})(typeof exports === 'undefined' ? this : exports)
