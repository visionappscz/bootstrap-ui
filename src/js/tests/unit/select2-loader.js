describe('Select2 loader plugin', function () {

  var validateBaseArgs = function (value) {
    if (Object.prototype.toString.call(value.escapeMarkup) === '[object Function]' &&
      Object.prototype.toString.call(value.formatResult) === '[object Function]' &&
      Object.prototype.toString.call(value.formatSelection) === '[object Function]'
    ) {
      return true;
    }

    return false;
  };

  beforeEach(function () {
    jQuery.fn.select2 = function () {
    };
  });

  afterEach(function () {
    delete jQuery.fn.select2;
    mocha.clearFixture();
  });

  // Only Data API tests are needed as the rest of the functionality is provided by the
  // datetimepicker component

  describe('Data-api tests', function () {
    it(
      'should call the select2() method on the on page load with json attribute and image',
      function () {
        var $select = $(
          '<select data-onload-select2=\'{"option": "optionValue"}\'>' +
          '<option>opt 1</option>' +
          '</select>'
        );

        $('#mocha-fixture').append($select);
        sinon.spy(jQuery.fn, 'select2');
        $(window).trigger('load');

        assert.isOk(jQuery.fn.select2.calledOnce, 'Should init the select2 component');
        assert.isOk(jQuery.fn.select2.calledWithMatch(function (value) {
          return value.option === 'optionValue' && validateBaseArgs(value);
        }));
      }
    );

    it('should format the select2 options correctly', function () {
      var option = { text: 'optionText', id: 'optionId' };
      var $select = $(
        '<select data-onload-select2>' +
        '<option id="option" data-image-src="imageSource">opt 1</option>' +
        '</select>'
      );

      var $optEl = $select.find('#option');

      $('#mocha-fixture').append($select);
      sinon.spy(jQuery.fn, 'select2');
      $(window).trigger('load');

      assert.isOk(jQuery.fn.select2.calledWithMatch(function (value) {
        return value.formatResult === value.formatSelection;
      }));

      assert.isOk(jQuery.fn.select2.calledWithMatch(function (value) {
        var testOpt = { element: $('<option></option>'), text: 'optionText' };

        return value.formatResult(testOpt) === 'optionText';
      }));

      assert.isOk(jQuery.fn.select2.calledWithMatch(function (value) {
        var testOpt = { element: $optEl };
        var output = '<img src="imageSource" alt="optionText">&nbsp;optionText';

        $.extend(testOpt, option);

        return value.formatResult(testOpt) === output;
      }));

      assert.isOk(jQuery.fn.select2.calledWithMatch(function (value) {
        var testOpt = { element: $optEl };
        var output = '<img ' +
          'src="imageSource" alt="optionText" srcset="imageSrcset" height="10" width="10"' +
          '>&nbsp;optionText';

        $optEl.attr('data-image-srcset', 'imageSrcset');
        $optEl.attr('data-image-width', '10');
        $optEl.attr('data-image-height', '10');
        $.extend(testOpt, option);

        return value.formatResult(testOpt) === output;
      }));
    });

    it(
      'should call the select2 method on on page load with no attributes',
      function () {
        var $select = $('<select data-onload-select2>Some text</select>');

        $('#mocha-fixture').append($select);
        sinon.spy(jQuery.fn, 'select2');
        $(window).trigger('load');

        assert.isOk(jQuery.fn.select2.calledOnce, 'Should init the select2 component');
        assert.isOk(jQuery.fn.select2.calledWithMatch(function (value) {
          return validateBaseArgs(value);
        }));
      }
    );
  });
});
