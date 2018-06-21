describe('Filterable plugin', function () {

  beforeEach(function () {
    $.fn.buiFilterable = $.fn.filterable.noConflict();
  });

  afterEach(function () {
    $.fn.filterable = $.fn.buiFilterable;
    delete $.fn.buiFilterable;
    mocha.clearFixture();
  });

  describe('Initialization tests', function () {
    it('should be defined on jquery object', function () {
      assert.isOk($(document.body).buiFilterable, 'confirmation method is defined');
    });
  });

  describe('Plugin tests', function () {
    it('should provide no conflict', function () {
      assert.strictEqual(
        $.fn.filterable,
        undefined,
        'filterable was set back to undefined (original value)'
      );
    });

    it('should return jquery collection containing the element', function () {
      var $filterable = $(document).buiFilterable();
      assert.isOk($filterable instanceof $, 'returns jquery collection');
      assert.strictEqual($filterable[0], $(document)[0], 'collection contains element');
    });
  });

  describe('Event related tests', function () {
    it('should fire filter.bui.filterable when filtering is started', function (done) {
      var eventFired = false;

      $(document).on('filter.bui.filterable', function () {
        assert.isOk(
          $('#mocha-fixture div[data-tags="tag1"]').is(':visible'),
          'div is visible');
        assert.isOk(true, 'event fired'
        );
        eventFired = true;
      });

      $('<div data-tags="tag1">')
        .appendTo($('#mocha-fixture'))
        .buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'subset',
            'filter-value': 'tag2',
          },
        ]);

      setTimeout(function () {
        if (!eventFired) {
          assert.isOk(false, 'event not fired');
        }

        $(document).off('filter.bui.filterable');
        done();
      }, 100);
    });

    it('should fire filtered.bui.filterable when filtering is finished', function (done) {
      var eventFired = false;

      $(document).on('filter.bui.filterable', function () {
        $(this).on('filtered.bui.filterable', function () {
          assert.isNotOk(
            $('#mocha-fixture div[data-tags="tag1"]').is(':visible'),
            'div is visible'
          );
          assert.isOk(true, 'event fired');
          eventFired = true;
        });
      });

      $('<div data-tags="tag1">')
        .appendTo($('#mocha-fixture'))
        .buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'subset',
            'filter-value': 'tag2',
          },
        ]);

      setTimeout(function () {
        if (!eventFired) {
          assert.isOk(false, 'event not fired');
        }

        $(document)
          .off('filter.bui.filterable')
          .off('filtered.bui.filterable');
        done();
      }, 100);
    });

    it('should fire resetStart.bui.filterable when reset is invoked', function (done) {
      var eventFired = false;

      $(document).on('resetStart.bui.filterable', function () {
        assert.isNotOk(
          $('#mocha-fixture div[data-tags="tag1"]').is(':visible'),
          'div is visible'
        );
        assert.isOk(true, 'event fired');
        eventFired = true;
      });

      $('<div data-tags="tag1">')
        .appendTo($('#mocha-fixture'))
        .buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'subset',
            'filter-value': 'tag2',
          },
        ])
        .buiFilterable('reset');

      setTimeout(function () {
        if (!eventFired) {
          assert.isOk(false, 'event not fired');
        }

        $(document).off('resetStart.bui.filterable');
        done();
      }, 100);
    });

    it('should fire resetEnd.bui.filterable when reset is invoked', function (done) {
      var eventFired = false;

      $(document).on('resetStart.bui.filterable', function () {
        $(this).on('resetEnd.bui.filterable', function () {
          assert.isOk(
            $('#mocha-fixture div[data-tags="tag1"]').is(':visible'),
            'div is visible'
          );
          assert.isOk(true, 'event fired');
          eventFired = true;
        });
      });

      $('<div data-tags="tag1">')
        .appendTo($('#mocha-fixture'))
        .buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'subset',
            'filter-value': 'tag2',
          },
        ])
        .buiFilterable('reset');

      setTimeout(function () {
        if (!eventFired) {
          assert.isOk(false, 'event not fired');
        }

        $(document)
          .off('resetStart.bui.filterable')
          .off('resetEnd.bui.filterable');
        done();
      }, 100);
    });

    it('should not fire any events when called on empty set', function (done) {
      $(document)
        .on('filter.bui.filterable', function () {
          assert.isOk(false, 'event filter.bui.filterable fired');
        })
        .on('filtered.bui.filterable', function () {
          assert.isOk(false, 'event filtered.bui.filterable fired');
        })
        .on('resetStart.bui.filterable', function () {
          assert.isOk(false, 'event resetStart.bui.filterable fired');
        })
        .on('resetEnd.bui.filterable', function () {
          assert.isOk(false, 'event resetEnd.bui.filterable fired');
        });

      $('#empty-selector')
        .buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'subset',
            'filter-value': 'tag2',
          },
        ])
        .buiFilterable('reset');

      setTimeout(function () {
        assert.isOk(true, 'allways ok');
        $(document)
          .off('filter.bui.filterable')
          .off('filtered.bui.filterable')
          .off('resetStart.bui.filterable')
          .off('resetEnd.bui.filterable');
        done();
      }, 100);
    });

  });

  describe('Filter related tests', function () {
    it(
      'should filter elements for: filterValue = [], dataValue = [], operator = "subset"',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-tags=\'["tag1", "tag2"]\'>')
          .append('<div data-tags=\'["tag1", "tag2", "tag3"]\'>')
          .append('<div data-tags=\'["tag1"]\'>');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["tag1", "tag2"]\']').is(':visible'),
            '["tag1", "tag2"] is the same as ["tag1", "tag2"] -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["tag1", "tag2", "tag3"]\']').is(':visible'),
            '["tag1", "tag2"] is a subset of ["tag1", "tag2", "tag3"] -> visible'
          );
          assert.isNotOk(
            $('#mocha-fixture div[data-tags=\'["tag1"]\']').is(':visible'),
            '["tag1", "tag2"] is not a subset of ["tag1"] -> hidden'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'subset',
            'filter-value': ['tag1', 'tag2'],
          },
        ]);
      }
    );

    it(
      'should filter elements for: filterValue = [], dataValue = [], ' +
      'operator = "intersect", strict = false',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-tags=\'["tag4", "tag5"]\'>')
          .append('<div data-tags=\'["tag1", "tag2", "tag3"]\'>')
          .append('<div data-tags=\'["tag1", "tag4"]\'>');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-tags=\'["tag4", "tag5"]\']').is(':visible'),
            '["tag1", "tag2"] has no common members with ["tag4", "tag5"] -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["tag1", "tag2", "tag3"]\']').is(':visible'),
            '["tag1", "tag2"] has common members with ["tag1", "tag2", "tag3"] -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["tag1", "tag4"]\']').is(':visible'),
            '["tag1", "tag2"] has common members with ["tag1", "tag4"] -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'intersect',
            'filter-value': ['1', '2'],
          },
        ]);
      }
    );

    it(
      'should filter elements for: filterValue = string, dataValue = [], ' +
      'operator = "intersect", strict = false',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-tags=\'["tag4", "tag5"]\'>')
          .append('<div data-tags=\'["tag1", "tag4"]\'>');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-tags=\'["tag4", "tag5"]\']').is(':visible'),
            '"tag1" is not a member of ["tag4", "tag5"] -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["tag1", "tag4"]\']').is(':visible'),
            '"tag1" is a member of ["tag1", "tag4"] -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'intersect',
            'filter-value': '1',
          },
        ]);
      }
    );

    it(
      'should filter elements for: filterValue = [], dataValue = string, ' +
      'operator = "intersect", strict = false',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-tags="tag4">')
          .append('<div data-tags="tag1">');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-tags="tag4"]').is(':visible'),
            '"tag4" is not a member of ["tag1", "tag2"] -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags="tag1"]').is(':visible'),
            '"tag1" is a member of ["tag1", "tag2"] -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'intersect',
            'filter-value': ['1', '2'],
          },
        ]);
      }
    );

    it(
      'should filter elements for: filterValue = string, ' +
      'dataValue = string, operator = "intersect", strict = false',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-tags="tag4">')
          .append('<div data-tags="tag1">');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-tags="tag4"]').is(':visible'),
            '"tag4" is not the same as "tag1" -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags="tag1"]').is(':visible'),
            '"tag1" is the same as "tag1"  -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'intersect',
            'filter-value': '1',
          },
        ]);
      }
    );

    it(
      'should filter elements for: filterValue = [], dataValue = [], ' +
      'operator = "intersect", strict = true',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-tags=\'["tag4", "tag5"]\'>')
          .append('<div data-tags=\'["tag1", "tag2", "tag3"]\'>')
          .append('<div data-tags=\'["tag1", "tag4"]\'>');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-tags=\'["tag4", "tag5"]\']').is(':visible'),
            '["tag1", "tag2"] has no common members with ["tag4", "tag5"] -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["tag1", "tag2", "tag3"]\']').is(':visible'),
            '["tag1", "tag2"] has common members with ["tag1", "tag2", "tag3"] -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["tag1", "tag4"]\']').is(':visible'),
            '["tag1", "tag2"] has common members with ["tag1", "tag4"] -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'intersect',
            'filter-strict': true,
            'filter-value': ['tag1', 'tag2'],
          },
        ]);
      }
    );

    it(
      'should filter elements for: filterValue = string, dataValue = [], ' +
      'operator = "intersect", strict = true',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-tags=\'["tag4", "tag5"]\'>')
          .append('<div data-tags=\'["tag1", "tag4"]\'>');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-tags=\'["tag4", "tag5"]\']').is(':visible'),
            '"tag1" is not a member of ["tag4", "tag5"] -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["tag1", "tag4"]\']').is(':visible'),
            '"tag1" is a member of ["tag1", "tag4"] -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'intersect',
            'filter-strict': true,
            'filter-value': 'tag1',
          },
        ]);
      }
    );

    it(
      'should filter elements for: filterValue = [], dataValue = string, ' +
      'operator = "intersect", strict = true',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-tags="tag4">')
          .append('<div data-tags="tag1">');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-tags="tag4"]').is(':visible'),
            '"tag4" is not a member of ["tag1", "tag2"] -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags="tag1"]').is(':visible'),
            '"tag1" is a member of ["tag1", "tag2"] -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'intersect',
            'filter-strict': true,
            'filter-value': ['tag1', 'tag2'],
          },
        ]);
      }
    );

    it(
      'should filter elements for: filterValue = string, ' +
      'dataValue = string, operator = "intersect", strict = true',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-tags="tag4">')
          .append('<div data-tags="tag1">');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-tags="tag4"]').is(':visible'),
            '"tag4" is not the same as "tag1" -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags="tag1"]').is(':visible'),
            '"tag1" is the same as "tag1"  -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'intersect',
            'filter-strict': true,
            'filter-value': 'tag1',
          },
        ]);
      }
    );

    it(
      'should filter elements for: filterValue = [], ' +
      'dataValue = [], operator = "intersect" - case insensitive test, strict = true',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-tags=\'["tag4", "tag5"]\'>')
          .append('<div data-tags=\'["Tag1", "tag2", "tag3"]\'>')
          .append('<div data-tags=\'["Tag1", "tag4"]\'>');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-tags=\'["tag4", "tag5"]\']').is(':visible'),
            '["tag1", "tag2"] has no common members with ["tag4", "tag5"] -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["Tag1", "tag2", "tag3"]\']').is(':visible'),
            '["tag1", "tag2"] has common members with ["tag1", "tag2", "tag3"] -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["Tag1", "tag4"]\']').is(':visible'),
            '["tag1", "tag2"] has common members with ["tag1", "tag4"] -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'intersect',
            'filter-strict': true,
            'filter-value': ['Tag1', 'Tag2'],
          },
        ]);
      }
    );

    it(
      'should filter elements for: filterValue = [], ' +
      'dataValue = [], operator = "intersect" - case insensitive test, strict = true',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-tags=\'["tag4", "tag5"]\'>')
          .append('<div data-tags=\'["Tag1", "tag2", "tag3"]\'>')
          .append('<div data-tags=\'["Tag1", "tag4"]\'>');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-tags=\'["tag4", "tag5"]\']').is(':visible'),
            '["tag1", "tag2"] has no common members with ["tag4", "tag5"] -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["Tag1", "tag2", "tag3"]\']').is(':visible'),
            '["tag1", "tag2"] has common members with ["tag1", "tag2", "tag3"] -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tags=\'["Tag1", "tag4"]\']').is(':visible'),
            '["tag1", "tag2"] has common members with ["tag1", "tag4"] -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'tags',
            'filter-operator': 'intersect',
            'filter-strict': true,
            'filter-value': ['Tag1', 'Tag2'],
          },
        ]);
      }
    );

    it('should process numeric filter value weather it is a string or a number', function (done) {
      var internalDoneCalled = false;
      var internalDone = function () {
        if (internalDoneCalled) {
          done();
        }

        internalDoneCalled = true;
      };

      $('#mocha-fixture').append('<div data-amount="10">');
      $(document).on('filtered.bui.filterable', function () {
        $(document).off('filtered.bui.filterable');
        assert.isNotOk(
          $('#mocha-fixture div[data-amount="10"]').is(':visible'),
          '10 is not the same as "5.5" -> hidden'
        );
        internalDone();
      });

      $('#mocha-fixture div').buiFilterable([
        {
          'filter-attrib': 'amount',
          'filter-operator': '=',
          'filter-value': '5.5',
        },
      ]);

      $('#mocha-fixture').append('<div data-amount="10">');
      $(document).on('filtered.bui.filterable', function () {
        $(document).off('filtered.bui.filterable');
        assert.isNotOk(
          $('#mocha-fixture div[data-amount="10"]').is(':visible'),
          '10 is not the same as 5.5 -> hidden'
        );
        internalDone();
      });

      $('#mocha-fixture div').buiFilterable([
        {
          'filter-attrib': 'amount',
          'filter-operator': '=',
          'filter-value': 5.5,
        },
      ]);
    });

    it(
      'should filter elements for: filterValue = number, dataValue = number, operator = "="',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-amount="10">')
          .append('<div data-amount="9.57">')
          .append('<div data-amount="9.55">')
          .append('<div data-amount="0">')
          .append('<div data-amount="-10">');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="10"]').is(':visible'),
            '10 is not the same as 0 -> hidden'
          );
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="9.57"]').is(':visible'),
            '9.57 is not the same as 0 -> hidden'
          );
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="9.55"]').is(':visible'),
            '9.55 is not the same as 0 -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-amount="0"]').is(':visible'),
            '0 is the same as 0  -> visible'
          );
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="-10"]').is(':visible'),
            '-10 is not the same as 0 -> hidden'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'amount',
            'filter-operator': '=',
            'filter-value': 0,
          },
        ]);
      });

    it(
      'should filter elements for: filterValue = number, dataValue = number, operator = "<="',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-amount="10">')
          .append('<div data-amount="9.57">')
          .append('<div data-amount="9.55">')
          .append('<div data-amount="0">')
          .append('<div data-amount="-10">');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="10"]').is(':visible'),
            '10 is not <= 9.55 -> hidden'
          );
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="9.57"]').is(':visible'),
            '9.57 is not <= 9.55 -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-amount="9.55"]').is(':visible'),
            '9.55 <= 9.55 -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-amount="0"]').is(':visible'),
            '0 <= 9.55  -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-amount="-10"]').is(':visible'),
            '-10 <= 9.55 -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'amount',
            'filter-operator': '<=',
            'filter-value': 9.55,
          },
        ]);
      }
    );

    it(
      'should filter elements for: filterValue = number, dataValue = number, operator = ">="',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-amount="10">')
          .append('<div data-amount="9.57">')
          .append('<div data-amount="9.55">')
          .append('<div data-amount="0">')
          .append('<div data-amount="-10">');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isOk(
            $('#mocha-fixture div[data-amount="10"]').is(':visible'),
            '10 >= 0 -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-amount="9.57"]').is(':visible'),
            '9.57 is not >= 0 -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-amount="9.55"]').is(':visible'),
            '9.55 >= 0 -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-amount="0"]').is(':visible'),
            '0 >= 0 -> visible'
          );
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="-10"]').is(':visible'),
            '-10 is not >= 0 -> hidden'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'amount',
            'filter-operator': '>=',
            'filter-value': 0,
          },
        ]);
      }
    );

    it(
      'should filter elements  for: filterValue = number, dataValue = number, operator = "<"',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-amount="10">')
          .append('<div data-amount="9.57">')
          .append('<div data-amount="9.55">')
          .append('<div data-amount="0">')
          .append('<div data-amount="-10">');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="10"]').is(':visible'),
            '10 is not < 7.325 -> hidden'
          );
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="9.57"]').is(':visible'),
            '9.57 is not < 7.325 -> hidden'
          );
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="9.55"]').is(':visible'),
            '9.55 is not < 7.325 -> hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-amount="0"]').is(':visible'),
            '0 < 7.325 -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-amount="-10"]').is(':visible'),
            '-10 < 7.325 -> visible'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'amount',
            'filter-operator': '<',
            'filter-value': 7.325,
          },
        ]);
      }
    );

    it(
      'should filter elements  for: filterValue = number, dataValue = number, operator = ">"',
      function (done) {
        $('#mocha-fixture')
          .append('<div data-amount="10">')
          .append('<div data-amount="9.57">')
          .append('<div data-amount="9.55">')
          .append('<div data-amount="0">')
          .append('<div data-amount="-10">');

        $(document).on('filtered.bui.filterable', function () {
          $(document).off('filtered.bui.filterable');
          assert.isOk(
            $('#mocha-fixture div[data-amount="10"]').is(':visible'),
            '10 > 0.01 -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-amount="9.57"]').is(':visible'),
            '9.57 > 0.01 -> visible'
          );
          assert.isOk(
            $('#mocha-fixture div[data-amount="9.55"]').is(':visible'),
            '9.55 > 0.01 -> visible'
          );
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="0"]').is(':visible'),
            '0 is not > 0.01 -> hidden'
          );
          assert.isNotOk(
            $('#mocha-fixture div[data-amount="-10"]').is(':visible'),
            '-10 is not > 0.01 -> hidden'
          );
          done();
        });

        $('#mocha-fixture div').buiFilterable([
          {
            'filter-attrib': 'amount',
            'filter-operator': '>',
            'filter-value': 0.01,
          },
        ]);
      }
    );

    it('should filter by multiple filter objects', function (done) {
      $('#mocha-fixture')
        .append('<div id="div1" data-tags="tag1" data-groups="group1"/>')
        .append('<div id="div2" data-tags="tag1" data-groups="group2"/>')
        .append('<div id="div3" data-tags="tag3" data-groups="group2"/>');

      $(document).on('filtered.bui.filterable', function () {
        $(document).off('filtered.bui.filterable');
        assert.isOk($('#div1').is(':hidden'), '"div1" is not "group2" -> hidden');
        assert.isOk($('#div2').is(':visible'), '"tag2" is both "tag1" and "group2"  -> visible');
        assert.isOk($('#div3').is(':hidden'), '"div3" is not "tag1" -> hidden');
        done();
      });

      $('#mocha-fixture div').buiFilterable([
        {
          'filter-attrib': 'tags',
          'filter-operator': 'intersect',
          'filter-value': 'tag1',
        },
        {
          'filter-attrib': 'groups',
          'filter-operator': 'intersect',
          'filter-value': 'group2',
        },
      ]);
    });

  });

  describe('Reset related tests', function () {
    it('should show all elements if reset is invoked', function (done) {
      $('#mocha-fixture').append('<div data-tag="tag1">');

      $(document).on('filtered.bui.filterable', function () {
        $(document).off('filtered.bui.filterable');
        assert.isNotOk(
          $('#mocha-fixture div[data-tag="tag1"]').is(':visible'),
          'the element was hidden'
        );
      });

      $('#mocha-fixture div').buiFilterable([
        {
          'filter-attrib': 'tag',
          'filter-operator': 'intersect',
          'filter-value': 'tag2',
        },
      ]);

      $(document).on('resetEnd.bui.filterable', function () {
        $(document).off('resetEnd.bui.filterable');
        assert.isOk(
          $('#mocha-fixture div[data-tag="tag1"]').is(':visible'),
          'all elements were shown'
        );
        done();
      });

      $('#mocha-fixture div').buiFilterable('reset');
    });

  });

  describe('Data-api tests', function () {
    it(
      'should filter filterables by changing an element in the appropriate filter form on key up',
      function (done) {
        // Two forms are defined to ensure that the second one doesnt interfere
        $('#mocha-fixture').html('<div data-tag="tag1">Tag 1</div>' +
          '<form data-filter-target="#mocha-fixture div[data-tag=tag1]">' +
          '<input id="control" type="text" data-toggle="filter" data-filter-attrib="tag" ' +
          'data-filter-operator="intersect" />' +
          '</form>' +
          '<div data-tag="tag2">Tag 2</div>' +
          '<form data-filter-target="#mocha-fixture div[data-tag=tag2]">' +
          '<input type="text" data-toggle="filter" data-filter-attrib="tag" ' +
          'data-filter-operator="intersect" />' +
          '</form>');

        $(document).on('filtered.bui.filterable', function () {
          assert.isOk(
            $('#mocha-fixture div[data-tag="tag1"]').is(':hidden'),
            'tag 1 was hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tag="tag2"]').is(':visible'),
            'tag 2 is visible'
          );
        });

        $('#control').val('tag2').keyup();

        setTimeout(function () {
          $(document).off('filtered.bui.filterable');
          done();
        }, 100);
      }
    );

    it(
      'should filter filterables by changing an element ' +
      'in the appropriate filter form on change',
      function (done) {
        // Two forms are defined to ensure that the second one doesnt interfere
        $('#mocha-fixture').html('<div data-tag="tag1">Tag 1</div>' +
          '<form data-filter-target="#mocha-fixture div[data-tag=tag1]">' +
          '<input id="control" type="text" data-toggle="filter" data-filter-attrib="tag" ' +
          'data-filter-operator="intersect" />' +
          '</form>' +
          '<div data-tag="tag2">Tag 2</div>' +
          '<form data-filter-target="#mocha-fixture div[data-tag=tag2]">' +
          '<input type="text" data-toggle="filter" data-filter-attrib="tag" ' +
          'data-filter-operator="intersect" />' +
          '</form>');

        $(document).on('filtered.bui.filterable', function () {
          assert.isOk(
            $('#mocha-fixture div[data-tag="tag1"]').is(':hidden'),
            'tag 1 was hidden'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tag="tag2"]').is(':visible'),
            'tag 2 is visible'
          );
        });

        $('#control').val('tag2').change();

        setTimeout(function () {
          $(document).off('filtered.bui.filterable');
          done();
        }, 100);
      }
    );

    it('should reset filterables by clicking on reset element', function (done) {
      // Two forms are defined to ensure that the second one doesnt interfere
      $('#mocha-fixture').html('<div data-tag="tag1">Tag 1</div>' +
        '<form id="form-1" data-filter-target="#mocha-fixture div[data-tag=tag1]">' +
        '<input id="control-1" type="text" data-toggle="filter" data-filter-attrib="tag" ' +
        'data-filter-operator="intersect" />' +
        '<button type="reset" data-toggle="filter-reset" />' +
        '</form>' +
        '<div data-tag="tag2">Tag 2</div>' +
        '<form data-filter-target="#mocha-fixture div[data-tag=tag2]">' +
        '<input id="control-2" type="text" data-toggle="filter" data-filter-attrib="tag" ' +
        'data-filter-operator="intersect" />' +
        '<button type="reset" data-toggle="filter-reset" />' +
        '</form>');

      $('#control-2').val('tag1').change();
      $(document).on('filtered.bui.filterable', function () {
        $(document).on('resetEnd.bui.filterable', function () {
          assert.isOk(
            $('#mocha-fixture div[data-tag="tag1"]').is(':visible'),
            'tag 1 was shown again');
          assert.isOk(!$('#control-1').val(), 'the control-1 form was reset'
          );
          assert.isOk(
            $('#mocha-fixture div[data-tag="tag2"]').is(':hidden'),
            'tag 2 remained hidden');
          assert.isOk($('#control-2').val(), 'the control-2 form was not reset'
          );
        });
      });

      $('#control-1').val('tag2').keyup();
      $('#form-1 button').click();

      setTimeout(function () {
        $(document).off('filtered.bui.filterable');
        $(document).off('resetEnd.bui.filterable');
        done();
      }, 100);
    });

    it('empty value should match all, that is reset the filter field', function (done) {
      $('#mocha-fixture').html('<div data-tag="tag1">Tag 1</div>' +
        '<form id="form-1" data-filter-target="#mocha-fixture div[data-tag=tag1]">' +
        '<input id="control-1" type="text" data-toggle="filter" data-filter-attrib="tag" ' +
        'data-filter-operator="intersect" />' +
        '</form>');

      $('#control-1').val('x').keyup();
      $(document).on('filtered.bui.filterable', function () {
        $(document).off('filtered.bui.filterable');
        assert.isOk(
          $('#mocha-fixture div[data-tag="tag1"]').is(':visible'),
          '"div1" was not hidden'
        );
        done();
      });

      $('#control-1').val('').change();
    });

    it('should store the filter values in session storage', function (done) {
      var storageId = window.location.pathname + '|storageId';

      // Two forms are defined to ensure that the second one doesnt interfere
      $('#mocha-fixture').html('<div data-tag="tag1">Tag 1</div>' +
        '<form data-filter-target="div[data-tag=tag1]" data-filter-storage-id="storageId">' +
        '<input id="control" type="text" data-toggle="filter" data-filter-attrib="tag" ' +
        'data-filter-operator="intersect" data-filter-strict />' +
        '</form>' +
        '<div data-tag="tag2">Tag 2</div>' +
        '<form data-filter-target="#mocha-fixture div[data-tag=tag2]">' +
        '<input type="text" data-toggle="filter" data-filter-attrib="tag" ' +
        'data-filter-operator="intersect" data-filter-strict />' +
        '</form>');

      $(document).on('filtered.bui.filterable', function () {
        assert.equal(window.sessionStorage.getItem(storageId), JSON.stringify([
          {
            'filter-attrib': 'tag',
            'filter-operator': 'intersect',
            'filter-strict': true,
            'filter-value': 'tag2',
          },
        ]));
      });

      $('#control').val('tag2').change();

      setTimeout(function () {
        window.sessionStorage.removeItem(storageId);
        $(document).off('filtered.bui.filterable');
        done();
      }, 100);

    });

    it('should not store the filter values in session storage', function (done) {
      var storageId = window.location.pathname + '|storageId';

      window.sessionStorage.removeItem(storageId);
      $('#mocha-fixture').html('<div data-tag="tag1">Tag 1</div>' +
        '<form data-filter-target="#mocha-fixture div[data-tag=tag1]">' +
        '<input id="control" type="text" data-toggle="filter" data-filter-attrib="tag" ' +
        'data-filter-operator="intersect" data-filter-strict />' +
        '</form>');

      $(document).on('filtered.bui.filterable', function () {
        assert.equal(window.sessionStorage.getItem(storageId), null);
      });

      $('#control').val('tag2').change();

      setTimeout(function () {
        $(document).off('filtered.bui.filterable');
        done();
      }, 100);

    });

    it('should restore the filter values from session storage', function (done) {
      var storageId = window.location.pathname + '|storageId';

      window.sessionStorage.setItem(storageId, JSON.stringify([
        {
          'filter-attrib': 'tag',
          'filter-operator': 'intersect',
          'filter-value': 'tag2',
        },
      ]));

      // Two forms are defined to ensure that the second one doesnt interfere
      $('#mocha-fixture').html('<div data-tag="tag1">Tag 1</div>' +
        '<form data-filter-target="div[data-tag=tag1]" data-filter-storage-id="storageId">' +
        '<input id="control" type="text" data-toggle="filter" data-filter-attrib="tag" ' +
        'data-filter-operator="intersect" />' +
        '</form>' +
        '<div data-tag="tag2">Tag 2</div>' +
        '<form data-filter-target="#mocha-fixture div[data-tag=tag2]">' +
        '<input type="text" data-toggle="filter" data-filter-attrib="tag" ' +
        'data-filter-operator="intersect" />' +
        '</form>');

      $(document).on('filtered.bui.filterable', function () {
        assert.isOk(!$('#mocha-fixture div[data-tag="tag1"]').is(':visible'));
        assert.isOk($('#mocha-fixture div[data-tag="tag2"]').is(':visible'));
        assert.equal('tag2', $('#control').val());
      });

      $(window).trigger('load');

      setTimeout(function () {
        window.sessionStorage.removeItem(storageId);
        $(document).off('filtered.bui.filterable');
        done();
      }, 100);
    });

    it('should clear values from session storage on pressing the reset button', function (done) {
      var storageId = window.location.pathname + '|storageId';

      window.sessionStorage.setItem(storageId, JSON.stringify([
        {
          'filter-attrib': 'tag',
          'filter-operator': 'intersect',
          'filter-strict': true,
          'filter-value': 'tag2',
        },
      ]));

      $('#mocha-fixture').html('<div data-tag="tag1">Tag 1</div>' +
        '<form data-filter-target="div[data-tag=tag1]" data-filter-storage-id="storageId">' +
        '<button type="reset" data-toggle="filter-reset">Reset</button>' +
        '<input type="text" data-toggle="filter" data-filter-attrib="tag" ' +
        'data-filter-operator="intersect" data-filter-strict />' +
        '</form>');

      $(document).on('resetEnd.bui.filterable', function () {
        assert.equal(window.sessionStorage.getItem(storageId), null);
      });

      $('button[type=reset]').click();

      setTimeout(function () {
        $(document).off('resetEnd.bui.filterable');
        done();
      }, 100);
    });
  });
});
