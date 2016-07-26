;(function ($, window) {
  'use strict';

  // SELECT2-LOADER DATA-API
  // ========================

  (function ($, window) {
    // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).on('load', function () {
      $('[data-onload-select2]').each(function () {
        var confObj = {};
        var $this = $(this);
        var confValue = $this.data('onload-select2');
        var formatFunc = function (option) {
          var $optionEl = $(option.element);
          var imageSrc = $optionEl.data('image-src');
          var imageSrcset = $optionEl.data('image-srcset');
          var imageHeight = $optionEl.data('image-height');
          var imageWidth = $optionEl.data('image-width');
          var attribs = '';

          if (imageSrc) {
            attribs = 'src="' + imageSrc + '" alt="' + option.text + '"';
            if (imageSrcset) {
              attribs = attribs + ' srcset="' + imageSrcset + '"';
            }

            if (imageHeight) {
              attribs = attribs + ' height="' + imageHeight + '"';
            }

            if (imageWidth) {
              attribs = attribs + ' width="' + imageWidth + '"';
            }

            return '<img ' + attribs + '>&nbsp;' + option.text;
          }

          return option.text;
        };

        if (confValue) {
          confObj = confValue;
        }

        confObj.formatSelection = formatFunc;
        confObj.formatResult = formatFunc;
        confObj.escapeMarkup = function (m) { return m; };

        $this.select2(confObj);
      });
    });
  }($, window));

}(jQuery, window));
