;(function(exports) {
  exports.ui = {};
  exports.ui.tutor = {
    hide: function() {
      $('#tutor').hide();
    },

    displayCode: function(code) {
      $('#tutor').html("Write <span class='code'>" + code + "</span> below");
    },

    displayMessage: function(text) {
      $('#tutor').text(text);
    }
  };
})(typeof exports === 'undefined' ? this : exports)
