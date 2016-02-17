;(function ($, window) {
  'use strict';

  // CKEDITOR-LOADER DATA-API
  // ========================

  (function ($, window) {
    // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).load(function () {
      var initComponentFn = function (confObj, confValue) {
        if (confValue) {
          $.extend(confObj, confValue);
        }

        $(this).datetimepicker(confObj);
      };

      $('[data-onload-datetimepicker]').each(function () {
        initComponentFn.call(this, { allowInputToggle: true, sideBySide: true }, $(this).data('onload-datetimepicker'));
      });
    });
  }($, window));

}(jQuery, window));
