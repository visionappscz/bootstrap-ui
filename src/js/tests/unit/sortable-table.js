$(function () {
  'use strict';

  QUnit.module('sortable-table plugin');

  QUnit.test('should be defined on jquery object', function () {
    QUnit.ok($(document.body).sortableTable, 'sortable-table method is defined');
  });

  QUnit.module('sortable-table', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in
      // noConflict mode
      $.fn.buiSortableTable = $.fn.sortableTable.noConflict();
    },

    teardown: function () {
      $.fn.sortableTable = $.fn.buiSortableTable;
      delete $.fn.buiSortableTable;
      $('html').attr('lang', null);
    },
  });

  // Plugin tests
  // ============
  QUnit.test('should provide no conflict', function () {
    QUnit.strictEqual(
      $.fn.sortableTable,
      undefined,
      'sortableTable was set back to undefined (original value)'
    );
  });

  QUnit.test('should return jquery collection containing the element', function () {
    var $table = $('<table>' +
      '<thead><tr><th>HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row1"><td>1</td></tr>' +
      '</tbody>' +
    '</table>');
    var $sortableTable = $table.buiSortableTable({ 'sorted-th': $table.find('th') });

    QUnit.ok($sortableTable instanceof $, 'returns jquery collection');
    QUnit.strictEqual($sortableTable[0], $table[0], 'collection contains element');
  });

  // Events tests
  // ============
  QUnit.test('should fire sort.bui.sortableTable when sorting begins', function () {
    QUnit.stop();
    var eventFired = false;
    var $table = $('<table>' +
      '<thead><tr><th>HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
    '</table>');

    $table.on('sort.bui.sortableTable', function () {
      var $rows = $table.find('tbody tr');
      eventFired = true;
      QUnit.ok($($rows[0]).attr('id') === 'row2', 'row2 is first');
      QUnit.ok($($rows[1]).attr('id') === 'row1', 'row1 is second');
      QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
      QUnit.ok(true, 'event fired');
    });

    $table.buiSortableTable({ 'sorted-th': $table.find('th') });
    setTimeout(function () {
      if (!eventFired) {
        QUnit.ok(false, 'Event not fired.');
      }

      QUnit.start();
    }, 100);
  });

  QUnit.test('should fire sorted.bui.sortableTable when sorting is done', function () {
    QUnit.stop();
    var eventFired = false;
    var $table = $('<table>' +
      '<thead><tr><th>HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
    '</table>');

    $table.on('sort.bui.sortableTable', function () {
      $table.on('sorted.bui.sortableTable', function () {
        var $rows = $table.find('tbody tr');
        eventFired = true;
        QUnit.ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
        QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
        QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
        QUnit.ok(true, 'event fired');
      });
    });

    $table.buiSortableTable({ 'sorted-th': $table.find('th') });
    setTimeout(function () {
      if (!eventFired) {
        QUnit.ok(false, 'Event not fired.');
      }

      QUnit.start();
    }, 100);
  });

  QUnit.test('should not fire any events when called on empty set', function () {
    QUnit.stop();
    var $table = $('#empty-selector');

    $(document).on('sort.bui.sortableTable', function () {
      QUnit.ok(false, 'event sort.bui.sortableTable fired');
    });

    $(document).on('sorted.bui.sortableTable', function () {
      QUnit.ok(false, 'event sorted.bui.sortableTable fired');
    });

    $table.buiSortableTable({ 'sorted-th': $table.find('th') });
    setTimeout(function () {
      QUnit.ok(true, 'allways ok');
      $(document).off('sort.bui.sortableTable');
      $(document).off('sorted.bui.sortableTable');
      QUnit.start();
    }, 100);
  });

  // Sorting tests
  // =============
  QUnit.test('should sort column in ascending direction if no direction is specified and reverse ' +
    'current order if the column has been ordered already', function () {
    QUnit.stop();
    var $table = $('<table>' +
      '<thead><tr><th>HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
    '</table>');

    $table.on('sorted.bui.sortableTable', function () {
      $table.off('sorted.bui.sortableTable');
      var $rows = $table.find('tbody tr');
      QUnit.ok($($rows[0]).attr('id') === 'row1', 'row1 is first on run 1');
      QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second on run 1');
      QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third on run 1');
    });

    $table.buiSortableTable({ 'sorted-th': $table.find('th') });
    $table.on('sorted.bui.sortableTable', function () {
      $table.off('sorted.bui.sortableTable');
      var $rows = $table.find('tbody tr');
      QUnit.ok($($rows[0]).attr('id') === 'row3', 'row3 is first on run 2');
      QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second on run 2');
      QUnit.ok($($rows[2]).attr('id') === 'row1', 'row1 is third on run 2');
    });

    $table.buiSortableTable({ 'sorted-th': $table.find('th') });
    $table.on('sorted.bui.sortableTable', function () {
      $table.off('sorted.bui.sortableTable');
      var $rows = $table.find('tbody tr');
      QUnit.ok($($rows[0]).attr('id') === 'row1', 'row1 is first on run 3');
      QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second on run 3');
      QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third on run 3');
      QUnit.start();
    });

    $table.buiSortableTable({ 'sorted-th': $table.find('th') });
  });

  QUnit.test(
    'should sort column in ascending direction if direction specified is "asc"',
    function () {
      QUnit.stop();
      var $table = $('<table>' +
        '<thead><tr><th>HeaderA</th></tr></thead>' +
        '<tbody>' +
        '<tr id="row2"><td>2</td></tr>' +
        '<tr id="row1"><td>1</td></tr>' +
        '<tr id="row3"><td>3</td></tr>' +
        '</tbody>' +
      '</table>');

      $table.on('sorted.bui.sortableTable', function () {
        var $rows = $table.find('tbody tr');
        QUnit.ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
        QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
        QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
        QUnit.start();
      });

      $table.buiSortableTable({ 'sorted-th': $table.find('th'), 'sort-direction': 'asc' });
    }
  );

  QUnit.test(
    'should sort column in descending direction if direction specified is "desc"',
    function () {
      QUnit.stop();
      var $table = $('<table>' +
        '<thead><tr><th>HeaderA</th></tr></thead>' +
        '<tbody>' +
        '<tr id="row2"><td>2</td></tr>' +
        '<tr id="row1"><td>1</td></tr>' +
        '<tr id="row3"><td>3</td></tr>' +
        '</tbody>' +
      '</table>');

      $table.on('sorted.bui.sortableTable', function () {
        var $rows = $table.find('tbody tr');
        QUnit.ok($($rows[0]).attr('id') === 'row3', 'row3 is first');
        QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
        QUnit.ok($($rows[2]).attr('id') === 'row1', 'row1 is third');
        QUnit.start();
      });

      $table.buiSortableTable({ 'sorted-th': $table.find('th'), 'sort-direction': 'desc' });
    }
  );

  QUnit.test(
    'should set class "sorting-asc" only on the sorted <th> element if sorting direction is ' +
    'ascending',
    function () {
      QUnit.stop();
      var $table = $('<table>' +
        '<thead><tr>' +
        '<th id="headerA">HeaderA</th>' +
        '<th id="headerB">HeaderB</th>' +
        '</tr></thead>' +
        '<tbody>' +
        '<tr id="row2"><td>A2</td><td>B2</td></tr>' +
        '<tr id="row1"><td>A1</td><td>B1</td></tr>' +
        '<tr id="row3"><td>A3</td><td>B3</td></tr>' +
        '</tbody>' +
      '</table>');
      $('qunit-fixture').append($table);

      $table.on('sorted.bui.sortableTable', function () {
        $table.off('sorted.bui.sortableTable');
        QUnit.ok(
          $table.find('#headerA').hasClass('sorting-asc'),
          'headerA has the class sorting-asc on run 1'
        );
        QUnit.ok(
          !$table.find('#headerB').hasClass('sorting-asc'),
          'headerB has not the class sorting-asc on run 1'
        );
      });

      $table.buiSortableTable({ 'sorted-th': $table.find('#headerA'), 'sort-direction': 'asc' });
      $table.on('sorted.bui.sortableTable', function () {
        $table.off('sorted.bui.sortableTable');
        QUnit.ok(
          !$table.find('#headerA').hasClass('sorting-asc'),
          'headerA has not the class sorting-asc on run 2'
        );
        QUnit.ok(
          $table.find('#headerB').hasClass('sorting-asc'),
          'headerB has the class sorting-asc on run 2'
        );
        QUnit.start();
      });

      $table.buiSortableTable({ 'sorted-th': $table.find('#headerB'), 'sort-direction': 'asc' });
    }
  );

  QUnit.test(
    'should set class "sorting-desc" only on the sorted <th> element if sorting direction is ' +
    'descending',
    function () {
      QUnit.stop();
      var $table = $('<table>' +
        '<thead><tr>' +
        '<th id="headerA">HeaderA</th>' +
        '<th id="headerB">HeaderB</th>' +
        '</tr></thead>' +
        '<tbody>' +
        '<tr id="row2"><td>A2</td><td>B2</td></tr>' +
        '<tr id="row1"><td>A1</td><td>B1</td></tr>' +
        '<tr id="row3"><td>A3</td><td>B3</td></tr>' +
        '</tbody>' +
      '</table>');

      $table.on('sorted.bui.sortableTable', function () {
        $table.off('sorted.bui.sortableTable');
        QUnit.ok(
          $table.find('#headerA').hasClass('sorting-desc'),
          'headerA has the class sorting-desc on run 1'
        );
        QUnit.ok(
          !$table.find('#headerB').hasClass('sorting-desc'),
          'headerB has not the class sorting-desc on run 1'
        );
      });

      $table.buiSortableTable({ 'sorted-th': $table.find('#headerA'), 'sort-direction': 'desc' });
      $table.on('sorted.bui.sortableTable', function () {
        $table.off('sorted.bui.sortableTable');
        QUnit.ok(
          !$table.find('#headerA').hasClass('sorting-desc'),
          'headerA has not the class sorting-desc on run 2'
        );
        QUnit.ok(
          $table.find('#headerB').hasClass('sorting-desc'),
          'headerB has the class sorting-desc on run 2'
        );
        QUnit.start();
      });

      $table.buiSortableTable({ 'sorted-th': $table.find('#headerB'), 'sort-direction': 'desc' });
    }
  );

  QUnit.test(
    'should populate and empty the navigation element if sorting by grouped column',
    function () {
      QUnit.stop();
      var navigationEl;
      var $table = $('<table>' +
        '<thead><tr>' +
        '<th id="headerA">HeaderA</th>' +
        '<th id="headerB">HeaderB</th>' +
        '</tr></thead>' +
        '<tbody>' +
        '<tr id="row2"><td data-sort-group="2">2</td><td>B2</td></tr>' +
        '<tr id="row1"><td data-sort-group="1">1</td><td>B1</td></tr>' +
        '<tr id="row3"><td data-sort-group="3">3</td><td>B3</td></tr>' +
        '</tbody>' +
      '</table>');
      $('#qunit-fixture')
        .append('<div id="navigation"/>')
        .append($table);
      navigationEl = $('#navigation');

      $table.on('sorted.bui.sortableTable', function () {
        $table.off('sorted.bui.sortableTable');
        QUnit.ok(!$('#navigation').is(':empty'), 'the navigation element was populated');
      });

      $table.buiSortableTable({
        'sorted-th': $table.find('#headerA'),
        'sort-direction': 'desc',
        navigation: navigationEl,
      });

      $table.on('sorted.bui.sortableTable', function () {
        $table.off('sorted.bui.sortableTable');
        QUnit.ok($('#navigation').is(':empty'), 'the navigation element was emptied');
        QUnit.start();
      });

      $table.buiSortableTable({
        'sorted-th': $table.find('#headerB'),
        'sort-direction': 'desc',
        navigation: navigationEl,
      });
    }
  );

  QUnit.test(
    'should create and remove all group <thead> in table if sorting by grouped column',
    function () {
      QUnit.stop();
      var navigationEl;
      var $table = $('<table>' +
        '<thead><tr>' +
        '<th id="headerA">HeaderA</th>' +
        '<th id="headerB">HeaderB</th>' +
        '</tr></thead>' +
        '<tbody>' +
        '<tr id="row2"><td data-sort-group="2">2</td><td>B2</td></tr>' +
        '<tr id="row1"><td data-sort-group="1">1</td><td>B1</td></tr>' +
        '<tr id="row3"><td data-sort-group="3">3</td><td>B3</td></tr>' +
        '</tbody>' +
      '</table>');

      $('#qunit-fixture')
        .append('<div id="navigation"/>')
        .append($table);
      navigationEl = $('#navigation');

      $table.on('sorted.bui.sortableTable', function () {
        $table.off('sorted.bui.sortableTable');
        QUnit.ok($table.find('thead').length === 4, 'the group <thead> were created');
      });

      $table.buiSortableTable({
        'sorted-th': $table.find('#headerA'),
        'sort-direction': 'desc',
        navigation: navigationEl,
      });

      $table.on('sorted.bui.sortableTable', function () {
        $table.off('sorted.bui.sortableTable');
        QUnit.ok($table.find('thead').length === 1, 'the group <thead> were removed');
        QUnit.start();
      });

      $table.buiSortableTable({
        'sorted-th': $table.find('#headerB'),
        'sort-direction': 'desc',
        navigation: navigationEl,
      });
    }
  );

  QUnit.test(
    'should not do anything if sorted by column with same values in all rows and the direction is' +
    ' changed',
    function () {
      QUnit.stop();
      $('<table>' +
        '<thead>' +
        '<tr><th id="headerA">HeaderA</th><th id="headerB">HeaderB</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr id="row2"><td>2</td><td>0</td></tr>' +
        '<tr id="row1"><td>1</td><td>0</td></tr>' +
        '<tr id="row3"><td>3</td><td>0</td></tr>' +
        '</tbody>' +
      '</table>')
        .on('sorted.bui.sortableTable', function () {
          $(this).off('sorted.bui.sortableTable');
          var $rows = $(this).find('tbody tr');
          QUnit.ok($($rows[0]).attr('id') === 'row2', 'row2 is first');
          QUnit.ok($($rows[1]).attr('id') === 'row1', 'row1 is second');
          QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
        })
        .buiSortableTable({ 'sorted-th': $(this).find('#headerB'), 'sort-direction': 'desc' })
        .on('sorted.bui.sortableTable', function () {
          $(this).off('sorted.bui.sortableTable');
          var $rows = $(this).find('tbody tr');
          QUnit.ok($($rows[0]).attr('id') === 'row2', 'row2 is first');
          QUnit.ok($($rows[1]).attr('id') === 'row1', 'row1 is second');
          QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
          QUnit.start();
        })
        .buiSortableTable({ 'sorted-th': $(this).find('#headerB'), 'sort-direction': 'asc' });
    }
  );

  QUnit.test('should sort with invalid html language', function () {
    var $table = $('<table>' +
      '<tbody>' +
      '<thead><tr><th id="headerA">HeaderA</th></tr></thead>' +
      '<tr id="row1"><td>šb</td></tr>' +
      '<tr id="row2"><td>sa</td></tr>' +
      '<tr id="row3"><td>sc</td></tr>' +
      '</tbody>' +
      '</table>');

    QUnit.stop();
    $('html').attr('lang', 'some-invalid-language-code');
    $table.on('sorted.bui.sortableTable', function () {
      var $rows = $(this).find('tbody tr');
      $(this).off('sorted.bui.sortableTable');
      QUnit.ok($($rows[0]).attr('id') === 'row2');

      // Other rows can not be tested as the result depends on the environment.
      QUnit.start();
    })
    .buiSortableTable({ 'sorted-th': $(this).find('#headerA'), 'sort-direction': 'asc' });
  });

  QUnit.test('should sort based on html language ', function () {
    var $table = $('<table>' +
      '<tbody>' +
      '<thead><tr><th id="headerA">HeaderA</th></tr></thead>' +
      '<tr id="row1"><td>šb</td></tr>' +
      '<tr id="row2"><td>sa</td></tr>' +
      '<tr id="row3"><td>sc</td></tr>' +
      '</tbody>' +
      '</table>');

    QUnit.stop();
    $('html').attr('lang', 'cs');
    $table.on('sorted.bui.sortableTable', function () {
      var $rows = $(this).find('tbody tr');
      var validateNoLocale = function ($rows) {
        QUnit.ok($($rows[0]).attr('id') === 'row2');

        // Other rows can not be tested as the result depends on the environment.
      };

      $(this).off('sorted.bui.sortableTable');

      // Test should pass regardless weather browser supports locales
      // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#Check_browser_support_for_extended_arguments
      try {
        'foo'.localeCompare('bar', 'i');
        validateNoLocale($rows);
      } catch (err) {
        if (err instanceof RangeError) {
          QUnit.ok($($rows[0]).attr('id') === 'row2');
          QUnit.ok($($rows[1]).attr('id') === 'row3');
          QUnit.ok($($rows[2]).attr('id') === 'row1');
        } else {
          validateNoLocale($rows);
        }
      }

      QUnit.start();
    })
    .buiSortableTable({ 'sorted-th': $(this).find('#headerA'), 'sort-direction': 'asc' });
  });

  // Data-api tests
  // ==============
  QUnit.test('should order table by the column whoms <th> element was clicked', function () {
    QUnit.stop();
    var $table = $('<table>' +
      '<thead><tr><th data-toggle="sort" id="headerA">HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
      '</table>');
    $('#qunit-fixture').append($table);

    $table.on('sorted.bui.sortableTable', function () {
      var $rows = $table.find('tbody tr');
      QUnit.ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
      QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
      QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
      QUnit.start();
    });

    $('#headerA').click();
  });

  QUnit.test(
    'should order table by the column on whoms <th> element Enter was pressed',
    function () {
      QUnit.stop();
      var $table = $('<table>' +
        '<thead><tr><th data-toggle="sort" id="headerA">HeaderA</th></tr></thead>' +
        '<tbody>' +
        '<tr id="row2"><td>2</td></tr>' +
        '<tr id="row1"><td>1</td></tr>' +
        '<tr id="row3"><td>3</td></tr>' +
        '</tbody>' +
        '</table>');
      $('#qunit-fixture').append($table);

      $table.on('sorted.bui.sortableTable', function () {
        var $rows = $table.find('tbody tr');
        QUnit.ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
        QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
        QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
        QUnit.start();
      });

      $('#headerA').trigger($.Event('keydown', { keyCode: 13 }));
    }
  );

  QUnit.test(
    'should order table by the column on whoms <th> element space was pressed',
    function () {
      QUnit.stop();
      var $table = $('<table>' +
        '<thead><tr><th data-toggle="sort" id="headerA">HeaderA</th></tr></thead>' +
        '<tbody>' +
        '<tr id="row2"><td>2</td></tr>' +
        '<tr id="row1"><td>1</td></tr>' +
        '<tr id="row3"><td>3</td></tr>' +
        '</tbody>' +
        '</table>');
      $('#qunit-fixture').append($table);

      $table.on('sorted.bui.sortableTable', function () {
        var $rows = $table.find('tbody tr');
        QUnit.ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
        QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
        QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
        QUnit.start();
      });

      $('#headerA').trigger($.Event('keydown', { keyCode: 32 }));
    }
  );

  QUnit.test(
    'should sort the table in ascending mode on load if <th> has data-sort-onload="asc" attribute',
    function () {
      QUnit.stop();
      var $table = $('<table>' +
        '<thead><tr><th data-toggle="sort" data-sort-onload="asc" id="headerA">HeaderA</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr id="row2"><td>2</td></tr>' +
        '<tr id="row1"><td>1</td></tr>' +
        '<tr id="row3"><td>3</td></tr>' +
        '</tbody>' +
        '</table>');
      $('#qunit-fixture').append($table);

      $table.on('sorted.bui.sortableTable', function () {
        var $rows = $table.find('tbody tr');
        QUnit.ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
        QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
        QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
        QUnit.start();
      });

      $(window).trigger('load');
    }
  );

  QUnit.test(
    'should sort the table in descending mode on load if <th> has data-sort-onload="desc" ' +
    'attribute',
    function () {
      QUnit.stop();
      var $table = $('<table>' +
        '<thead><tr><th data-toggle="sort" data-sort-onload="desc" id="headerA">HeaderA</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr id="row2"><td>2</td></tr>' +
        '<tr id="row1"><td>1</td></tr>' +
        '<tr id="row3"><td>3</td></tr>' +
        '</tbody>' +
        '</table>');
      $('#qunit-fixture').append($table);

      $table.on('sorted.bui.sortableTable', function () {
        var $rows = $table.find('tbody tr');
        QUnit.ok($($rows[0]).attr('id') === 'row3', 'row3 is first');
        QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
        QUnit.ok($($rows[2]).attr('id') === 'row1', 'row1 is third');
        QUnit.start();
      });

      $(window).trigger('load');
    }
  );

  QUnit.test('should sort two tables data-sort-onload attribute independently', function () {
    QUnit.stop();
    var $table1 = $('<table>' +
      '<thead><tr><th data-toggle="sort" data-sort-onload="desc" id="headerA">HeaderA</th></tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
      '</table>');
    var $table2 = $('<table>' +
      '<thead><tr><th data-toggle="sort" data-sort-onload="asc" id="headerB">HeaderB</th></tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
      '</table>');

    $('#qunit-fixture')
      .append($table1)
      .append($table2);

    $table1.on('sorted.bui.sortableTable', function () {
      var $rows = $table1.find('tbody tr');
      QUnit.ok($($rows[0]).attr('id') === 'row3', 'row3 is first');
      QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
      QUnit.ok($($rows[2]).attr('id') === 'row1', 'row1 is third');
      $table2.on('sorted.bui.sortableTable', function () {
        var $rows = $table2.find('tbody tr');
        QUnit.ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
        QUnit.ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
        QUnit.ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
        QUnit.start();
      });
    });

    $(window).trigger('load');
  });
});
