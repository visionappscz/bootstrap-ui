;(function ($, window) {
  'use strict';

  // CKEDITOR-LOADER DATA-API
  // ========================

  (function ($, window) {
    // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).on('load', function () {
      $('[data-onload-ckeditor]').each(function () {
        var language = $('html').attr('lang');
        var confObj = {};
        var $this = $(this);
        var confValue = $this.data('onload-ckeditor');

        if (confValue) {
          if (typeof confValue === 'object') {
            confObj = confValue;
          } else {
            confObj = { customConfig: confValue };
          }
        }

        if (language && !confObj.hasOwnProperty('language')) {
          confObj.language = language;
        }

        $this.ckeditor(confObj);
      });
    });
  }($, window));

}(jQuery, window));
