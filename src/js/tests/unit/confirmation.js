$(function() {
  'use strict';

  module('confirmation plugin');

  test('should be defined on jquery object', function() {
    ok($(document.body).confirmation, 'confirmation method is defined');
  });



  module('confirmation', {
    setup: function() {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.suiConfirmation = $.fn.confirmation.noConflict();
    },
    teardown: function() {
      $(document).off('keyup.sui.confirmation');
      $('.modal').remove();
      $('.modal-backdrop').remove();
      $.fn.confirmation = $.fn.suiConfirmation;
      delete $.fn.suiConfirmation;
    }
  });

  //////////////////
  // Plugin tests //
  //////////////////
  test('should provide no conflict', function() {
    strictEqual($.fn.confirmation, undefined, 'confirmation was set back to undefined (original value)');
  });

  test('should return jquery collection containing the element', function() {
    var $el = $('<button/>');
    var $confirmation = $el.suiConfirmation();
    ok($confirmation instanceof $, 'returns jquery collection');
    strictEqual($confirmation[0], $el[0], 'collection contains element');
  });

  ///////////////////////////////////////////
  // Tests related to displaying the modal //
  ///////////////////////////////////////////
  test('should fire the show.sui.confirmation event on displaying the modal', function() {
    stop();
    var eventFired = false;

    $('<button/>')
      .on('show.sui.confirmation', function() {
        ok($('.modal').is(':visible') === true, 'modal is visible');
        ok(true, 'event fired');
        eventFired = true;
      })
      .suiConfirmation();

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'event not fired');
      }
      start();
    }, 100);
  });

  test('should overload default messages with custom ones if provided', function() {
    $('<button/>').suiConfirmation({
      'confirm-message': 'Custom_message',
      'confirm-yes': 'Custom_yes',
      'confirm-no': 'Custom_no',
    });
    strictEqual($('.modal-body').text(), 'Custom_message', 'the custom message was used');
    strictEqual($('.modal-footer button[data-confirmation=confirm]').text(), 'Custom_yes', 'the custom yes was used');
    strictEqual($('.modal-footer button[data-confirmation=reject]').text(), 'Custom_no', 'the custom no was used');
  });

  test('should use default messages when no custom messages are provided', function() {
    $('<button/>').suiConfirmation();
    strictEqual($('.modal-body').text(), 'Are you sure?', 'the default message was used');
    strictEqual($('.modal-footer button[data-confirmation=confirm]').text(), 'Yes', 'the default yes was used');
    strictEqual($('.modal-footer button[data-confirmation=reject]').text(), 'No', 'the default no was used');
  });

  //////////////////////////////////////////
  // Tests for rejecting the confirmation //
  //////////////////////////////////////////
  test('should fire rejected.sui.confirmation on pressing escape', function() {
    stop();
    var eventFired = false;

    $('<button/>')
      .on('rejected.sui.confirmation', function() {
        ok(true, 'event fired');
        eventFired = true;
      })
      .suiConfirmation();

    $('.modal').trigger($.Event('keydown', { keyCode: 27}));

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'event not fired');
      }
      start();
    }, 100);
  });

  test('should fire rejected.sui.confirmation on pressing the reject button', function() {
    stop();
    var eventFired = false;

    $('<button/>')
      .on('rejected.sui.confirmation', function() {
        ok(true, 'event fired');
        eventFired = true;
      })
      .suiConfirmation();

    $('.modal button[data-confirmation=reject]').click();

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'event not fired');
      }
      start();
    }, 100);
  });

  test('should destroy the confirmation modal when rejected.sui.confirmation was triggered', function() {
    stop();
    var $el = $('<button/>').suiConfirmation();
    $el.on('rejected.sui.confirmation', function() {
      ok($('.modal').length === 0, 'confirmation modal destroyed');
      start();
    });
    $el.trigger('rejected.sui.confirmation');
  });

  test('should execute the callback function with argument set to false when rejected.sui.confirmation was triggered', function() {
    stop();
    var $el = $('<button/>').suiConfirmation({'callback': function(result) {
      ok(result === false, 'executed the callback function');
      start();
    }});
    $el.trigger('rejected.sui.confirmation');
  });

  //////////////////////////////////////////////////
  // Tests related to confirming the confirmation //
  //////////////////////////////////////////////////
  test('should fire confirmed.sui.confirmation on pressing enter', function() {
    stop();
    var eventFired = false;

    $('<button/>')
      .on('confirmed.sui.confirmation', function() {
        ok(true, 'event fired');
        eventFired = true;
      })
      .suiConfirmation();

    $('.modal').trigger($.Event('keydown', { keyCode: 13}));

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'event not fired');
      }
      start();
    }, 100);
  });

  test('should fire confirmed.sui.confirmation confirmation on pressing the confirm button', function() {
    stop();
    var eventFired = false;

    $('<button/>')
      .on('confirmed.sui.confirmation', function() {
        ok(true, 'event fired');
        eventFired = true;
      })
      .suiConfirmation();

    $('.modal button[data-confirmation=confirm]').click();

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'event not fired');
      }
      start();
    }, 100);
  });

  test('should destroy the confirmation modal when confirmed.sui.confirmation was triggered', function() {
    stop();
    var $el = $('<button/>').suiConfirmation();
    $el.on('confirmed.sui.confirmation', function() {
      ok($('.modal').length === 0, 'confirmation modal destroyed');
      start();
    });
    $el.trigger('confirmed.sui.confirmation');
  });

  test('should execute callback function with argument set to true when confirmed.sui.confirmation was triggered', function() {
    stop();
    $('<button/>')
      .suiConfirmation({'callback': function(result) {
        ok(result === true, 'executed the callback function');
        start();
      }})
      .trigger('confirmed.sui.confirmation');
  });


  ////////////////////////////
  // Data-api related tests //
  ////////////////////////////
  test('should populate the options object from the data attributes', function() {
    stop();
    var $el = $('<button data-toggle="confirm" data-confirm-message="Custom_message" data-confirm-yes="Custom_yes" data-confirm-no="Custom_no" />');
    $('#qunit-fixture').append($el);
    $(document).on('show.sui.confirmation', 'button[data-toggle=confirm]', function() {
      $(document).off('show.sui.confirmation');
      strictEqual($('.modal-body').text(), 'Custom_message', 'the custom message was used');
      strictEqual($('.modal-footer button[data-confirmation=confirm]').text(), 'Custom_yes', 'the custom yes was used');
      strictEqual($('.modal-footer button[data-confirmation=reject]').text(), 'Custom_no', 'the custom no was used');
      start();
    });
    $el.trigger('click.sui.confirmation.data-api');
  });

  test('should prevent default action when click.sui.confirmation.data-api triggered with no argument ', function() {
    stop();
    var $el = $('<span><button type="submit" data-toggle="confirm"/></span>');
    $('#qunit-fixture').append($el);
    $(document).on('click.sui.confirmation.data-api.test', 'button[data-toggle=confirm]', function(e) {
      $(document).off('click.sui.confirmation.data-api.test');
      if (e.isDefaultPrevented()) {
        ok(true, 'default action prevented');
      }
      else {
        ok(false, 'default action not prevented');
      }
      start();
    });
    $el.find('button').trigger('click.sui.confirmation.data-api');
  });

  test('should show confirmation modal when click.sui.confirmation.data-api triggered with no argument', function() {
    stop();
    var $el = $('<span><button type="submit" data-toggle="confirm"/></span>');
    $('#qunit-fixture').append($el);
    $(document).on('show.sui.confirmation', 'button[data-toggle=confirm]', function() {
      $(document).off('show.sui.confirmation');
      ok($('.modal').length > 0, 'confirmation modal not shown');
      start();
    });
    $el.find('button').trigger('click.sui.confirmation.data-api');
  });

  test('should not prevent default action when click.sui.confirmation.data-api triggered with argument noConfirm=true ', function() {
    stop();
    var $el = $('<span><button type="submit" data-toggle="confirm"/></span>');
    $('#qunit-fixture').append($el);
    $(document).on('click.sui.confirmation.data-api.test', function(e) {
      $(document).off('click.sui.confirmation.data-api.test');
      if (!e.isDefaultPrevented()) {
        ok(true, 'default action not prevented');
      }
      else {
        ok(false, 'default action prevented');
      }
      start();
    });
    $el.find('button').trigger('click.sui.confirmation.data-api', true);
  });
});
