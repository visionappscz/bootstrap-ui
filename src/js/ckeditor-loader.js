;(function($, window) {
  'use strict';

  // CKEDITOR-LOADER DATA-API
  // ================

  (function($, window) {
    // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).load(function() {
      $('[data-onload-ckeditor]').each(function() {
        var $this = $(this);
        $this.ckeditor({customConfig: $this.data('onload-ckeditor')});
      });
    });
  }($, window));

}(jQuery, window));
