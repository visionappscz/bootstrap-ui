$(function() {
  'use strict';

  QUnit.module('filterable plugin');

  QUnit.test('should be defined on jquery object', function() {
    QUnit.ok($(document.body).filterable, 'filterable method is defined');
  });

  QUnit.module('filterable', {
    setup: function() {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.suiFilterable = $.fn.filterable.noConflict();
    },

    teardown: function() {
      $.fn.filterable = $.fn.suiFilterable;
      delete $.fn.suiFilterable;
    }
  });

  // Plugin tests
  // ============

  QUnit.test('should provide no conflict', function() {
    QUnit.strictEqual($.fn.filterable, undefined, 'filterable was set back to undefined (original value)');
  });

  QUnit.test('should return jquery collection containing the element', function() {
    var $filterable = $(document).suiFilterable();
    QUnit.ok($filterable instanceof $, 'returns jquery collection');
    QUnit.strictEqual($filterable[0], $(document)[0], 'collection contains element');
  });

  // Event related tests
  // ===================
  QUnit.test('should fire filter.sui.filterable when filtering is started', function() {
    QUnit.stop();
    var eventFired = false;

    $(document).on('filter.sui.filterable', function() {
      QUnit.ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === true, 'div is visible');
      QUnit.ok(true, 'event fired');
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
        QUnit.ok(false, 'event not fired');
      }

      $(document).off('filter.sui.filterable');
      QUnit.start();
    }, 100);
  });

  QUnit.test('should fire filtered.sui.filterable when filtering is finished', function() {
    QUnit.stop();
    var eventFired = false;

    $(document).on('filter.sui.filterable', function() {
      $(this).on('filtered.sui.filterable', function() {
        QUnit.ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === false, 'div is visible');
        QUnit.ok(true, 'event fired');
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
        QUnit.ok(false, 'event not fired');
      }

      $(document)
        .off('filter.sui.filterable')
        .off('filtered.sui.filterable');
      QUnit.start();
    }, 100);
  });

  QUnit.test('should fire resetStart.sui.filterable when reset is invoked', function() {
    QUnit.stop();
    var eventFired = false;

    $(document).on('resetStart.sui.filterable', function() {
      QUnit.ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === false, 'div is visible');
      QUnit.ok(true, 'event fired');
      eventFired = true;
    });

    $('<div data-tags="tag1">')
      .appendTo($('#qunit-fixture'))
      .suiFilterable([{
        'filter-attrib': 'tags',
        'filter-operator': 'subset',
        'filter-value': 'tag2'
      }])
      .suiFilterable('reset');

    setTimeout(function() {
      if (!eventFired) {
        QUnit.ok(false, 'event not fired');
      }

      $(document).off('resetStart.sui.filterable');
      QUnit.start();
    }, 100);
  });

  QUnit.test('should fire resetEnd.sui.filterable when reset is invoked', function() {
    QUnit.stop();
    var eventFired = false;

    $(document).on('resetStart.sui.filterable', function() {
      $(this).on('resetEnd.sui.filterable', function() {
        QUnit.ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === true, 'div is visible');
        QUnit.ok(true, 'event fired');
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
      .suiFilterable('reset');

    setTimeout(function() {
      if (!eventFired) {
        QUnit.ok(false, 'event not fired');
      }

      $(document)
        .off('resetStart.sui.filterable')
        .off('resetEnd.sui.filterable');
      QUnit.start();
    }, 100);
  });

  QUnit.test('should not fire any events when called on empty set', function() {
    QUnit.stop();

    $(document)
      .on('filter.sui.filterable', function() {
        QUnit.ok(false, 'event filter.sui.filterable fired');
      })
      .on('filtered.sui.filterable', function() {
        QUnit.ok(false, 'event filtered.sui.filterable fired');
      })
      .on('resetStart.sui.filterable', function() {
        QUnit.ok(false, 'event resetStart.sui.filterable fired');
      })
      .on('resetEnd.sui.filterable', function() {
        QUnit.ok(false, 'event resetEnd.sui.filterable fired');
      });

    $('#empty-selector')
      .suiFilterable([{
        'filter-attrib': 'tags',
        'filter-operator': 'subset',
        'filter-value': 'tag2'
      }])
      .suiFilterable('reset');

    setTimeout(function() {
      QUnit.ok(true, 'allways ok');
      $(document)
        .off('filter.sui.filterable')
        .off('filtered.sui.filterable')
        .off('resetStart.sui.filterable')
        .off('resetEnd.sui.filterable');
      QUnit.start();
    }, 100);
  });

  // Filter related tests
  // ====================
  QUnit.test('should filter elements for: filterValue = [], dataValue = [], operator = "subset"', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div data-tags=\'["tag1", "tag2"]\'>')
      .append('<div data-tags=\'["tag1", "tag2", "tag3"]\'>')
      .append('<div data-tags=\'["tag1"]\'>');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-tags=\'["tag1", "tag2"]\']').is(':visible') === true, '["tag1", "tag2"] is the same as ["tag1", "tag2"] -> visible');
      QUnit.ok($('#qunit-fixture div[data-tags=\'["tag1", "tag2", "tag3"]\']').is(':visible') === true, '["tag1", "tag2"] is a subset of ["tag1", "tag2", "tag3"] -> visible');
      QUnit.ok($('#qunit-fixture div[data-tags=\'["tag1"]\']').is(':visible') === false, '["tag1", "tag2"] is not a subset of ["tag1"] -> hidden');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tags',
      'filter-operator': 'subset',
      'filter-value': ['tag1', 'tag2']
    }]);
  });

  QUnit.test('should filter elements for: filterValue = [], dataValue = [], operator = "intersect"', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div data-tags=\'["tag4", "tag5"]\'>')
      .append('<div data-tags=\'["tag1", "tag2", "tag3"]\'>')
      .append('<div data-tags=\'["tag1", "tag4"]\'>');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-tags=\'["tag4", "tag5"]\']').is(':visible') === false, '["tag1", "tag2"] has no common members with ["tag4", "tag5"] -> hidden');
      QUnit.ok($('#qunit-fixture div[data-tags=\'["tag1", "tag2", "tag3"]\']').is(':visible') === true, '["tag1", "tag2"] has common members with ["tag1", "tag2", "tag3"] -> visible');
      QUnit.ok($('#qunit-fixture div[data-tags=\'["tag1", "tag4"]\']').is(':visible') === true, '["tag1", "tag2"] has common members with ["tag1", "tag4"] -> visible');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tags',
      'filter-operator': 'intersect',
      'filter-value': ['tag1', 'tag2']
    }]);
  });

  QUnit.test('should filter elements for: filterValue = string, dataValue = [], operator = "intersect"', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div data-tags=\'["tag4", "tag5"]\'>')
      .append('<div data-tags=\'["tag1", "tag4"]\'>');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-tags=\'["tag4", "tag5"]\']').is(':visible') === false, '"tag1" is not a member of ["tag4", "tag5"] -> hidden');
      QUnit.ok($('#qunit-fixture div[data-tags=\'["tag1", "tag4"]\']').is(':visible') === true, '"tag1" is a member of ["tag1", "tag4"] -> visible');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tags',
      'filter-operator': 'intersect',
      'filter-value': 'tag1'
    }]);
  });

  QUnit.test('should filter elements for: filterValue = [], dataValue = string, operator = "intersect"', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div data-tags="tag4">')
      .append('<div data-tags="tag1">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-tags="tag4"]').is(':visible') === false, '"tag4" is not a member of ["tag1", "tag2"] -> hidden');
      QUnit.ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === true, '"tag1" is a member of ["tag1", "tag2"] -> visible');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tags',
      'filter-operator': 'intersect',
      'filter-value': ['tag1', 'tag2']
    }]);
  });

  QUnit.test('should filter elements for: filterValue = string, dataValue = string, operator = "intersect"', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div data-tags="tag4">')
      .append('<div data-tags="tag1">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-tags="tag4"]').is(':visible') === false, '"tag4" is not the same as "tag1" -> hidden');
      QUnit.ok($('#qunit-fixture div[data-tags="tag1"]').is(':visible') === true, '"tag1" is the same as "tag1"  -> visible');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tags',
      'filter-operator': 'intersect',
      'filter-value': 'tag1'
    }]);
  });

  QUnit.test('should filter elements for: filterValue = [], dataValue = [], operator = "intersect" - case insensitive test', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div data-tags=\'["tag4", "tag5"]\'>')
      .append('<div data-tags=\'["Tag1", "tag2", "tag3"]\'>')
      .append('<div data-tags=\'["Tag1", "tag4"]\'>');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-tags=\'["tag4", "tag5"]\']').is(':visible') === false, '["tag1", "tag2"] has no common members with ["tag4", "tag5"] -> hidden');
      QUnit.ok($('#qunit-fixture div[data-tags=\'["Tag1", "tag2", "tag3"]\']').is(':visible') === true, '["tag1", "tag2"] has common members with ["tag1", "tag2", "tag3"] -> visible');
      QUnit.ok($('#qunit-fixture div[data-tags=\'["Tag1", "tag4"]\']').is(':visible') === true, '["tag1", "tag2"] has common members with ["tag1", "tag4"] -> visible');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tags',
      'filter-operator': 'intersect',
      'filter-value': ['Tag1', 'Tag2']
    }]);
  });

  QUnit.test('should process numeric filter value weather it is a string or a number', function() {
    QUnit.stop();
    $('#qunit-fixture').append('<div data-amount="10">');
    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === false, '10 is not the same as "5.5" -> hidden');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '=',
      'filter-value': '5.5'
    }]);

    QUnit.stop();
    $('#qunit-fixture').append('<div data-amount="10">');
    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === false, '10 is not the same as 5.5 -> hidden');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '=',
      'filter-value': 5.5
    }]);
  });

  QUnit.test('should filter elements for: filterValue = number, dataValue = number, operator = "="', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div data-amount="10">')
      .append('<div data-amount="9.57">')
      .append('<div data-amount="9.55">')
      .append('<div data-amount="0">')
      .append('<div data-amount="-10">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === false, '10 is not the same as 0 -> hidden');
      QUnit.ok($('#qunit-fixture div[data-amount="9.57"]').is(':visible') === false, '9.57 is not the same as 0 -> hidden');
      QUnit.ok($('#qunit-fixture div[data-amount="9.55"]').is(':visible') === false, '9.55 is not the same as 0 -> hidden');
      QUnit.ok($('#qunit-fixture div[data-amount="0"]').is(':visible') === true, '0 is the same as 0  -> visible');
      QUnit.ok($('#qunit-fixture div[data-amount="-10"]').is(':visible') === false, '-10 is not the same as 0 -> hidden');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '=',
      'filter-value': 0
    }]);
  });

  QUnit.test('should filter elements for: filterValue = number, dataValue = number, operator = "<="', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div data-amount="10">')
      .append('<div data-amount="9.57">')
      .append('<div data-amount="9.55">')
      .append('<div data-amount="0">')
      .append('<div data-amount="-10">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === false, '10 is not <= 9.55 -> hidden');
      QUnit.ok($('#qunit-fixture div[data-amount="9.57"]').is(':visible') === false, '9.57 is not <= 9.55 -> hidden');
      QUnit.ok($('#qunit-fixture div[data-amount="9.55"]').is(':visible') === true, '9.55 <= 9.55 -> visible');
      QUnit.ok($('#qunit-fixture div[data-amount="0"]').is(':visible') === true, '0 <= 9.55  -> visible');
      QUnit.ok($('#qunit-fixture div[data-amount="-10"]').is(':visible') === true, '-10 <= 9.55 -> visible');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '<=',
      'filter-value': 9.55
    }]);
  });

  QUnit.test('should filter elements for: filterValue = number, dataValue = number, operator = ">="', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div data-amount="10">')
      .append('<div data-amount="9.57">')
      .append('<div data-amount="9.55">')
      .append('<div data-amount="0">')
      .append('<div data-amount="-10">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === true, '10 >= 0 -> visible');
      QUnit.ok($('#qunit-fixture div[data-amount="9.57"]').is(':visible') === true, '9.57 is not >= 0 -> visible');
      QUnit.ok($('#qunit-fixture div[data-amount="9.55"]').is(':visible') === true, '9.55 >= 0 -> visible');
      QUnit.ok($('#qunit-fixture div[data-amount="0"]').is(':visible') === true, '0 >= 0 -> visible');
      QUnit.ok($('#qunit-fixture div[data-amount="-10"]').is(':visible') === false, '-10 is not >= 0 -> hidden');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '>=',
      'filter-value': 0
    }]);
  });

  QUnit.test('should filter elements  for: filterValue = number, dataValue = number, operator = "<"', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div data-amount="10">')
      .append('<div data-amount="9.57">')
      .append('<div data-amount="9.55">')
      .append('<div data-amount="0">')
      .append('<div data-amount="-10">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === false, '10 is not < 7.325 -> hidden');
      QUnit.ok($('#qunit-fixture div[data-amount="9.57"]').is(':visible') === false, '9.57 is not < 7.325 -> hidden');
      QUnit.ok($('#qunit-fixture div[data-amount="9.55"]').is(':visible') === false, '9.55 is not < 7.325 -> hidden');
      QUnit.ok($('#qunit-fixture div[data-amount="0"]').is(':visible') === true, '0 < 7.325 -> visible');
      QUnit.ok($('#qunit-fixture div[data-amount="-10"]').is(':visible') === true, '-10 < 7.325 -> visible');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '<',
      'filter-value': 7.325
    }]);
  });

  QUnit.test('should filter elements  for: filterValue = number, dataValue = number, operator = ">"', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div data-amount="10">')
      .append('<div data-amount="9.57">')
      .append('<div data-amount="9.55">')
      .append('<div data-amount="0">')
      .append('<div data-amount="-10">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-amount="10"]').is(':visible') === true, '10 > 0.01 -> visible');
      QUnit.ok($('#qunit-fixture div[data-amount="9.57"]').is(':visible') === true, '9.57 > 0.01 -> visible');
      QUnit.ok($('#qunit-fixture div[data-amount="9.55"]').is(':visible') === true, '9.55 > 0.01 -> visible');
      QUnit.ok($('#qunit-fixture div[data-amount="0"]').is(':visible') === false, '0 is not > 0.01 -> hidden');
      QUnit.ok($('#qunit-fixture div[data-amount="-10"]').is(':visible') === false, '-10 is not > 0.01 -> hidden');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'amount',
      'filter-operator': '>',
      'filter-value': 0.01
    }]);
  });

  QUnit.test('should filter by multiple filter objects', function() {
    QUnit.stop();
    $('#qunit-fixture')
      .append('<div id="div1" data-tags="tag1" data-groups="group1"/>')
      .append('<div id="div2" data-tags="tag1" data-groups="group2"/>')
      .append('<div id="div3" data-tags="tag3" data-groups="group2"/>');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#div1').is(':hidden'), '"div1" is not "group2" -> hidden');
      QUnit.ok($('#div2').is(':visible'), '"tag2" is both "tag1" and "group2"  -> visible');
      QUnit.ok($('#div3').is(':hidden'), '"div3" is not "tag1" -> hidden');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable([
      {
        'filter-attrib': 'tags',
        'filter-operator': 'intersect',
        'filter-value': 'tag1'
      },
      {
        'filter-attrib': 'groups',
        'filter-operator': 'intersect',
        'filter-value': 'group2'
      }
    ]);
  });

  // Reset related tests
  // ===================
  QUnit.test('should show all elements if reset is invoked', function() {
    QUnit.stop();
    $('#qunit-fixture').append('<div data-tag="tag1">');

    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-tag="tag1"]').is(':visible') === false, 'the element was hidden');
    });

    $('#qunit-fixture div').suiFilterable([{
      'filter-attrib': 'tag',
      'filter-operator': 'intersect',
      'filter-value': 'tag2'
    }]);

    $(document).on('resetEnd.sui.filterable', function() {
      $(document).off('resetEnd.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-tag="tag1"]').is(':visible') === true, 'all elements were shown');
      QUnit.start();
    });

    $('#qunit-fixture div').suiFilterable('reset');
  });

  // Data-api tests
  // ==============
  QUnit.test('should filter filterables by changing an element in the appropriate filter form on key up', function() {
    QUnit.stop();

    // Two forms are defined to ensue that the second one doesnt interfere
    $('#qunit-fixture').html('<div data-tag="tag1">Tag 1</div>' +
      '<form data-filter-target="#qunit-fixture div[data-tag=tag1]">' +
      '<input id="control" type="text" data-toggle="filter" data-filter-attrib="tag" data-filter-operator="intersect" />' +
      '</form>' +
      '<div data-tag="tag2">Tag 2</div>' +
      '<form data-filter-target="#qunit-fixture div[data-tag=tag2]">' +
      '<input type="text" data-toggle="filter" data-filter-attrib="tag" data-filter-operator="intersect" />' +
      '</form>');

    $(document).on('filtered.sui.filterable', function() {
      QUnit.ok($('#qunit-fixture div[data-tag="tag1"]').is(':hidden'), 'tag 1 was hidden');
      QUnit.ok($('#qunit-fixture div[data-tag="tag2"]').is(':visible'), 'tag 2 is visible');
    });

    $('#control').val('tag2').keyup();

    setTimeout(function() {
      $(document).off('filtered.sui.filterable');
      QUnit.start();
    }, 100);
  });

  QUnit.test('should filter filterables by changing an element in the appropriate filter form on change', function() {
    QUnit.stop();

    // Two forms are defined to ensue that the second one doesnt interfere
    $('#qunit-fixture').html('<div data-tag="tag1">Tag 1</div>' +
    '<form data-filter-target="#qunit-fixture div[data-tag=tag1]">' +
    '<input id="control" type="text" data-toggle="filter" data-filter-attrib="tag" data-filter-operator="intersect" />' +
    '</form>' +
    '<div data-tag="tag2">Tag 2</div>' +
    '<form data-filter-target="#qunit-fixture div[data-tag=tag2]">' +
    '<input type="text" data-toggle="filter" data-filter-attrib="tag" data-filter-operator="intersect" />' +
    '</form>');

    $(document).on('filtered.sui.filterable', function() {
      QUnit.ok($('#qunit-fixture div[data-tag="tag1"]').is(':hidden'), 'tag 1 was hidden');
      QUnit.ok($('#qunit-fixture div[data-tag="tag2"]').is(':visible'), 'tag 2 is visible');
    });

    $('#control').val('tag2').change();

    setTimeout(function() {
      $(document).off('filtered.sui.filterable');
      QUnit.start();
    }, 100);
  });

  QUnit.test('should reset filterables by clicking on reset element', function() {
    QUnit.stop();

    // Two forms are defined to ensue that the second one doesnt interfere
    $('#qunit-fixture').html('<div data-tag="tag1">Tag 1</div>' +
      '<form id="form-1" data-filter-target="#qunit-fixture div[data-tag=tag1]">' +
      '<input id="control-1" type="text" data-toggle="filter" data-filter-attrib="tag" data-filter-operator="intersect" />' +
      '<button type="reset" data-toggle="filter-reset" />' +
      '</form>' +
      '<div data-tag="tag2">Tag 2</div>' +
      '<form data-filter-target="#qunit-fixture div[data-tag=tag2]">' +
      '<input id="control-2" type="text" data-toggle="filter" data-filter-attrib="tag" data-filter-operator="intersect" />' +
      '<button type="reset" data-toggle="filter-reset" />' +
      '</form>');

    $('#control-2').val('tag1').change();
    $(document).on('filtered.sui.filterable', function() {
      $(document).on('resetEnd.sui.filterable', function() {
        QUnit.ok($('#qunit-fixture div[data-tag="tag1"]').is(':visible'), 'tag 1 was shown again');
        QUnit.ok(!$('#control-1').val(), 'the control-1 form was reset');
        QUnit.ok($('#qunit-fixture div[data-tag="tag2"]').is(':hidden'), 'tag 2 remained hidden');
        QUnit.ok($('#control-2').val(), 'the control-2 form was not reset');
      });
    });

    $('#control-1').val('tag2').keyup();
    $('#form-1 button').click();

    setTimeout(function() {
      $(document).off('filtered.sui.filterable');
      $(document).off('resetEnd.sui.filterable');
      QUnit.start();
    }, 100);
  });

  QUnit.test('empty value should match all, that is reset the filter field', function() {
    QUnit.stop();

    $('#qunit-fixture').html('<div data-tag="tag1">Tag 1</div>' +
      '<form id="form-1" data-filter-target="#qunit-fixture div[data-tag=tag1]">' +
      '<input id="control-1" type="text" data-toggle="filter" data-filter-attrib="tag" data-filter-operator="intersect" />' +
      '</form>');

    $('#control-1').val('x').keyup();
    $(document).on('filtered.sui.filterable', function() {
      $(document).off('filtered.sui.filterable');
      QUnit.ok($('#qunit-fixture div[data-tag="tag1"]').is(':visible'), '"div1" was not hidden');
      QUnit.start();
    });

    $('#control-1').val('').change();
  });

});
