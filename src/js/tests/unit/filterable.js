$(function() {
  'use strict';

  module('filterable plugin');

  test('should be defined on jquery object', function() {
    ok($(document.body).filterable, 'filterable method is defined');
  });



  module('filterable', {
    setup: function() {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.suiFilterable = $.fn.filterable.noConflict();
    },
    teardown: function() {
      $.fn.filterable = $.fn.suiFilterable;
      delete $.fn.suiFilterable;
    }
  });

  //////////////////
  // Plugin tests //
  //////////////////
  test('should provide no conflict', function() {
    strictEqual($.fn.filterable, undefined, 'filterable was set back to undefined (original value)');
  });

  test('should return jquery collection containing the element', function() {
    var $filterable = $(document).suiFilterable();
    ok($filterable instanceof $, 'returns jquery collection');
    strictEqual($filterable[0], $(document)[0], 'collection contains element');
  });

  /////////////////////////
  // Event related tests //
  /////////////////////////
  test('should fire filter.sui.filterable when filtering is started', function() {
    stop();
    var eventFired = false;

    $(document).on('filter.sui.filterable', function() {
      ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === true, 'div is visible');
      ok(true, 'event fired');
      eventFired = true;
    });

    $('<div data-tags="tag1">')
      .appendTo($('#qunit-fixture'))
      .suiFilterable([{
        'filter-attrib': 'tags',
        'filter-operator': 'subset',
        'filter-value': 'tag2'
      }]);

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'event not fired');
      }
      $(document).off('filter.sui.filterable');
      start();
    }, 100);
  });

  test('should fire filtered.sui.filterable when filtering is finished', function() {
    stop();
    var eventFired = false;

    $(document).on('filter.sui.filterable', function() {
      $(this).on('filtered.sui.filterable', function() {
        ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === false, 'div is visible');
        ok(true, 'event fired');
        eventFired = true;
      });
    });

    $('<div data-tags="tag1">')
      .appendTo($('#qunit-fixture'))
      .suiFilterable([{
        'filter-attrib': 'tags',
        'filter-operator': 'subset',
        'filter-value': 'tag2'
      }]);

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'event not fired');
      }
      $(document)
        .off('filter.sui.filterable')
        .off('filtered.sui.filterable');
      start();
    }, 100);
  });

  test('should fire resetStart.sui.filterable when resetFilter is started', function() {
    stop();
    var eventFired = false;

    $(document).on('resetStart.sui.filterable', function() {
      ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === false, 'div is visible');
      ok(true, 'event fired');
      eventFired = true;
    });

    $('<div data-tags="tag1">')
      .appendTo($('#qunit-fixture'))
      .suiFilterable([{
        'filter-attrib': 'tags',
        'filter-operator': 'subset',
        'filter-value': 'tag2'
      }])
      .suiFilterable('resetFilter');

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'event not fired');
      }
      $(document).off('resetStart.sui.filterable');
      start();
    }, 100);
  });

  test('should fire resetEnd.sui.filterable when resetFilter is finished', function() {
    stop();
    var eventFired = false;

    $(document).on('resetStart.sui.filterable', function() {
      $(this).on('resetEnd.sui.filterable', function() {
        ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === true, 'div is visible');
        ok(true, 'event fired');
        eventFired = true;
      });
    });

    $('<div data-tags="tag1">')
      .appendTo($('#qunit-fixture'))
      .suiFilterable([{
        'filter-attrib': 'tags',
        'filter-operator': 'subset',
        'filter-value': 'tag2'
      }])
      .suiFilterable('resetFilter');

    setTimeout(function() {
      if (!eventFired) {
        ok(false, 'event not fired');
      }
      $(document)
        .off('resetStart.sui.filterable')
        .off('resetEnd.sui.filterable');
      start();
    }, 100);
  });

  test('should not fire any events when called on empty set', function() {
    stop();

    $(document)
      .on('filter.sui.filterable', function() {
        ok(false, 'event filter.sui.filterable fired');
      })
      .on('filtered.sui.filterable', function() {
        ok(false, 'event filtered.sui.filterable fired');
      })
      .on('resetStart.sui.filterable', function() {
        ok(false, 'event resetStart.sui.filterable fired');
      })
      .on('resetEnd.sui.filterable', function() {
        ok(false, 'event resetEnd.sui.filterable fired');
      });

    $('#empty-selector')
      .suiFilterable([{
        'filter-attrib': 'tags',
        'filter-operator': 'subset',
        'filter-value': 'tag2'
      }])
      .suiFilterable('reset');

    setTimeout(function() {
      ok(true, 'allways ok');
      $(document)
        .off('filter.sui.filterable')
        .off('filtered.sui.filterable')
        .off('resetStart.sui.filterable')
        .off('resetEnd.sui.filterable');
      start();
    }, 100);
  });

  //////////////////////////
  // Filter related tests //
  //////////////////////////
  test('should filter elements for: filterValue = [], dataValue = [], operator = "subset"', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-tags=\'["tag1", "tag2"]\'>')
      .append('<div data-tags=\'["tag1", "tag2", "tag3"]\'>')
      .append('<div data-tags=\'["tag1"]\'>');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-tags=\'["tag1", "tag2"]\']').is(':visible') === true, '["tag1", "tag2"] is the same as ["tag1", "tag2"] -> visible');
      ok($('#qunit-fixture div[data-tags=\'["tag1", "tag2", "tag3"]\']').is(':visible') === true, '["tag1", "tag2"] is a subset of ["tag1", "tag2", "tag3"] -> visible');
      ok($('#qunit-fixture div[data-tags=\'["tag1"]\']').is(':visible') === false, '["tag1", "tag2"] is not a subset of ["tag1"] -> hidden');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tags',
      'filter-operator': 'subset',
      'filter-value': ["tag1", "tag2"]
    }]);
  });

  test('should filter elements for: filterValue = [], dataValue = [], operator = "intersect"', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-tags=\'["tag4", "tag5"]\'>')
      .append('<div data-tags=\'["tag1", "tag2", "tag3"]\'>')
      .append('<div data-tags=\'["tag1", "tag4"]\'>');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-tags=\'["tag4", "tag5"]\']').is(':visible') === false, '["tag1", "tag2"] has no common members with ["tag4", "tag5"] -> hidden');
      ok($('#qunit-fixture div[data-tags=\'["tag1", "tag2", "tag3"]\']').is(':visible') === true, '["tag1", "tag2"] has common members with ["tag1", "tag2", "tag3"] -> visible');
      ok($('#qunit-fixture div[data-tags=\'["tag1", "tag4"]\']').is(':visible') === true, '["tag1", "tag2"] has common members with ["tag1", "tag4"] -> visible');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tags',
      'filter-operator': 'intersect',
      'filter-value': ["tag1", "tag2"]
    }]);
  });

  test('should filter elements for: filterValue = string, dataValue = [], operator = "intersect"', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-tags=\'["tag4", "tag5"]\'>')
      .append('<div data-tags=\'["tag1", "tag4"]\'>');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-tags=\'["tag4", "tag5"]\']').is(':visible') === false, '"tag1" is not a member of ["tag4", "tag5"] -> hidden');
      ok($('#qunit-fixture div[data-tags=\'["tag1", "tag4"]\']').is(':visible') === true, '"tag1" is a member of ["tag1", "tag4"] -> visible');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tags',
      'filter-operator': 'intersect',
      'filter-value': 'tag1'
    }]);
  });

  test('should filter elements for: filterValue = [], dataValue = string, operator = "intersect"', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-tags="tag4">')
      .append('<div data-tags="tag1">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-tags="tag4"]').is(':visible') === false, '"tag4" is not a member of ["tag1", "tag2"] -> hidden');
      ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === true, '"tag1" is a member of ["tag1", "tag2"] -> visible');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tags',
      'filter-operator': 'intersect',
      'filter-value': ["tag1", "tag2"]
    }]);
  });

  test('should filter elements for: filterValue = string, dataValue = string, operator = "intersect"', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-tags="tag4">')
      .append('<div data-tags="tag1">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-tags="tag4"]').is(':visible') === false, '"tag4" is not the same as "tag1" -> hidden');
      ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === true, '"tag1" is the same as "tag1"  -> visible');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tags',
      'filter-operator': 'intersect',
      'filter-value': 'tag1'
    }]);
  });

  test('should process numeric filter value weather it is a string or a number', function() {
    stop();
    $('#qunit-fixture').append('<div data-amount="10">');
    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === false, '10 is not the same as "5.5" -> hidden');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '=',
      'filter-value': '5.5'
    }]);

    stop();
    $('#qunit-fixture').append('<div data-amount="10">');
    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === false, '10 is not the same as 5.5 -> hidden');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '=',
      'filter-value': 5.5
    }]);
  });

  test('should filter elements for: filterValue = number, dataValue = number, operator = "="', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-amount="10">')
      .append('<div data-amount="9.57">')
      .append('<div data-amount="9.55">')
      .append('<div data-amount="0">')
      .append('<div data-amount="-10">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === false, '10 is not the same as 0 -> hidden');
      ok($('#qunit-fixture div[data-amount="9.57"]').is(':visible') === false, '9.57 is not the same as 0 -> hidden');
      ok($('#qunit-fixture div[data-amount="9.55"]').is(':visible') === false, '9.55 is not the same as 0 -> hidden');
      ok($('#qunit-fixture div[data-amount="0"]').is(':visible') === true, '0 is the same as 0  -> visible');
      ok($('#qunit-fixture div[data-amount="-10"]').is(':visible') === false, '-10 is not the same as 0 -> hidden');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '=',
      'filter-value': 0
    }]);
  });

  test('should filter elements for: filterValue = number, dataValue = number, operator = "<="', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-amount="10">')
      .append('<div data-amount="9.57">')
      .append('<div data-amount="9.55">')
      .append('<div data-amount="0">')
      .append('<div data-amount="-10">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === false, '10 is not <= 9.55 -> hidden');
      ok($('#qunit-fixture div[data-amount="9.57"]').is(':visible') === false, '9.57 is not <= 9.55 -> hidden');
      ok($('#qunit-fixture div[data-amount="9.55"]').is(':visible') === true, '9.55 <= 9.55 -> visible');
      ok($('#qunit-fixture div[data-amount="0"]').is(':visible') === true, '0 <= 9.55  -> visible');
      ok($('#qunit-fixture div[data-amount="-10"]').is(':visible') === true, '-10 <= 9.55 -> visible');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '<=',
      'filter-value': 9.55
    }]);
  });

  test('should filter elements for: filterValue = number, dataValue = number, operator = ">="', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-amount="10">')
      .append('<div data-amount="9.57">')
      .append('<div data-amount="9.55">')
      .append('<div data-amount="0">')
      .append('<div data-amount="-10">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === true, '10 >= 0 -> visible');
      ok($('#qunit-fixture div[data-amount="9.57"]').is(':visible') === true, '9.57 is not >= 0 -> visible');
      ok($('#qunit-fixture div[data-amount="9.55"]').is(':visible') === true, '9.55 >= 0 -> visible');
      ok($('#qunit-fixture div[data-amount="0"]').is(':visible') === true, '0 >= 0 -> visible');
      ok($('#qunit-fixture div[data-amount="-10"]').is(':visible') === false, '-10 is not >= 0 -> hidden');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '>=',
      'filter-value': 0
    }]);
  });

  test('should filter elements  for: filterValue = number, dataValue = number, operator = "<"', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-amount="10">')
      .append('<div data-amount="9.57">')
      .append('<div data-amount="9.55">')
      .append('<div data-amount="0">')
      .append('<div data-amount="-10">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === false, '10 is not < 7.325 -> hidden');
      ok($('#qunit-fixture div[data-amount="9.57"]').is(':visible') === false, '9.57 is not < 7.325 -> hidden');
      ok($('#qunit-fixture div[data-amount="9.55"]').is(':visible') === false, '9.55 is not < 7.325 -> hidden');
      ok($('#qunit-fixture div[data-amount="0"]').is(':visible') === true, '0 < 7.325 -> visible');
      ok($('#qunit-fixture div[data-amount="-10"]').is(':visible') === true, '-10 < 7.325 -> visible');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '<',
      'filter-value': 7.325
    }]);
  });

  test('should filter elements  for: filterValue = number, dataValue = number, operator = ">"', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-amount="10">')
      .append('<div data-amount="9.57">')
      .append('<div data-amount="9.55">')
      .append('<div data-amount="0">')
      .append('<div data-amount="-10">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === true, '10 > 0.01 -> visible');
      ok($('#qunit-fixture div[data-amount="9.57"]').is(':visible') === true, '9.57 > 0.01 -> visible');
      ok($('#qunit-fixture div[data-amount="9.55"]').is(':visible') === true, '9.55 > 0.01 -> visible');
      ok($('#qunit-fixture div[data-amount="0"]').is(':visible') === false, '0 is not > 0.01 -> hidden');
      ok($('#qunit-fixture div[data-amount="-10"]').is(':visible') === false, '-10 is not > 0.01 -> hidden');
      start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '>',
      'filter-value': 0.01
    }]);
  });

  /////////////////////////
  // Reset related tests //
  /////////////////////////
  test('should show all elements if reset is called', function() {
    stop();
    $('#qunit-fixture').append('<div data-tag="tag1">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-tag="tag1"]').is(':visible') === false, 'the element was hidden');
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tag',
      'filter-operator': 'intersect',
      'filter-value': 'tag2'
    }]);

    $(document).on('resetEnd.sui.filterable', function() {
      $(document).off('resetEnd.sui.filterable');
      ok($('#qunit-fixture div[data-tag="tag1"]').is(':visible') === true, 'all elements were shown');
      start();
    });
    $('#qunit-fixture div').suiFilterable('resetFilter');
  });

  ////////////////////////////
  // Data-api related tests //
  ////////////////////////////
  test('should filter filterables by changing an element in the filter form', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-tag="tag1">')
      .append('<form data-target="#qunit-fixture div[data-tag=tag1]">' +
        '<input type="text" data-toggle="filter" data-filter-attrib="tag" data-filter-operator="=" value="" />' +
        '</form>');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      ok($('#qunit-fixture div[data-tag="tag1"]').is(':visible') === false, 'the filter was triggered');
      start();
    });
    $('#qunit-fixture input').val('tag2').change();
  });

  test('should reset filterables by clicking on reset element', function() {
    stop();
    $('#qunit-fixture')
      .append('<div data-tag="tag1">')
      .append('<form data-target="#qunit-fixture div[data-tag=tag1]">' +
        '<input type="text" data-toggle="filter" data-filter-attrib="tag" data-filter-operator="=" value="" />' +
        '<button type="reset" data-toggle="filter-reset" />' +
        '</form>');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      $(document).on('resetEnd.sui.filterable', function() {
        $(document).off('resetEnd.sui.filterable');
        ok($('#qunit-fixture div[data-tag="tag1"]').is(':visible') === true, 'the filter was reset');
        console.log($('#qunit-fixture input').val());
        ok(!$('#qunit-fixture input').val(), 'the filter form was reset');
        start();
      });
      ok($('#qunit-fixture div[data-tag="tag1"]').is(':visible') === false, 'the filter was triggered');
    });
    $('#qunit-fixture input').val('tag2').change();
    $('#qunit-fixture button').click();
  });

});
