(function($) {
  'use strict';

  // CONFIRMATION CLASS DEFINITION
  // =============================

  var Confirmation = function($triggerEl, callback, message, yes, no) {
    message = message !== null ? message : this.defaults['confirm-message'];
    yes = yes !== null ? yes : this.defaults['confirm-yes'];
    no = no !== null ? no : this.defaults['confirm-no'];
    callback = callback !== null ? callback : this.defaults.callback;
    this.modal = this.getModal(message, yes, no);
    this.$triggerEl = $triggerEl;
    this.callback = callback;
  };

  Confirmation.prototype.defaults = {
    'confirm-message': 'Are you sure?',
    'confirm-yes': 'Yes',
    'confirm-no': 'No',
    'callback': function() {} // Having empty callback is useless, it is here as a sane fallback for tests
  };

  Confirmation.prototype.showConfirmation = function() {
    var $triggerEl = this.$triggerEl;
    var callback = this.callback;
    var $modal = this.modal.modal({
      keboard: false,
      backdrop: 'static'
    });

    $triggerEl.trigger('show.sui.confirmation');
    $triggerEl.on('rejected.sui.confirmation', function() {
      callback(false);
    });
    $triggerEl.on('confirmed.sui.confirmation', function() {
      callback(true);
    });
    $triggerEl.on('rejected.sui.confirmation confirmed.sui.confirmation', function() {
      $modal.on('hidden.bs.modal', function() {
        $(this).remove();
      });
      // The fade class is removed before hiding the modal to prevent the backdrop from staying behond
      // Thats why there is no animation :(
      // http://stackoverflow.com/questions/22056147/bootstrap-modal-backdrop-remaining
      $modal.removeClass('fade').modal('hide');
      $triggerEl.off('rejected.sui.confirmation confirmed.sui.confirmation');
    });

    $modal.on('keydown.sui.confirmation', function(e) {
      if (e.keyCode === 27) { //escape
        $triggerEl.trigger('rejected.sui.confirmation');
      }
      else if (e.keyCode === 13) { //enter
        $triggerEl.trigger('confirmed.sui.confirmation');
      }
    });
    $modal
      .find('[data-confirmation=reject]')
      .on('click.sui.confirmation', function() {
        $triggerEl.trigger('rejected.sui.confirmation');
      });
    $modal
      .find('[data-confirmation=confirm]')
      .on('click.sui.confirmation', function() {
        $triggerEl.trigger('confirmed.sui.confirmation');
      });
  };

  Confirmation.prototype.getModal = function(message, yes, no) {
    var footer = $('<div class="modal-footer"></div>')
      .append('<button type="button" class="btn btn-default" data-confirmation="reject">' + no + '</button>')
      .append('<button type="button" class="btn btn-primary" data-confirmation="confirm">' + yes + '</button>');
    var modal = $('<div class="modal fade" tabindex="-1"></div>');
    var dialog = $('<div class="modal-dialog modal-sm"></div>');
    var content = $('<div class="modal-content"></div>')
      .append('<div class="modal-body">' + message + '</div>')
      .append(footer);
    modal.append(dialog.append(content));

    return modal;
  };


  // CONFIRMATION PLUGIN DEFINITION
  // ==============================

  function Plugin(options) {
    var $element, data;
    var message = options && ('confirm-message' in options) && options['confirm-message'] ? options['confirm-message'] : null;
    var yes = options && ('confirm-yes' in options) && options['confirm-yes'] ? options['confirm-yes'] : null;
    var no = options && ('confirm-no' in options) && options['confirm-no'] ? options['confirm-no'] : null;
    var callback = options && ('callback' in options) && options.callback ? options.callback : null;

    return this.each(function() {
      $element = $(this);

      data = $element.data('sui.confirmation');
      if (!data) {
        $element.data('sui.confirmation', (data = new Confirmation($element, callback, message, yes, no)));
      }

      data.showConfirmation();
    });
  }

  var old = $.fn.confirmation;

  $.fn.confirmation = Plugin;
  $.fn.confirmation.Constructor = Confirmation;


  // CONFIRMATION NO CONFLICT
  // ========================

  $.fn.confirmation.noConflict = function() {
    $.fn.confirmation = old;
    return this;
  };


  // CONFIRMATION DATA-API
  // =====================

  $(document).on('click.sui.confirmation.data-api', '[data-toggle=confirm]', function(e, noConfirm) {
    if (!noConfirm) {
      var $clickedEl = $(e.target);
      Plugin.call($clickedEl, {
        'confirm-message': $clickedEl.data('confirm-message'),
        'confirm-yes': $clickedEl.data('confirm-yes'),
        'confirm-no': $clickedEl.data('confirm-no'),
        'callback': function(result) {
          if (result) {
            $clickedEl.trigger('click.sui.confirmation.data-api', true);
          }
        }
      });
      e.preventDefault();
    }
  });

}(jQuery));
