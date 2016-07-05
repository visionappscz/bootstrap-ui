$(function () {
  'use strict';

  QUnit.module('confirmation plugin');

  QUnit.test('should be defined on jquery object', function () {
    QUnit.ok($(document.body).confirmation, 'confirmation method is defined');
  });

  QUnit.module('confirmation', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in
      // noConflict mode
      $.fn.buiConfirmation = $.fn.confirmation.noConflict();
    },

    teardown: function () {
      $(document).off('keyup.bui.confirmation');
      $('.modal').remove();
      $('.modal-backdrop').remove();
      $.fn.confirmation = $.fn.buiConfirmation;
      delete $.fn.buiConfirmation;
    },
  });

  // Plugin tests
  // ============
  QUnit.test('should provide no conflict', function () {
    QUnit.strictEqual(
      $.fn.confirmation,
      undefined,
      'confirmation was set back to undefined (original value)'
    );
  });

  QUnit.test('should return jquery collection containing the element', function () {
    var $el = $('<button/>');
    var $confirmation = $el.buiConfirmation();
    QUnit.ok($confirmation instanceof $, 'returns jquery collection');
    QUnit.strictEqual($confirmation[0], $el[0], 'collection contains element');
  });

  // Tests related to displaying the modal
  // =====================================
  QUnit.test('should fire the show.bui.confirmation event on displaying the modal', function () {
    QUnit.stop();
    var eventFired = false;

    $('<button/>')
      .on('show.bui.confirmation', function () {
        QUnit.ok($('.modal').is(':visible') === true, 'modal is visible');
        QUnit.ok(true, 'event fired');
        eventFired = true;
      })
      .buiConfirmation();

    setTimeout(function () {
      if (!eventFired) {
        QUnit.ok(false, 'event not fired');
      }

      QUnit.start();
    }, 100);
  });

  QUnit.test('should overload default messages with custom ones if provided', function () {
    $('<button/>').buiConfirmation({
      'confirm-message': 'Custom_message',
      'confirm-yes': 'Custom_yes',
      'confirm-no': 'Custom_no',
    });
    QUnit.strictEqual($('.modal-body').text(), 'Custom_message', 'the custom message was used');
    QUnit.strictEqual($(
      '.modal-footer button[data-confirmation=confirm]').text(),
      'Custom_yes',
      'the custom yes was used'
    );
    QUnit.strictEqual(
      $('.modal-footer button[data-confirmation=reject]').text(),
      'Custom_no',
      'the custom no was used'
    );
  });

  QUnit.test('should use default messages when no custom messages are provided', function () {
    $('<button/>').buiConfirmation();
    QUnit.strictEqual($('.modal-body').text(), 'Are you sure?', 'the default message was used');
    QUnit.strictEqual($(
      '.modal-footer button[data-confirmation=confirm]').text(),
      'Yes',
      'the default yes was used'
    );
    QUnit.strictEqual($(
      '.modal-footer button[data-confirmation=reject]').text(),
      'No',
      'the default no was used'
    );
  });

  // Tests for rejecting the confirmation
  // ====================================
  QUnit.test('should fire rejected.bui.confirmation on pressing escape', function () {
    QUnit.stop();
    var eventFired = false;

    $('<button/>')
      .on('rejected.bui.confirmation', function () {
        QUnit.ok(true, 'event fired');
        eventFired = true;
      })
      .buiConfirmation();

    $('.modal').trigger($.Event('keydown', { keyCode: 27 }));

    setTimeout(function () {
      if (!eventFired) {
        QUnit.ok(false, 'event not fired');
      }

      QUnit.start();
    }, 100);
  });

  QUnit.test('should fire rejected.bui.confirmation on pressing the reject button', function () {
    QUnit.stop();
    var eventFired = false;

    $('<button/>')
      .on('rejected.bui.confirmation', function () {
        QUnit.ok(true, 'event fired');
        eventFired = true;
      })
      .buiConfirmation();

    $('.modal button[data-confirmation=reject]').click();

    setTimeout(function () {
      if (!eventFired) {
        QUnit.ok(false, 'event not fired');
      }

      QUnit.start();
    }, 100);
  });

  QUnit.test('should destroy the confirmation modal when rejected.bui.confirmation was triggered',
    function () {
      QUnit.stop();
      var $el = $('<button/>').buiConfirmation();
      $el.on('rejected.bui.confirmation', function () {
        QUnit.ok($('.modal').length === 0, 'confirmation modal destroyed');
        QUnit.start();
      });

      $el.trigger('rejected.bui.confirmation');
    }
  );

  QUnit.test(
    'should execute the callback function with argument set to false when ' +
    'rejected.bui.confirmation was triggered',
    function () {
      QUnit.stop();
      var $el = $('<button/>').buiConfirmation({ callback: function (result) {
          QUnit.ok(result === false, 'executed the callback function');
          QUnit.start();
        }, });

      $el.trigger('rejected.bui.confirmation');
    }
  );

  // Tests for confirming the confirmation
  // =====================================
  QUnit.test('should fire confirmed.bui.confirmation on pressing enter', function () {
    QUnit.stop();
    var eventFired = false;

    $('<button/>')
      .on('confirmed.bui.confirmation', function () {
        QUnit.ok(true, 'event fired');
        eventFired = true;
      })
      .buiConfirmation();

    $('.modal').trigger($.Event('keydown', { keyCode: 13 }));

    setTimeout(function () {
      if (!eventFired) {
        QUnit.ok(false, 'event not fired');
      }

      QUnit.start();
    }, 100);
  });

  QUnit.test(
    'should fire confirmed.bui.confirmation confirmation on pressing the confirm button',
    function () {
      QUnit.stop();
      var eventFired = false;

      $('<button/>')
        .on('confirmed.bui.confirmation', function () {
          QUnit.ok(true, 'event fired');
          eventFired = true;
        })
        .buiConfirmation();

      $('.modal button[data-confirmation=confirm]').click();

      setTimeout(function () {
        if (!eventFired) {
          QUnit.ok(false, 'event not fired');
        }

        QUnit.start();
      }, 100);
    }
  );

  QUnit.test(
    'should destroy the confirmation modal when confirmed.bui.confirmation was triggered',
    function () {
      QUnit.stop();
      var $el = $('<button/>').buiConfirmation();

      $el.on('confirmed.bui.confirmation', function () {
        QUnit.ok($('.modal').length === 0, 'confirmation modal destroyed');
        QUnit.start();
      });

      $el.trigger('confirmed.bui.confirmation');
    }
  );

  QUnit.test(
    'should execute callback function with argument set to true when ' +
    'confirmed.bui.confirmation was triggered', function () {
    QUnit.stop();
    $('<button/>')
      .buiConfirmation({ callback: function (result) {
        QUnit.ok(result === true, 'executed the callback function');
        QUnit.start();
      }, })
      .trigger('confirmed.bui.confirmation');
  });

  // Data-api tests
  // ==============
  QUnit.test(
    'should populate the options object from the data attributes',
    function () {
      QUnit.stop();
      var $el = $(
        '<button data-toggle="confirm" data-confirm-message="Custom_message" ' +
        'data-confirm-yes="Custom_yes" data-confirm-no="Custom_no" />'
      );
      $('#qunit-fixture').append($el);
      $(document).on('show.bui.confirmation', 'button[data-toggle=confirm]', function () {
        $(document).off('show.bui.confirmation');
        QUnit.strictEqual($('.modal-body').text(), 'Custom_message', 'the custom message was used');
        QUnit.strictEqual(
          $('.modal-footer button[data-confirmation=confirm]').text(),
          'Custom_yes',
          'the custom yes was used'
        );
        QUnit.strictEqual(
          $('.modal-footer button[data-confirmation=reject]').text(),
          'Custom_no',
          'the custom no was used'
        );
        QUnit.start();
      });

      $el.trigger('click.bui.confirmation.data-api');
    }
  );

  QUnit.test(
    'should prevent default action when click.bui.confirmation.data-api triggered with no ' +
    'argument ',
    function () {
      QUnit.stop();
      var $el = $('<span><button type="submit" data-toggle="confirm"/></span>');
      $('#qunit-fixture').append($el);
      $(document).on(
        'click.bui.confirmation.data-api.test', 'button[data-toggle=confirm]',
        function (e) {
          $(document).off('click.bui.confirmation.data-api.test');
          if (e.isDefaultPrevented()) {
            QUnit.ok(true, 'default action prevented');
          } else {
            QUnit.ok(false, 'default action not prevented');
          }

          QUnit.start();
        }
      );

      $el.find('button').trigger('click.bui.confirmation.data-api');
    }
  );

  QUnit.test(
    'should show confirmation modal when click.bui.confirmation.data-api triggered with no ' +
    'argument',
    function () {
      QUnit.stop();
      var $el = $('<span><button type="submit" data-toggle="confirm"/></span>');
      $('#qunit-fixture').append($el);
      $(document).on('show.bui.confirmation', 'button[data-toggle=confirm]', function () {
        $(document).off('show.bui.confirmation');
        QUnit.ok($('.modal').length > 0, 'confirmation modal not shown');
        QUnit.start();
      });

      $el.find('button').trigger('click.bui.confirmation.data-api');
    }
  );

  QUnit.test(
    'should not prevent default action when click.bui.confirmation.data-api triggered with ' +
    'argument noConfirm=true ',
    function () {
      QUnit.stop();
      var $el = $('<span><button type="submit" data-toggle="confirm"/></span>');
      $('#qunit-fixture').append($el);
      $(document).on('click.bui.confirmation.data-api.test', function (e) {
        $(document).off('click.bui.confirmation.data-api.test');
        if (!e.isDefaultPrevented()) {
          QUnit.ok(true, 'default action not prevented');
        } else {
          QUnit.ok(false, 'default action prevented');
        }

        QUnit.start();
      });

      $el.find('button').trigger('click.bui.confirmation.data-api', true);
    }
  );
});
