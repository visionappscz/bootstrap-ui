$(function () {
  'use strict';

  QUnit.module('datetimepicker-loader', {
    setup: function () {
      jQuery.fn.datetimepicker = function () {};

      moment.localeOrig = moment.locale;
      moment.locale = function () {};
    },

    teardown: function () {
      moment.locale = moment.localeOrig;
      $('html').attr('lang', null);
      delete moment.localeOrig;
      delete jQuery.fn.datetimepicker;

    },
  });

  // Only Data API tests are needed as the rest of the functionality is provided by the
  // datetimepicker component

  // Data-api tests
  // ======================
  QUnit.test(
    'should init datetimepicker with default config on page load',
    function () {
      var $input = $('<input type="text" data-onload-datetimepicker />');
      $('#qunit-fixture').append($input);

      sinon.spy(jQuery.fn, 'datetimepicker');
      sinon.stub(moment, 'locale').withArgs().returns('fake-locale');
      $(window).trigger('load');

      QUnit.ok(jQuery.fn.datetimepicker.calledOnce, 'Should init the datetimepicker');
      QUnit.ok(
        jQuery.fn.datetimepicker.calledWith({
          allowInputToggle: true,
          sideBySide: true,
          locale: 'fake-locale',
        }),
        'Should init the datetimepicker with default config'
      );
    }
  );

  QUnit.test('should init datetimepicker with some config option on page load',
    function () {
      var $input = $(
        '<input type="text" data-onload-datetimepicker=\'{"option": "optionValue"}\' />'
      );
      $('#qunit-fixture').append($input);

      sinon.spy(jQuery.fn, 'datetimepicker');
      sinon.stub(moment, 'locale').withArgs().returns('fake-locale');
      $(window).trigger('load');

      QUnit.ok(jQuery.fn.datetimepicker.calledOnce, 'Should init the datetimepicker');
      QUnit.ok(
        jQuery.fn.datetimepicker.calledWith({
          option: 'optionValue',
          allowInputToggle: true,
          sideBySide: true,
          locale: 'fake-locale',
        }),
        'Should init the datetimepicker with specified config object'
      );
    }
  );

  QUnit.test('should init datetimepicker with locale', function () {
    var $input = $('<input type="text" data-onload-datetimepicker />');

    $('html').attr('lang', 'cs');
    $('#qunit-fixture').append($input);
    sinon.spy(jQuery.fn, 'datetimepicker');
    sinon.stub(moment, 'locale').withArgs('cs').returns('fake-locale');
    $(window).trigger('load');

    QUnit.ok(jQuery.fn.datetimepicker.calledOnce, 'Should init the datetimepicker');
    QUnit.ok(
      jQuery.fn.datetimepicker.calledWith({
        locale: 'fake-locale',
        allowInputToggle: true,
        sideBySide: true,
      }),
      'Should init the datetimepicker with locale set'
    );
  });

});
