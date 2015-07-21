$(function() {
  'use strict';

  module('ckeditor-loader', {
    setup: function() {
      jQuery.fn.ckeditor = function(conf) {};
    },
    teardown: function() {
      delete jQuery.fn.ckeditor;
    }
  });

  // Only Data-api tests are needed as the rest of the functionality is provided by the ckeditor jQuery adapter

  ////////////////////////////
  // Data-api related tests //
  ////////////////////////////
  test('should call the ckeditor() method on the textarea on page load with string attribute', function () {
    var $textarea = $('<textarea data-onload-ckeditor="/path/to/config.js">Some text</textarea>');
    $('#qunit-fixture').append($textarea);

    sinon.spy(jQuery.fn, 'ckeditor');
    $(window).trigger('load');

    ok(jQuery.fn.ckeditor.calledOnce, 'Should init the ckeditor');
    ok(
      jQuery.fn.ckeditor.calledWith({customConfig: '/path/to/config.js'}),
      'Should init the ckeditor with proper custom config file specified'
    );
  });

  test('should call the ckeditor() method on the textarea on page load with json attribute', function () {
    var $textarea = $('<textarea data-onload-ckeditor=\'{"option": "value"}\'>Some text</textarea>');
    $('#qunit-fixture').append($textarea);

    sinon.spy(jQuery.fn, 'ckeditor');
    $(window).trigger('load');

    ok(jQuery.fn.ckeditor.calledOnce, 'Should init the ckeditor');
    ok(
      jQuery.fn.ckeditor.calledWith({option: 'value'}),
      'Should init the ckeditor with proper config object'
    );
  });
});