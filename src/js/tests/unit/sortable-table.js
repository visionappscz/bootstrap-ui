$(function() {
  'use strict';

  module('sortable-table plugin');

  test('should be defined on jquery object', function() {
    ok($(document.body).sortableTable, 'sortable-table method is defined');
  });



  module('sortable-table', {
    setup: function() {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.suiSortableTable = $.fn.sortableTable.noConflict();
    },
    teardown: function() {
      $.fn.sortableTable = $.fn.suiSortableTable;
      delete $.fn.suiSortableTable;
    }
  });

  //////////////////
  // Plugin tests //
  //////////////////
  test('should provide no conflict', function() {
    strictEqual($.fn.sortableTable, undefined, 'sortableTable was set back to undefined (original value)');
  });

  test('should return jquery collection containing the element', function() {
    var $table = $('<table>' +
      '<thead><tr><th>HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row1"><td>1</td></tr>' +
      '</tbody>' +
    '</table>');
    var $sortableTable = $table.suiSortableTable({'sorted-th': $table.find('th')});
    ok($sortableTable instanceof $, 'returns jquery collection');
    strictEqual($sortableTable[0], $table[0], 'collection contains element');
  });

  /////////////////////////
  // Event related tests //
  /////////////////////////
  test('should fire sort.sui.sortableTable when sorting begins', function() {
    stop();
    var eventFired = false;
    var $table = $('<table>' +
      '<thead><tr><th>HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
    '</table>');

    $table.on('sort.sui.sortableTable', function() {
      var $rows = $table.find('tbody tr');
      eventFired = true;
      ok($($rows[0]).attr('id') === 'row2', 'row2 is first');
      ok($($rows[1]).attr('id') === 'row1', 'row1 is second');
      ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
      ok(true, 'event fired');
    });

    $table.suiSortableTable({'sorted-th': $table.find('th')});

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'Event not fired.');
      }
      start();
    }, 100);
  });

  test('should fire sorted.sui.sortableTable when sorting is done', function() {
    stop();
    var eventFired = false;
    var $table = $('<table>' +
      '<thead><tr><th>HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
    '</table>');

    $table.on('sort.sui.sortableTable', function() {
      $table.on('sorted.sui.sortableTable', function() {
        var $rows = $table.find('tbody tr');
        eventFired = true;
        ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
        ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
        ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
        ok(true, 'event fired');
      });
    });

    $table.suiSortableTable({'sorted-th': $table.find('th')});

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'Event not fired.');
      }
      start();
    }, 100);
  });

  test('should not fire any events when called on empty set', function() {
    stop();

    var $table = $('#empty-selector');

    $(document).on('sort.sui.sortableTable', function() {
      ok(false, 'event sort.sui.sortableTable fired');
    });
    $(document).on('sorted.sui.sortableTable', function() {
      ok(false, 'event sorted.sui.sortableTable fired');
    });

    $table.suiSortableTable({'sorted-th': $table.find('th')});

    setTimeout(function() {
      ok(true, 'allways ok');
      $(document).off('sort.sui.sortableTable');
      $(document).off('sorted.sui.sortableTable');
      start();
    }, 100);
  });

  ///////////////////////////
  // Sorting realted tests //
  ///////////////////////////
  test('should sort column in ascending direction if no direction is specified and reverse current order if the column has been ordered already', function() {
    stop();
    var $table = $('<table>' +
      '<thead><tr><th>HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
    '</table>');

    $table.on('sorted.sui.sortableTable', function() {
      $table.off('sorted.sui.sortableTable');
      var $rows = $table.find('tbody tr');
      ok($($rows[0]).attr('id') === 'row1', 'row1 is first on run 1');
      ok($($rows[1]).attr('id') === 'row2', 'row2 is second on run 1');
      ok($($rows[2]).attr('id') === 'row3', 'row3 is third on run 1');
    });
    $table.suiSortableTable({'sorted-th': $table.find('th')});

    $table.on('sorted.sui.sortableTable', function() {
      $table.off('sorted.sui.sortableTable');
      var $rows = $table.find('tbody tr');
      ok($($rows[0]).attr('id') === 'row3', 'row3 is first on run 2');
      ok($($rows[1]).attr('id') === 'row2', 'row2 is second on run 2');
      ok($($rows[2]).attr('id') === 'row1', 'row1 is third on run 2');
    });
    $table.suiSortableTable({'sorted-th': $table.find('th')});

    $table.on('sorted.sui.sortableTable', function() {
      $table.off('sorted.sui.sortableTable');
      var $rows = $table.find('tbody tr');
      ok($($rows[0]).attr('id') === 'row1', 'row1 is first on run 3');
      ok($($rows[1]).attr('id') === 'row2', 'row2 is second on run 3');
      ok($($rows[2]).attr('id') === 'row3', 'row3 is third on run 3');
      start();
    });
    $table.suiSortableTable({'sorted-th': $table.find('th')});
  });

  test('should sort column in ascending direction if direction specified is "asc"', function() {
    stop();
    var $table = $('<table>' +
      '<thead><tr><th>HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
    '</table>');

    $table.on('sorted.sui.sortableTable', function() {
      var $rows = $table.find('tbody tr');
      ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
      ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
      ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
      start();
    });

    $table.suiSortableTable({'sorted-th': $table.find('th'), 'sort-direction': 'asc'});
  });

  test('should sort column in descending direction if direction specified is "desc"', function() {
    stop();
    var $table = $('<table>' +
      '<thead><tr><th>HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
    '</table>');

    $table.on('sorted.sui.sortableTable', function() {
      var $rows = $table.find('tbody tr');
      ok($($rows[0]).attr('id') === 'row3', 'row3 is first');
      ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
      ok($($rows[2]).attr('id') === 'row1', 'row1 is third');
      start();
    });

    $table.suiSortableTable({'sorted-th': $table.find('th'), 'sort-direction': 'desc'});
  });

  test('should set class "sorting-asc" only on the sorted <th> element if sorting direction is ascending', function() {
    stop();
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

    $table.on('sorted.sui.sortableTable', function() {
      $table.off('sorted.sui.sortableTable');
      ok($table.find('#headerA').hasClass('sorting-asc'), 'headerA has the class sorting-asc on run 1');
      ok(!$table.find('#headerB').hasClass('sorting-asc'), 'headerB has not the class sorting-asc on run 1');
    });
    $table.suiSortableTable({'sorted-th': $table.find('#headerA'), 'sort-direction': 'asc'});

    $table.on('sorted.sui.sortableTable', function() {
      $table.off('sorted.sui.sortableTable');
      ok(!$table.find('#headerA').hasClass('sorting-asc'), 'headerA has not the class sorting-asc on run 2');
      ok($table.find('#headerB').hasClass('sorting-asc'), 'headerB has the class sorting-asc on run 2');
      start();
    });
    $table.suiSortableTable({'sorted-th': $table.find('#headerB'), 'sort-direction': 'asc'});
  });

  test('should set class "sorting-desc" only on the sorted <th> element if sorting direction is descending', function() {
    stop();
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

    $table.on('sorted.sui.sortableTable', function() {
      $table.off('sorted.sui.sortableTable');
      ok($table.find('#headerA').hasClass('sorting-desc'), 'headerA has the class sorting-desc on run 1');
      ok(!$table.find('#headerB').hasClass('sorting-desc'), 'headerB has not the class sorting-desc on run 1');
    });
    $table.suiSortableTable({'sorted-th': $table.find('#headerA'), 'sort-direction': 'desc'});

    $table.on('sorted.sui.sortableTable', function() {
      $table.off('sorted.sui.sortableTable');
      ok(!$table.find('#headerA').hasClass('sorting-desc'), 'headerA has not the class sorting-desc on run 2');
      ok($table.find('#headerB').hasClass('sorting-desc'), 'headerB has the class sorting-desc on run 2');
      start();
    });
    $table.suiSortableTable({'sorted-th': $table.find('#headerB'), 'sort-direction': 'desc'});
  });

  test('should fill and empty the navigation element if sorting by grouped column', function() {
    stop();
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

    $table.on('sorted.sui.sortableTable', function() {
      $table.off('sorted.sui.sortableTable');
      ok(!$('#qunit-fixture #navigation').is(':empty'), 'the navigation element was populated');
    });
    $table.suiSortableTable({
      'sorted-th': $table.find('#headerA'),
      'sort-direction': 'desc',
      'navigation': $('#qunit-fixture #navigation')
    });

    $table.on('sorted.sui.sortableTable', function() {
      $table.off('sorted.sui.sortableTable');
      ok($('#qunit-fixture #navigation').is(':empty'), 'the navigation element was emptied');
      start();
    });
    $table.suiSortableTable({
      'sorted-th': $table.find('#headerB'),
      'sort-direction': 'desc',
      'navigation': $('#qunit-fixture #navigation')
    });
  });

  test('should create and remove all group <thead> in table if sorting by grouped column', function() {
    stop();
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

    $table.on('sorted.sui.sortableTable', function() {
      $table.off('sorted.sui.sortableTable');
      ok($table.find('thead').length === 4, 'the group <thead> were created');
    });
    $table.suiSortableTable({
      'sorted-th': $table.find('#headerA'),
      'sort-direction': 'desc',
      'navigation': $('#qunit-fixture #navigation')
    });

    $table.on('sorted.sui.sortableTable', function() {
      $table.off('sorted.sui.sortableTable');
      ok($table.find('thead').length === 1, 'the group <thead> were removed');
      start();
    });
    $table.suiSortableTable({
      'sorted-th': $table.find('#headerB'),
      'sort-direction': 'desc',
      'navigation': $('#qunit-fixture #navigation')
    });
  });

  ////////////////////////////
  // Data-api related tests //
  ////////////////////////////
  test('should order table by the column whoms <th> element was clicked', function() {
    stop();
    var $table = $('<table>' +
      '<thead><tr><th data-toggle="sort" id="headerA">HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
      '</table>');
    $('#qunit-fixture').append($table);

    $table.on('sorted.sui.sortableTable', function() {
      var $rows = $table.find('tbody tr');
      ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
      ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
      ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
      start();
    });

    $('#headerA').click();
  });

  test('should order table by the column on whoms <th> element Enter was pressed', function() {
    stop();
    var $table = $('<table>' +
      '<thead><tr><th data-toggle="sort" id="headerA">HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
      '</table>');
    $('#qunit-fixture').append($table);

    $table.on('sorted.sui.sortableTable', function() {
      var $rows = $table.find('tbody tr');
      ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
      ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
      ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
      start();
    });

    $('#headerA').trigger($.Event('keydown', { keyCode: 13}));
  });

  test('should order table by the column on whoms <th> element space was pressed', function() {
    stop();
    var $table = $('<table>' +
      '<thead><tr><th data-toggle="sort" id="headerA">HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
      '</table>');
    $('#qunit-fixture').append($table);

    $table.on('sorted.sui.sortableTable', function() {
      var $rows = $table.find('tbody tr');
      ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
      ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
      ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
      start();
    });

    $('#headerA').trigger($.Event('keydown', { keyCode: 32}));
  });

  test('should sort the table in ascending mode on load if <th> has data-sortable-onload="asc" attribute', function() {
    stop();
    var $table = $('<table>' +
      '<thead><tr><th data-toggle="sort" data-sortable-onload="asc" id="headerA">HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
      '</table>');
    $('#qunit-fixture').append($table);

    $table.on('sorted.sui.sortableTable', function() {
      var $rows = $table.find('tbody tr');
      ok($($rows[0]).attr('id') === 'row1', 'row1 is first');
      ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
      ok($($rows[2]).attr('id') === 'row3', 'row3 is third');
      start();
    });

    $(window).trigger('load');
  });

  test('should sort the table in descending mode on load if <th> has data-sortable-onload="desc" attribute', function() {
    stop();
    var $table = $('<table>' +
      '<thead><tr><th data-toggle="sort" data-sortable-onload="desc" id="headerA">HeaderA</th></tr></thead>' +
      '<tbody>' +
      '<tr id="row2"><td>2</td></tr>' +
      '<tr id="row1"><td>1</td></tr>' +
      '<tr id="row3"><td>3</td></tr>' +
      '</tbody>' +
      '</table>');
    $('#qunit-fixture').append($table);

    $table.on('sorted.sui.sortableTable', function() {
      var $rows = $table.find('tbody tr');
      ok($($rows[0]).attr('id') === 'row3', 'row3 is first');
      ok($($rows[1]).attr('id') === 'row2', 'row2 is second');
      ok($($rows[2]).attr('id') === 'row1', 'row1 is third');
      start();
    });

    $(window).trigger('load');
  });
});
