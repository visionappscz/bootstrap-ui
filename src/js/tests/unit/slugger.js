$(function() {
  'use strict';

  QUnit.module('slugger plugin');

  QUnit.test('should be defined on jquery object', function() {
    QUnit.ok($(document.body).slugger, 'slugger method is defined');
  });

  QUnit.module('slugger', {
    setup: function() {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.suiSlugger = $.fn.slugger.noConflict();
    },

    teardown: function() {
      $.fn.slugger = $.fn.suiSlugger;
      delete $.fn.suiSlugger;
    }
  });

  // Plugin tests
  // ============
  QUnit.test('should provide no conflict', function() {
    QUnit.strictEqual($.fn.slugger, undefined, 'slugger was set back to undefined (original value)');
  });

  QUnit.test('should return jquery collection containing the element', function() {
    var $el = $('<input type="text" />');
    var $slugger = $el.suiSlugger({target: $()});
    QUnit.ok($slugger instanceof $, 'returns jquery collection');
    QUnit.strictEqual($slugger[0], $el[0], 'collection contains element');
  });

  // Slug generation tests
  // ========================
  QUnit.test('should fire updated.sui.slugger when source value changes', function() {
    QUnit.stop();
    var $source = $('<input type="text" />');

    $source
      .on('updated.sui.slugger', function() {
        QUnit.ok(true, 'Event was expected and triggered');
        QUnit.start();
      })
      .suiSlugger({target: $()});
  });

  QUnit.test('should generate the correct slug', function() {
    QUnit.stop();
    var $source = $('<input type="text" />');
    var $target = $('<input type="text" />');

    $source
      .val('ãàáäâåčçďẽèéëêìíïîñõòóöôřšťùúüûýž x·x/x_x,x:x;;;')
      .on('updated.sui.slugger', function() {
        QUnit.strictEqual($target.val(), 'aaaaaaccdeeeeeiiiinooooorstuuuuyz-x-x-x-x-x-x-', 'Slug was generated correctly.');
        QUnit.start();
      })
      .suiSlugger({target: $target});
  });

  // Data-api tests
  // ==============
  QUnit.test('should generate slug', function() {
    QUnit.stop();
    var $source = $('<input type="text" data-toggle="slugger" data-slugger-target="#target" value="some text" />');
    $('#qunit-fixture')
      .html('<input type="text" id="target" />')
      .append($source);

    $(document).on('updated.sui.slugger', function() {
      QUnit.strictEqual($('#qunit-fixture #target').val(), 'some-text', 'Slug was generated.');
      $(document).off('updated.sui.slugger');
      QUnit.start();
    });

    $source.trigger('keyup.sui.slugger.data-api');
  });

  QUnit.test('should fire changed.sui.slugger when source looses focus after change', function() {
    QUnit.stop();
    var $source = $('<input type="text" data-toggle="slugger" data-slugger-target="#target" value="some text" />');
    $('#qunit-fixture')
      .html('<input type="text" id="target" />')
      .append($source);

    $(document).on('changed.sui.slugger', function() {
      $(document).off('changed.sui.slugger');
      QUnit.ok(true, 'Event was expected and fired');
      QUnit.start();
    });

    $source.trigger('change.sui.slugger.data-api');
  });

});
