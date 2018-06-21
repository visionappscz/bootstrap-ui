describe('CKEditor loader plugin', function () {

  beforeEach(function () {
    jQuery.fn.ckeditor = function () {};
  });

  afterEach(function () {
    delete jQuery.fn.ckeditor;
    $('html').attr('lang', null);
    mocha.clearFixture();
  });

  // Only Data API tests are needed as the rest of the functionality is provided by the ckeditor
  // jQuery adapter

  describe('Data-api tests', function () {
    it('should init ckeditor on page load with no attribute', function () {
      var $textarea = $('<textarea data-onload-ckeditor></textarea>');
      $('#mocha-fixture').append($textarea);

      sinon.spy(jQuery.fn, 'ckeditor');
      $(window).trigger('load');

      assert.ok(jQuery.fn.ckeditor.calledOnce, 'Should init the ckeditor');
      assert.isOk(
        jQuery.fn.ckeditor.calledWithExactly({}),
        'Should init the ckeditor with no arguments'
      );
    });

    it('should init ckeditor on page load with string attribute', function () {
      var $textarea = $('<textarea data-onload-ckeditor="/path/to/config.js"></textarea>');
      $('#mocha-fixture').append($textarea);

      sinon.spy(jQuery.fn, 'ckeditor');
      $(window).trigger('load');

      assert.isOk(jQuery.fn.ckeditor.calledOnce, 'Should init the ckeditor');
      assert.isOk(
        jQuery.fn.ckeditor.calledWithExactly({ customConfig: '/path/to/config.js' }),
        'Should init the ckeditor with proper custom config file specified'
      );
    });

    it('should init ckeditor on on page load with json attribute', function () {
      var $textarea = $('<textarea data-onload-ckeditor=\'{"option": "value"}\'></textarea>');
      $('#mocha-fixture').append($textarea);

      sinon.spy(jQuery.fn, 'ckeditor');
      $(window).trigger('load');

      assert.isOk(jQuery.fn.ckeditor.calledOnce, 'Should init the ckeditor');
      assert.isOk(
        jQuery.fn.ckeditor.calledWithExactly({ option: 'value' }),
        'Should init the ckeditor with proper config object'
      );
    });

    it('should init ckeditor with detected language setting', function () {
      var $textarea = $(
        '<textarea data-onload-ckeditor=\'{"controlParam": "value"}\'></textarea>'
      );
      $('#mocha-fixture').append($textarea);

      sinon.spy(jQuery.fn, 'ckeditor');
      $('html').attr('lang', 'cs');
      $(window).trigger('load');

      assert.isOk(jQuery.fn.ckeditor.calledOnce, 'Should init the ckeditor');
      assert.isOk(
        jQuery.fn.ckeditor.calledWithExactly({ language: 'cs', controlParam: 'value' }),
        'Should init the ckeditor with proper config object'
      );
    });

    it('should init ckeditor with overloaded detected language setting', function () {
      var $textarea = $('<textarea data-onload-ckeditor=\'{"language": "fr"}\'></textarea>');
      $('#mocha-fixture').append($textarea);

      sinon.spy(jQuery.fn, 'ckeditor');
      $('html').attr('lang', 'cs');
      $(window).trigger('load');

      assert.isOk(jQuery.fn.ckeditor.calledOnce, 'Should init the ckeditor');
      assert.isOk(
        jQuery.fn.ckeditor.calledWithExactly({ language: 'fr' }),
        'Should init the ckeditor with proper config object'
      );
    });
  });
});
