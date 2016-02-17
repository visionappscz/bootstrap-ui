;(function ($, window, document) {
  'use strict';

  // DISABLE CLASS DEFINITION
  // ========================
  var Disable = function ($element) {
    this.$element = $element;
  };

  Disable.prototype.toggle = function () {
    $(document).trigger('toggle.sui.disable');
    this.$element.prop('disabled', !this.$element.prop('disabled'));
    $(document).trigger('toggled.sui.disable');
  };

  // DISABLE PLUGIN DEFINITION
  // =========================

  function Plugin() {
    this.each(function () {
      var $this = $(this);
      var data = $this.data('sui.disable');

      if (!data) {
        data = new Disable($this);
        $this.data('sui.disable', data);
      }

      data.toggle();
    });

    return this;
  }

  var old = $.fn.disable;

  $.fn.disable = Plugin;
  $.fn.disable.Constructor = Disable;

  // DISABLE NO CONFLICT
  // ===================

  $.fn.disable.noConflict = function () {
    $.fn.disable = old;
    return this;
  };

  // DISABLE DATA-API
  // ================

  (function (Plugin, $, window) {
    // We have to use $(window).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).load(function () {
      var $controls = $('[data-toggle=disable]');

      $controls.each(function () {
        var $this = $(this);
        var eventType = $this.data('disable-event');
        if (!eventType) {
          eventType = 'change';
        }

        $this.on(eventType + '.sui.disable.data-api', function () {
          Plugin.call($($this.data('disable-target')));
        });
      });
    });
  }(Plugin, $, window));

}(jQuery, window, document));
