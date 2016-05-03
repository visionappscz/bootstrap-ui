$(function () {
  'use strict';

  QUnit.module('ckeditor-loader', {
    setup: function () {
      jQuery.fn.ckeditor = function () {};
    },

    teardown: function () {
      delete jQuery.fn.ckeditor;
    },
  });

  // Only Data API tests are needed as the rest of the functionality is provided by the ckeditor
  // jQuery adapter

  // Data-api tests
  // ======================
  QUnit.test('should call the ckeditor() method on the textarea on page load with no attribute',
    function () {
      var $textarea = $('<textarea data-onload-ckeditor>Some text</textarea>');
      $('#qunit-fixture').append($textarea);

      sinon.spy(jQuery.fn, 'ckeditor');
      $(window).trigger('load');

      QUnit.ok(jQuery.fn.ckeditor.calledOnce, 'Should init the ckeditor');
      QUnit.ok(
        jQuery.fn.ckeditor.calledWithExactly({}),
        'Should init the ckeditor with no arguments'
      );
    }
  );

  QUnit.test('should call the ckeditor() method on the textarea on page load with string attribute',
    function () {
      var $textarea = $('<textarea data-onload-ckeditor="/path/to/config.js">Some text</textarea>');
      $('#qunit-fixture').append($textarea);

      sinon.spy(jQuery.fn, 'ckeditor');
      $(window).trigger('load');

      QUnit.ok(jQuery.fn.ckeditor.calledOnce, 'Should init the ckeditor');
      QUnit.ok(
        jQuery.fn.ckeditor.calledWithExactly({ customConfig: '/path/to/config.js' }),
        'Should init the ckeditor with proper custom config file specified'
      );
    }
  );

  QUnit.test('should call the ckeditor() method on the textarea on page load with json attribute',
    function () {
      var $textarea = $(
        '<textarea data-onload-ckeditor=\'{"option": "value"}\'>Some text</textarea>' +
        '');
      $('#qunit-fixture').append($textarea);

      sinon.spy(jQuery.fn, 'ckeditor');
      $(window).trigger('load');

      QUnit.ok(jQuery.fn.ckeditor.calledOnce, 'Should init the ckeditor');
      QUnit.ok(
        jQuery.fn.ckeditor.calledWithExactly({ option: 'value' }),
        'Should init the ckeditor with proper config object'
      );
    }
  );
});
