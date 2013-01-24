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

  exports.ui.textHelper = {
    displayMessage: function(text) {
      var html = text.replace(/\n/g, "<br/>");
      html = html.replace(/  /g, "&nbsp;&nbsp;");
      $('#help').html(html);
    },

    indicate: function(consoleIndicator, event, data) {
      consoleIndicator.write({ event:event, data:data, id:"textHelper" });
    }
  };
})(typeof exports === 'undefined' ? this : exports)
