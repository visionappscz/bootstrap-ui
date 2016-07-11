;(function ($, window) {
  'use strict';

  // SELECT2-LOADER DATA-API
  // ========================

  (function ($, window) {
    // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).load(function () {
      $('[data-onload-select2]').each(function () {
        var confObj = {};
        var $this = $(this);
        var confValue = $this.data('onload-select2');
        var formatFunc = function (option) {
          var imagePath = $(option.element).data('image');
          if (imagePath) {
            return '<img src="' + imagePath + '">' + option.id;
          }

          return option.id;
        };

        if (confValue) {
          confObj = confValue;
        }
        confObj.formatSelection = formatFunc;
        confObj.formatResult = formatFunc;
        confObj.escapeMarkup = function(m) { return m; };

        $this.select2(confObj);
      });
    });
  }($, window));

}(jQuery, window));
