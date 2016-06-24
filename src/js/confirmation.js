;(function ($, window, document) {
  'use strict';

  // CONFIRMATION CLASS DEFINITION
  // =============================

  var Confirmation = function ($triggerEl, options) {
    options = $.extend({}, this.options, options);
    this.modal = this.getModal(
        options['confirm-message'],
        options['confirm-yes'],
        options['confirm-no']
    );
    this.$triggerEl = $triggerEl;
    this.callback = options.callback;
  };

  Confirmation.prototype.options = {
    'confirm-message': 'Are you sure?',
    'confirm-yes': 'Yes',
    'confirm-no': 'No',
    callback: function () {}, // Having empty callback is useless, it is here as a sane fallback for
    // tests
  };

  Confirmation.prototype.showConfirmation = function () {
    var $triggerEl = this.$triggerEl;
    var callback = this.callback;
    var $modal = this.modal.modal({
      keboard: false,
      backdrop: 'static',
    });

    $triggerEl.trigger('show.bui.confirmation');
    $triggerEl.on('rejected.bui.confirmation', function () {
      callback(false);
    });

    $triggerEl.on('confirmed.bui.confirmation', function () {
      callback(true);
    });

    $triggerEl.on('rejected.bui.confirmation confirmed.bui.confirmation', function () {
      $modal.on('hidden.bs.modal', function () {
        $(this).remove();
      });

      // The fade class is removed before hiding the modal to prevent the backdrop from staying
      // behond
      // Thats why there is no animation :(
      // http://stackoverflow.com/questions/22056147/bootstrap-modal-backdrop-remaining
      $modal.removeClass('fade').modal('hide');
      $triggerEl.off('rejected.bui.confirmation confirmed.bui.confirmation');
    });

    $modal.on('keydown.bui.confirmation', function (e) {
      if (e.keyCode === 27) { //escape
        $triggerEl.trigger('rejected.bui.confirmation');
      } else if (e.keyCode === 13) { //enter
        $triggerEl.trigger('confirmed.bui.confirmation');
      }
    });

    $modal
      .find('[data-confirmation=reject]')
      .on('click.bui.confirmation', function () {
        $triggerEl.trigger('rejected.bui.confirmation');
      });

    $modal
      .find('[data-confirmation=confirm]')
      .on('click.bui.confirmation', function () {
        $triggerEl.trigger('confirmed.bui.confirmation');
      });
  };

  Confirmation.prototype.getModal = function (message, yes, no) {
    return $('<div class="modal fade" tabindex="-1">' +
      '<div class="modal-dialog modal-sm">' +
      '<div class="modal-content">' +
      '<div class="modal-body">' + message + '</div>' +
      '<div class="modal-footer">' +
      '<button type="button" class="btn btn-default" data-confirmation="reject">' + no +
      '</button>' + '<button type="button" class="btn btn-primary" data-confirmation="confirm">' +
      yes + '</button></div></div></div></div>');
  };

  // CONFIRMATION PLUGIN DEFINITION
  // ==============================

  function Plugin(options) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bui.confirmation');

      if (!data) {
        data = new Confirmation($this, options);
        $this.data('bui.confirmation', data);
      }

      data.showConfirmation();
    });
  }

  var old = $.fn.confirmation;

  $.fn.confirmation = Plugin;
  $.fn.confirmation.Constructor = Confirmation;

  // CONFIRMATION NO CONFLICT
  // ========================
  $.fn.confirmation.noConflict = function () {
    $.fn.confirmation = old;
    return this;
  };

  // CONFIRMATION DATA-API
  // =====================

  $(document).on('click.bui.confirmation.data-api', '[data-toggle=confirm]',
    function (e, noConfirm) {
      var $this = $(this);

      if (!noConfirm) {
        e.preventDefault();

        Plugin.call($this, {
          'confirm-message': $this.data('confirm-message'),
          'confirm-yes': $this.data('confirm-yes'),
          'confirm-no': $this.data('confirm-no'),
          callback: function (result) {
            if (result) {
              $this.trigger('click.bui.confirmation.data-api', true);
            }
          },
        });
      }
    }
  );

}(jQuery, window, document));
