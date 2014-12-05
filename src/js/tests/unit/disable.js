$(function() {
  'use strict';

  module('disable plugin');

  test('should be defined on jquery object', function() {
    ok($(document.body).disable, 'disable method is defined');
  });



  module('disable', {
    setup: function() {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.suiDisable = $.fn.disable.noConflict();
    },
    teardown: function() {
      $.fn.disable = $.fn.suiDisable;
      delete $.fn.suiDisable;
    }
  });

  //////////////////
  // Plugin tests //
  //////////////////
  test('should provide no conflict', function() {
    strictEqual($.fn.disable, undefined, 'disable was set back to undefined (original value)');
  });

  test('should return jquery collection containing the element', function() {
    var $el = $('<input type="checkbox" />');
    var $disable = $el.suiDisable();
    ok($disable instanceof $, 'returns jquery collection');
    strictEqual($disable[0], $el[0], 'collection contains element');
  });

  /////////////////////////
  // Disable related tests //
  /////////////////////////
  test('should fire toggle.sui.disable when disable("toggle") function is called', function() {
    stop();
    var eventFired = false;
    var $el = $('<input type="text" />');

    $(document).on('toggle.sui.disable', function() {
      ok(true, 'event fired');
      eventFired = true;
    });

    $el.suiDisable('toggle');

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'event not fired');
      }
      $(document).off('toggle.sui.disable');
      start();
    }, 100);
  });

  test('should fire toggled.sui.disable when disable("toggle") function is finished', function() {
    stop();
    var eventFired = false;
    var $el = $('<input type="text" />');

    $(document).on('toggled.sui.disable', function() {
      ok($el.prop('disabled'), 'element is disabled');
      ok(true, 'event fired');
      eventFired = true;
    });

    $el.suiDisable('toggle');

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'event not fired');
      }
      $(document).off('toggled.sui.disable');
      start();
    }, 100);
  });

  test('should enable element if it is already disabled', function() {
    stop();
    var $el = $('<input type="text" />');

    $(document).on('toggled.sui.disable', function() {
      $(document).off('toggled.sui.disable');
      ok($el.prop('disabled'), 'element is disabled');
      stop();

      $(document).on('toggled.sui.disable', function() {
        $(document).off('toggled.sui.disable');
        ok(!$el.prop('disabled'), 'element is not disabled');
        start();
      });
      start();
    });

    $el.suiDisable('toggle').suiDisable('toggle');
  });

  ////////////////////////////
  // Data-api related tests //
  ////////////////////////////
  test('should disable element by change event on control element', function() {
    stop();

    // Two control elements are defined to ensue that the second one doesnt interfere
    $('#qunit-fixture').html('<input type=text id="input_1" />' +
      '<input type="checkbox" id="control" data-toggle="disable" data-disable-target="#input_1" />' +
      '<input type=text id="input_2" />' +
      '<input type="checkbox" data-toggle="disable" data-disable-target="#input_2" />');

    $(document).on('toggled.sui.disable', function() {
      ok($('#qunit-fixture #input_1').prop('disabled'), 'element input_1 is disabled');
      ok(!$('#qunit-fixture #input_2').prop('disabled'), 'element input_2 is not disabled');
    });

    $(window).trigger('load');
    $('#control').prop('checked', true).change();

    setTimeout(function() {
      $(document).off('toggled.sui.disable');
      start();
    }, 100);
  });

  test('should disable and enable element by custom event type on an element', function() {
    stop();

    // Two control elements are defined to ensue that the second one doesnt interfere
    $('#qunit-fixture').html('<input type=text id="input_1" />' +
      '<button id="control" data-toggle="disable" data-disable-target="#input_1" data-disable-event="click" />' +
      '<input type=text id="input_2" />' +
      '<button type="checkbox" data-toggle="disable" data-disable-target="#input_2" data-disable-event="click" />');

    $(document).on('toggled.sui.disable', function() {
      ok($('#qunit-fixture #input_1').prop('disabled'), 'element input_1 is disabled');
      ok(!$('#qunit-fixture #input_2').prop('disabled'), 'element input_2 is not disabled');
    });

    $(window).trigger('load');
    $('#control').click();

    setTimeout(function() {
      $(document).off('toggled.sui.disable');
      start();
    }, 100);
  });

});
