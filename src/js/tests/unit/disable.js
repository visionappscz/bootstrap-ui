$(function () {
  'use strict';

  QUnit.module('disable plugin');

  QUnit.test('should be defined on jquery object', function () {
    QUnit.ok($(document.body).disable, 'disable method is defined');
  });

  QUnit.module('disable', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in
      // noConflict mode
      $.fn.buiDisable = $.fn.disable.noConflict();
    },

    teardown: function () {
      $.fn.disable = $.fn.buiDisable;
      delete $.fn.buiDisable;
    },
  });

  // Plugin tests
  // ============
  QUnit.test('should provide no conflict', function () {
    QUnit.strictEqual(
      $.fn.disable,
      undefined,
      'disable was set back to undefined (original value)'
    );
  });

  QUnit.test('should return jquery collection containing the element', function () {
    var $el = $('<input type="checkbox" />');
    var $disable = $el.buiDisable();
    QUnit.ok($disable instanceof $, 'returns jquery collection');
    QUnit.strictEqual($disable[0], $el[0], 'collection contains element');
  });

  // Disabling elements tests
  // ========================
  QUnit.test(
    'should fire toggle.bui.disable when disable("toggle") function is called',
    function () {
      QUnit.stop();
      var eventFired = false;
      var $el = $('<input type="text" />');

      $(document).on('toggle.bui.disable', function () {
        QUnit.ok(true, 'event fired');
        eventFired = true;
      });

      $el.buiDisable('toggle');

      setTimeout(function () {
        if (!eventFired) {
          QUnit.ok(false, 'event not fired');
        }

        $(document).off('toggle.bui.disable');
        QUnit.start();
      }, 100);
    }
  );

  QUnit.test(
    'should fire toggled.bui.disable when disable("toggle") function is finished',
    function () {
      QUnit.stop();
      var eventFired = false;
      var $el = $('<input type="text" />');

      $(document).on('toggled.bui.disable', function () {
        QUnit.ok($el.prop('disabled'), 'element is disabled');
        QUnit.ok(true, 'event fired');
        eventFired = true;
      });

      $el.buiDisable('toggle');

      setTimeout(function () {
        if (!eventFired) {
          QUnit.ok(false, 'event not fired');
        }

        $(document).off('toggled.bui.disable');
        QUnit.start();
      }, 100);
    }
  );

  QUnit.test('should enable element if it is already disabled', function () {
    QUnit.stop();
    var $el = $('<input type="text" />');

    $(document).on('toggled.bui.disable', function () {
      $(document).off('toggled.bui.disable');
      QUnit.ok($el.prop('disabled'), 'element is disabled');
      QUnit.stop();

      $(document).on('toggled.bui.disable', function () {
        $(document).off('toggled.bui.disable');
        QUnit.ok(!$el.prop('disabled'), 'element is not disabled');
        QUnit.start();
      });

      QUnit.start();
    });

    $el.buiDisable('toggle').buiDisable('toggle');
  });

  // Data-api tests
  // ==============
  QUnit.test('should disable element by change event on control element', function () {
    QUnit.stop();

    // Two control elements are defined to ensue that the second one does not interfere
    $('#qunit-fixture').html('<input type=text id="input_1" />' +
      '<input type="checkbox" id="control" data-toggle="disable" ' +
      'data-disable-target="#input_1" /><input type=text id="input_2" />' +
      '<input type="checkbox" data-toggle="disable" data-disable-target="#input_2" />');

    $(document).on('toggled.bui.disable', function () {
      QUnit.ok($('#qunit-fixture #input_1').prop('disabled'), 'element input_1 is disabled');
      QUnit.ok(!$('#qunit-fixture #input_2').prop('disabled'), 'element input_2 is not disabled');
    });

    $(window).trigger('load');
    $('#control').prop('checked', true).change();

    setTimeout(function () {
      $(document).off('toggled.bui.disable');
      QUnit.start();
    }, 100);
  });

  QUnit.test('should disable and enable element by custom event type on an element', function () {
    QUnit.stop();

    // Two control elements are defined to ensure that the second one does not interfere
    $('#qunit-fixture').html('<input type=text id="input_1" />' +
      '<button id="control" data-toggle="disable" data-disable-target="#input_1" ' +
      'data-disable-event="click" /><input type=text id="input_2" />' +
      '<button type="checkbox" data-toggle="disable" data-disable-target="#input_2" ' +
      'data-disable-event="click" />');

    $(document).on('toggled.bui.disable', function () {
      QUnit.ok($('#qunit-fixture #input_1').prop('disabled'), 'element input_1 is disabled');
      QUnit.ok(!$('#qunit-fixture #input_2').prop('disabled'), 'element input_2 is not disabled');
    });

    $(window).trigger('load');
    $('#control').click();

    setTimeout(function () {
      $(document).off('toggled.bui.disable');
      QUnit.start();
    }, 100);
  });

});
