$(function() {
  'use strict';

  QUnit.module('datetimepicker-loader', {
    setup: function() {
      jQuery.fn.datetimepicker = function() {};
    },

    teardown: function() {
      delete jQuery.fn.datetimepicker;
    }
  });

  // Only Data API tests are needed as the rest of the functionality is provided by the datetimepicker component

  // Data-api tests
  // ======================
  QUnit.test('should init datetimepicker with default config on the html element on page load', function() {
    var $input = $('<input type="text" data-onload-datetimepicker />');
    $('#qunit-fixture').append($input);

    sinon.spy(jQuery.fn, 'datetimepicker');
    $(window).trigger('load');

    QUnit.ok(jQuery.fn.datetimepicker.calledOnce, 'Should init the datetimepicker');
    QUnit.ok(jQuery.fn.datetimepicker.calledWith({allowInputToggle: true, sideBySide: true}), 'Should init the datetimepicker with default config');
  });

  QUnit.test('should init datetimepicker with some config option on the html element on page load', function() {
    var $input = $('<input type="text" data-onload-datetimepicker=\'{"option": "optionValue"}\' />');
    $('#qunit-fixture').append($input);

    sinon.spy(jQuery.fn, 'datetimepicker');
    $(window).trigger('load');

    QUnit.ok(jQuery.fn.datetimepicker.calledOnce, 'Should init the datetimepicker');
    QUnit.ok(
      jQuery.fn.datetimepicker.calledWith({option: 'optionValue', allowInputToggle: true, sideBySide: true}),
      'Should init the datetimepicker with specified config object'
    );
  });
});
