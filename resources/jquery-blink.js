(function($)
{
  $.fn.blink = function(options)
  {
          var defaults = { delay:500 };
          var options = $.extend(defaults, options);

          return this.each(function()
          {
                  var obj = $(this);
                  if (obj.attr("timerid") > 0) return;
                  var timerid=setInterval(function()
                  {
                          if($(obj).css("opacity") == "1")
                          {
                                  $(obj).css('opacity','0');
                          }
                          else
                          {
                                  $(obj).css('opacity','1');
                          }
                  }, options.delay);
                  obj.attr("timerid", timerid);
          });
  }
  $.fn.unblink = function(options)
  {
          var defaults = { opacity:1 };
          var options = $.extend(defaults, options);

          return this.each(function()
          {
                  var obj = $(this);
                  if (obj.attr("timerid") > 0)
                  {
                          clearInterval(obj.attr("timerid"));
                          obj.attr("timerid", 0);
                          obj.css('opacity', options.opacity?'1':'0');
                  }
          });
  }
}(jQuery))
