;(function(exports) {
  function Eventer() {
    this.callbacks = {};
  }

  Eventer.prototype = {
    bind: function(obj, event, callback) {
      this.callbacks[event] = this.callbacks[event] || [];
      this.callbacks[event].push({
        obj: obj,
        callback: callback
      });

      return this;
    },

    unbind: function(obj, event) {
      for(var i in this.callbacks) {
        if(this.callbacks[i].obj === obj) {
          delete this.callbacks[i];
          break;
        }
      }
    },

    emit: function(event, data) {
      this.dispatch(event, data);
      return this;
    },

    dispatch: function(event, data) {
      var callbacks = this.callbacks[event];

      if(callbacks !== undefined) {
        for(var i = 0; i < callbacks.length; i++) {
          var callbackObj = callbacks[i];
          callbackObj.callback.call(callbackObj.obj, data);
        }
      }
    }
  };

  exports.Eventer = Eventer;
})(typeof exports === 'undefined' ? this : exports)
