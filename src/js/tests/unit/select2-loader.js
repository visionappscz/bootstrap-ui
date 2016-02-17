$(function () {
  'use strict';

  QUnit.module('select2-loader', {
    setup: function () {
      jQuery.fn.select2 = function () {};
    },

    teardown: function () {
      delete jQuery.fn.select2;
    },
  });

  // Only Data API tests are needed as the rest of the functionality is provided by the select2 component itself

  // Data-api tests
  // ======================
  QUnit.test('should call the select2() method on the select element on page load with json attribute', function () {
    var $select = $('<select data-onload-select2=\'{"option": "optionValue"}\'>Some text</select>');

    $('#qunit-fixture').append($select);
    sinon.spy(jQuery.fn, 'select2');
    $(window).trigger('load');

    QUnit.ok(jQuery.fn.select2.calledOnce, 'Should init the select2 component');
    QUnit.ok(
      jQuery.fn.select2.calledWith({ option: 'optionValue' }),
      'Should init the select2 component with proper custom config file specified'
    );
  });

  QUnit.test('should call the ckeditor() method on the textarea on page load with no attribute', function () {
    var $select = $('<select data-onload-select2="">Some text</select>');

    $('#qunit-fixture').append($select);
    sinon.spy(jQuery.fn, 'select2');
    $(window).trigger('load');

    QUnit.ok(jQuery.fn.select2.calledOnce, 'Should init the select2 component');
    QUnit.ok(jQuery.fn.select2.calledWith({}), 'Should init the ckeditor with no arguments');
  });
});
