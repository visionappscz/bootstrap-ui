;(function($, window) {
  'use strict';

  // SELECT2-LOADER DATA-API
  // ========================

  (function($, window) {
    // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).load(function() {
      $('[data-onload-select2]').each(function() {
        var confObj = {};
        var $this = $(this);
        var confValue = $this.data('onload-select2');
        if (confValue) {
          confObj = confValue;
        }

        $this.select2(confObj);
      });
    });
  }($, window));

}(jQuery, window));
