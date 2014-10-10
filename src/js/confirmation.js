// Prevent jshinf from raising the "Expected an assignment or function call and instead saw an expression" warning
// jshint -W030

+function ($) {
    'use strict';

  // CONFIRMATION CLASS DEFINITION
  // ======================
  var Confirmation = function ($button, options) {
    if (!options['confirm-message']) {
      this.message = 'Are you sure?';
    } else {
      this.message = options['confirm-message'];
    }

  };

  Confirmation.prototype.confirm = function () {
    return confirm(this.message);
  };


  // CONFIRMATION PLUGIN DEFINITION
  // =======================

  function Plugin(options) {
    var $this = $(this);

    var data = $this.data('sui.confirmation');
    if (!data) {
      $this.data('sui.confirmation', (data = new Confirmation($this, options)));
    }

    data.confirm();
  }

  var old = $.fn.confirmation;

  $.fn.confirmation = Plugin;
  $.fn.confirmation.Constructor = Confirmation;


  // CONFIRMATION NO CONFLICT
  // =================

  $.fn.confirmation.noConflict = function () {
    $.fn.confirmation = old;
    return this;
  };


  // CONFIRMATION DATA-API
  // ==============

  $(document).on('click.sui.confirmation.data-api', '[data-toggle=confirm]', function(e) {
    var $clickedEl = $(e.currentTarget);
    Plugin.call($clickedEl, {'confirm-message': $clickedEl.data('confirm-message')});
  });

}(jQuery);

