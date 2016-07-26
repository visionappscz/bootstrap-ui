;(function ($, moment, window) {
  'use strict';

  var DatetimePickerLoader = function ($element) {
    this.$element = $element;
  };

  DatetimePickerLoader.prototype.filterLocale = function (locale) {
    return moment.locale(locale);
  };

  DatetimePickerLoader.prototype.init = function (confObj) {
    confObj.locale = this.filterLocale(confObj.locale);
    this.$element.datetimepicker(confObj);
  };

  // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
  // and thus it would make it impossible to test this part of the code.
  $(window).on('load', function () {
    var initComponentFn = function (inlineConf) {
      var datetimePickerLoader = new DatetimePickerLoader($(this));
      var conf = {
        allowInputToggle: true,
        sideBySide: true,
        locale: $('html').attr('lang'),
      };

      if (inlineConf) {
        $.extend(conf, inlineConf);
      }

      datetimePickerLoader.init(conf);
    };

    // CKEDITOR-LOADER DATA-API
    // ========================

    $('[data-onload-datetimepicker]').each(function () {
      initComponentFn.call(this, $(this).data('onload-datetimepicker'));
    });
  });

}(jQuery, moment, window));
