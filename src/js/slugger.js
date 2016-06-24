;(function ($, window, document) {
  'use strict';

  // SLUGGER CLASS DEFINITION
  // ========================
  var Slugger = function ($source, options) {
    this.$source = $source;
    this.$target = options.target;
  };

  Slugger.prototype.updateSlug = function () {
    var generateSlug = function (str) {
      var from = 'ãàáäâåčçďẽèéëêìíïîñõòóöôřšťùúüûýž·/_,:;';
      var to   = 'aaaaaaccdeeeeeiiiinooooorstuuuuyz------';

      str = str
        .replace(/^\s+|\s+$/g, '') //trim
        .toLowerCase();

      for (var i = 0; i < from.length; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
      }

      str = str
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

      return str;
    };

    this.$target.val(generateSlug(this.$source.val()));
    this.$source.trigger('updated.bui.slugger');
  };

  // SLUGGER PLUGIN DEFINITION
  // =========================

  function Plugin(options) {
    this.each(function () {
      var $this = $(this);
      var data = $this.data('bui.slugger');

      if (!data) {
        data = new Slugger($this, options);
        $this.data('bui.slugger', data);
      }

      data.updateSlug();
    });

    return this;
  }

  var old = $.fn.slugger;

  $.fn.slugger = Plugin;
  $.fn.slugger.Constructor = Slugger;

  // SLUGGER NO CONFLICT
  // ===================

  $.fn.slugger.noConflict = function () {
    $.fn.slugger = old;
    return this;
  };

  // SLUGGER DATA-API
  // ================

  $(document)
    .on('keyup.bui.slugger.data-api', '[data-toggle=slugger]', function () {
      $('[data-toggle=slugger]').each(function () {
        var $this = $(this);
        Plugin.call($this, { target: $($this.data('slugger-target')) });
      });
    })
    .on('change.bui.slugger.data-api', '[data-toggle=slugger]', function () {
      $(this).trigger('changed.bui.slugger');
    });

}(jQuery, window, document));
