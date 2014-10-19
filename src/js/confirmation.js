// Prevent jshinf from raising the "Expected an assignment or function call and instead saw an expression" warning
// jshint -W030

+function ($) {
  'use strict';

  // CONFIRMATION CLASS DEFINITION
  // =============================
  //
  var Confirmation = function ($clickedEl, options) {
    this.$clickedEl = $clickedEl;

    var message = (!options || !('confirm-message' in options) || !options['confirm-message']) ? this.defaults['confirm-message'] : options['confirm-message'];
    var yes = (!options || !('confirm-yes' in options) || !options['confirm-yes']) ? this.defaults['confirm-yes'] : options['confirm-yes'];
    var no = (!options || !('confirm-no' in options) || !options['confirm-no']) ? this.defaults['confirm-no'] : options['confirm-no'];
    this.modal = this.getModal(message, yes, no);
  };

  Confirmation.prototype.defaults = {
    'confirm-message': 'Are you sure?',
    'confirm-yes': 'Yes',
    'confirm-no': 'No'
  };

  Confirmation.prototype.prompt = function () {
    var $clickedEl = this.$clickedEl;

    var $modal = this.modal.modal({
      keboard: false,
      backdrop: 'static'
    });
    $clickedEl.trigger('show.sui.confirmation');

    var confirmedFunc = function (event) {
      $(document).off('keyup.sui.confirmation');
      $modal.modal('hide');
      $clickedEl.trigger('confirmed.sui.confirmation');
      return true;
    };

    var rejectedFunc = function (event) {
      $(document).off('keyup.sui.confirmation');
      $modal.modal('hide');
      $clickedEl.trigger('rejected.sui.confirmation');
      return false;
    };

    $(document).on('keyup.sui.confirmation', function (event) {
      if (event.keyCode === 27) { //escape
        rejectedFunc();
      }
      else if (event.keyCode === 13) { //enter
        confirmedFunc();
      }
    });

    $modal
      .find('[data-confirmation=reject]')
      .on('click.sui.confirmation', function(event) {
        return rejectedFunc();
      });
    $modal
      .find('[data-confirmation=confirm]')
      .on('click.sui.confirmation', function(event) {
        return confirmedFunc();
      });
  };

  Confirmation.prototype.getModal = function (message, yes, no) {
    var footer = $('<div class="modal-footer"></div>')
      .append('<button type="button" class="btn btn-default" data-confirmation="reject">' + no + '</button>')
      .append('<button type="button" class="btn btn-primary" data-confirmation="confirm">' + yes + '</button>');

    var modal = $('<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"></div>');
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
    var $this = $(this);

    var data = $this.data('sui.confirmation');
    if (!data) {
      $this.data('sui.confirmation', (data = new Confirmation($this, options)));
    }

    data.prompt();
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

  $(document).on('click.sui.confirmation.data-api', '[data-toggle=confirm]', function(e) {
    var $clickedEl = $(e.currentTarget);
    Plugin.call($clickedEl, {
      'confirm-message': $clickedEl.data('confirm-message'),
      'confirm-yes': $clickedEl.data('confirm-yes'),
      'confirm-no': $clickedEl.data('confirm-no')
    });
  });

}(jQuery);
