;(function(exports) {
  var Mouser = function(id) {
    this.events = new Eventer();
    var self = this;

    $(id).mousemove(function(e) {
      self.events.emit('data', {
        event: 'mousemove',
        point: relative(e, $(this))
      });
    });

    $(id).mouseout(function(e) {
      self.events.emit('data', {
        event: 'mouseout'
      });
    });

    $(id).click(function(e) {
      self.events.emit('data', {
        event: 'click',
        point: relative(e, $(this))
      });
    });
  };

  var relative = function(e, element) {
    return {
      x: e.pageX - element.offset().left,
      y: e.pageY - element.offset().top
    };
  };

  exports.Mouser = Mouser;
})(typeof exports === 'undefined' ? this : exports)
