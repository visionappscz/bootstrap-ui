$(function () {
  'use strict';
  describe('Datetime picker loader plugin', function () {

    beforeEach(function () {
      jQuery.fn.datetimepicker = function () {
      };

      moment.localeOrig = moment.locale;
      moment.locale = function () {
      };
    });

    afterEach(function () {
      moment.locale = moment.localeOrig;
      $('html').attr('lang', null);
      delete moment.localeOrig;
      delete jQuery.fn.datetimepicker;
      mocha.clearFixture();
    });

    // Only Data API tests are needed as the rest of the functionality is provided by the
    // datetimepicker component

    describe('Data-api tests', function () {
      it(
        'should init datetimepicker with default config on page load',
        function () {
          var $input = $('<input type="text" data-onload-datetimepicker />');
          $('#mocha-fixture').append($input);

          sinon.spy(jQuery.fn, 'datetimepicker');
          sinon.stub(moment, 'locale').withArgs().returns('fake-locale');
          $(window).trigger('load');

          assert.isOk(jQuery.fn.datetimepicker.calledOnce, 'Should init the datetimepicker');
          assert.isOk(
            jQuery.fn.datetimepicker.calledWith({
              allowInputToggle: true,
              sideBySide: true,
              locale: 'fake-locale',
            }),
            'Should init the datetimepicker with default config'
          );
        }
      );

      it('should init datetimepicker with some config option on page load',
        function () {
          var $input = $(
            '<input type="text" data-onload-datetimepicker=\'{"option": "optionValue"}\' />'
          );
          $('#mocha-fixture').append($input);

          sinon.spy(jQuery.fn, 'datetimepicker');
          sinon.stub(moment, 'locale').withArgs().returns('fake-locale');
          $(window).trigger('load');

          assert.isOk(jQuery.fn.datetimepicker.calledOnce, 'Should init the datetimepicker');
          assert.isOk(
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

      it('should init datetimepicker with locale', function () {
        var $input = $('<input type="text" data-onload-datetimepicker />');

        $('html').attr('lang', 'cs');
        $('#mocha-fixture').append($input);
        sinon.spy(jQuery.fn, 'datetimepicker');
        sinon.stub(moment, 'locale').withArgs('cs').returns('fake-locale');
        $(window).trigger('load');

        assert.isOk(jQuery.fn.datetimepicker.calledOnce, 'Should init the datetimepicker');
        assert.isOk(
          jQuery.fn.datetimepicker.calledWith({
            locale: 'fake-locale',
            allowInputToggle: true,
            sideBySide: true,
          }),
          'Should init the datetimepicker with locale set'
        );
      });
    });
  });
});
