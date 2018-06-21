describe('Sortable table plugin', function () {

  beforeEach(function () {
    $.fn.buiSortableTable = $.fn.sortableTable.noConflict();
  });

  afterEach(function () {
    $.fn.sortableTable = $.fn.buiSortableTable;
    delete $.fn.buiSortableTable;
    $('html').attr('lang', null);
    mocha.clearFixture();
  });

  describe('Initialization tests', function () {
    it('should be defined on jquery object', function () {
      assert.isOk($(document.body).buiSortableTable, 'confirmation method is defined');
    });
  });

  describe('Plugin tests', function () {
    it('should provide no conflict', function () {
      assert.strictEqual(
        $.fn.sortableTable,
        undefined,
        'sortableTable was set back to undefined (original value)'
      );
    });

    it('should return jquery collection containing the element', function () {
      var $table = $('<table>' +
        '<thead><tr><th>HeaderA</th></tr></thead>' +
        '<tbody>' +
        '<tr id="row1"><td>1</td></tr>' +
        '</tbody>' +
        '</table>');
      var $sortableTable = $table.buiSortableTable({ 'sorted-th': $table.find('th') });

      assert.isOk($sortableTable instanceof $, 'returns jquery collection');
      assert.strictEqual($sortableTable[0], $table[0], 'collection contains element');
    });

  });

  describe('Events tests', function () {
    it('should fire sort.bui.sortableTable when sorting begins', function (done) {
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
        assert.strictEqual($($rows[0]).attr('id'), 'row2', 'row2 is first');
        assert.strictEqual($($rows[1]).attr('id'), 'row1', 'row1 is second');
        assert.strictEqual($($rows[2]).attr('id'), 'row3', 'row3 is third');
        assert.isOk(true, 'event fired');
      });

      $table.buiSortableTable({ 'sorted-th': $table.find('th') });
      setTimeout(function () {
        if (!eventFired) {
          assert.isOk(false, 'Event not fired.');
        }

        done();
      }, 100);
    });

    it('should fire sorted.bui.sortableTable when sorting is done', function (done) {
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
          assert.strictEqual($($rows[0]).attr('id'), 'row1', 'row1 is first');
          assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second');
          assert.strictEqual($($rows[2]).attr('id'), 'row3', 'row3 is third');
          assert.isOk(true, 'event fired');
        });
      });

      $table.buiSortableTable({ 'sorted-th': $table.find('th') });
      setTimeout(function () {
        if (!eventFired) {
          assert.isOk(false, 'Event not fired.');
        }

        done();
      }, 100);
    });

    it('should not fire any events when called on empty set', function (done) {
      var $table = $('#empty-selector');

      $(document).on('sort.bui.sortableTable', function () {
        assert.isOk(false, 'event sort.bui.sortableTable fired');
      });

      $(document).on('sorted.bui.sortableTable', function () {
        assert.isOk(false, 'event sorted.bui.sortableTable fired');
      });

      $table.buiSortableTable({ 'sorted-th': $table.find('th') });
      setTimeout(function () {
        assert.isOk(true, 'allways ok');
        $(document).off('sort.bui.sortableTable');
        $(document).off('sorted.bui.sortableTable');
        done();
      }, 100);
    });
  });

  describe('Sorting tests', function () {
    it('should sort column in ascending direction if no direction is specified and reverse ' +
      'current order if the column has been ordered already', function (done) {
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
        assert.strictEqual($($rows[0]).attr('id'), 'row1', 'row1 is first on run 1');
        assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second on run 1');
        assert.strictEqual($($rows[2]).attr('id'), 'row3', 'row3 is third on run 1');
      });

      $table.buiSortableTable({ 'sorted-th': $table.find('th') });
      $table.on('sorted.bui.sortableTable', function () {
        $table.off('sorted.bui.sortableTable');
        var $rows = $table.find('tbody tr');
        assert.strictEqual($($rows[0]).attr('id'), 'row3', 'row3 is first on run 2');
        assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second on run 2');
        assert.strictEqual($($rows[2]).attr('id'), 'row1', 'row1 is third on run 2');
      });

      $table.buiSortableTable({ 'sorted-th': $table.find('th') });
      $table.on('sorted.bui.sortableTable', function () {
        $table.off('sorted.bui.sortableTable');
        var $rows = $table.find('tbody tr');
        assert.strictEqual($($rows[0]).attr('id'), 'row1', 'row1 is first on run 3');
        assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second on run 3');
        assert.strictEqual($($rows[2]).attr('id'), 'row3', 'row3 is third on run 3');
      });

      done();
      $table.buiSortableTable({ 'sorted-th': $table.find('th') });
    });

    it(
      'should sort column in ascending direction if direction specified is "asc"',
      function (done) {
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
          assert.strictEqual($($rows[0]).attr('id'), 'row1', 'row1 is first');
          assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second');
          assert.strictEqual($($rows[2]).attr('id'), 'row3', 'row3 is third');
          done();
        });

        $table.buiSortableTable({ 'sorted-th': $table.find('th'), 'sort-direction': 'asc' });
      }
    );

    it(
      'should sort column in descending direction if direction specified is "desc"',
      function (done) {
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
          assert.strictEqual($($rows[0]).attr('id'), 'row3', 'row3 is first');
          assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second');
          assert.strictEqual($($rows[2]).attr('id'), 'row1', 'row1 is third');
          done();
        });

        $table.buiSortableTable({ 'sorted-th': $table.find('th'), 'sort-direction': 'desc' });
      }
    );

    it(
      'should set class "sorting-asc" only on the sorted <th> element if sorting direction is ' +
      'ascending',
      function (done) {
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
        $('#mocha-fixture').append($table);

        $table.on('sorted.bui.sortableTable', function () {
          $table.off('sorted.bui.sortableTable');
          assert.isOk(
            $table.find('#headerA').hasClass('sorting-asc'),
            'headerA has the class sorting-asc on run 1'
          );
          assert.isOk(
            !$table.find('#headerB').hasClass('sorting-asc'),
            'headerB has not the class sorting-asc on run 1'
          );
        });

        $table.buiSortableTable({
          'sorted-th': $table.find('#headerA'),
          'sort-direction': 'asc',
        });
        $table.on('sorted.bui.sortableTable', function () {
          $table.off('sorted.bui.sortableTable');
          assert.isOk(
            !$table.find('#headerA').hasClass('sorting-asc'),
            'headerA has not the class sorting-asc on run 2'
          );
          assert.isOk(
            $table.find('#headerB').hasClass('sorting-asc'),
            'headerB has the class sorting-asc on run 2'
          );
          done();
        });

        $table.buiSortableTable({
          'sorted-th': $table.find('#headerB'),
          'sort-direction': 'asc',
        });
      }
    );

    it(
      'should set class "sorting-desc" only on the sorted <th> element ' +
      'if sorting direction is descending',
      function (done) {
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
          assert.isOk(
            $table.find('#headerA').hasClass('sorting-desc'),
            'headerA has the class sorting-desc on run 1'
          );
          assert.isOk(
            !$table.find('#headerB').hasClass('sorting-desc'),
            'headerB has not the class sorting-desc on run 1'
          );
        });

        $table.buiSortableTable({
          'sorted-th': $table.find('#headerA'),
          'sort-direction': 'desc',
        });
        $table.on('sorted.bui.sortableTable', function () {
          $table.off('sorted.bui.sortableTable');
          assert.isOk(
            !$table.find('#headerA').hasClass('sorting-desc'),
            'headerA has not the class sorting-desc on run 2'
          );
          assert.isOk(
            $table.find('#headerB').hasClass('sorting-desc'),
            'headerB has the class sorting-desc on run 2'
          );
          done();
        });

        $table.buiSortableTable({
          'sorted-th': $table.find('#headerB'),
          'sort-direction': 'desc',
        });
      }
    );

    it(
      'should populate and empty the navigation element if sorting by grouped column',
      function (done) {
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
        $('#mocha-fixture')
          .append('<div id="navigation"/>')
          .append($table);
        navigationEl = $('#navigation');

        $table.on('sorted.bui.sortableTable', function () {
          $table.off('sorted.bui.sortableTable');
          assert.isOk(!$('#navigation').is(':empty'), 'the navigation element was populated');
        });

        $table.buiSortableTable({
          'sorted-th': $table.find('#headerA'),
          'sort-direction': 'desc',
          navigation: navigationEl,
        });

        $table.on('sorted.bui.sortableTable', function () {
          $table.off('sorted.bui.sortableTable');
          assert.isOk($('#navigation').is(':empty'), 'the navigation element was emptied');
          done();
        });

        $table.buiSortableTable({
          'sorted-th': $table.find('#headerB'),
          'sort-direction': 'desc',
          navigation: navigationEl,
        });
      }
    );

    it(
      'should create and remove all group <thead> in table if sorting by grouped column',
      function (done) {
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

        $('#mocha-fixture')
          .append('<div id="navigation"/>')
          .append($table);
        navigationEl = $('#navigation');

        $table.on('sorted.bui.sortableTable', function () {
          $table.off('sorted.bui.sortableTable');
          assert.strictEqual($table.find('thead').length, 4, 'the group <thead> were created');
        });

        $table.buiSortableTable({
          'sorted-th': $table.find('#headerA'),
          'sort-direction': 'desc',
          navigation: navigationEl,
        });

        $table.on('sorted.bui.sortableTable', function () {
          $table.off('sorted.bui.sortableTable');
          assert.strictEqual($table.find('thead').length, 1, 'the group <thead> were removed');
          done();
        });

        $table.buiSortableTable({
          'sorted-th': $table.find('#headerB'),
          'sort-direction': 'desc',
          navigation: navigationEl,
        });
      }
    );

    it(
      'should not do anything if sorted by column with same values ' +
      'in all rows and the direction is changed',
      function (done) {
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
            assert.isOk($($rows[0]).attr('id'), 'row2', 'row2 is first');
            assert.isOk($($rows[1]).attr('id'), 'row1', 'row1 is second');
            assert.isOk($($rows[2]).attr('id'), 'row3', 'row3 is third');
          })
          .buiSortableTable({ 'sorted-th': $(this).find('#headerB'), 'sort-direction': 'desc' })
          .on('sorted.bui.sortableTable', function () {
            $(this).off('sorted.bui.sortableTable');
            var $rows = $(this).find('tbody tr');
            assert.strictEqual($($rows[0]).attr('id'), 'row2', 'row2 is first');
            assert.strictEqual($($rows[1]).attr('id'), 'row1', 'row1 is second');
            assert.strictEqual($($rows[2]).attr('id'), 'row3', 'row3 is third');
            done();
          })
          .buiSortableTable({ 'sorted-th': $(this).find('#headerB'), 'sort-direction': 'asc' });
      }
    );

    it('should sort with invalid html language', function (done) {
      var $table = $('<table>' +
        '<tbody>' +
        '<thead><tr><th id="headerA">HeaderA</th></tr></thead>' +
        '<tr id="row1"><td>šb</td></tr>' +
        '<tr id="row2"><td>sa</td></tr>' +
        '<tr id="row3"><td>sc</td></tr>' +
        '</tbody>' +
        '</table>');

      $('html').attr('lang', 'some-invalid-language-code');
      $table.on('sorted.bui.sortableTable', function () {
        var $rows = $(this).find('tbody tr');
        $(this).off('sorted.bui.sortableTable');
        assert.strictEqual($($rows[0]).attr('id'), 'row2');

        // Other rows can not be tested as the result depends on the environment.
        done();
      })
        .buiSortableTable({ 'sorted-th': $(this).find('#headerA'), 'sort-direction': 'asc' });
    });

    it('should sort based on html language ', function (done) {
      var $table = $('<table>' +
        '<tbody>' +
        '<thead><tr><th id="headerA">HeaderA</th></tr></thead>' +
        '<tr id="row1"><td>šb</td></tr>' +
        '<tr id="row2"><td>sa</td></tr>' +
        '<tr id="row3"><td>sc</td></tr>' +
        '</tbody>' +
        '</table>');

      $('html').attr('lang', 'cs');
      $table.on('sorted.bui.sortableTable', function () {
        var $rows = $(this).find('tbody tr');
        var validateNoLocale = function ($rows) {
          assert.strictEqual($($rows[0]).attr('id'), 'row2');

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
            assert.strictEqual($($rows[0]).attr('id'), 'row2');
            assert.strictEqual($($rows[1]).attr('id'), 'row3');
            assert.strictEqual($($rows[2]).attr('id'), 'row1');
          } else {
            validateNoLocale($rows);
          }
        }

        done();
      })
        .buiSortableTable({ 'sorted-th': $(this).find('#headerA'), 'sort-direction': 'asc' });
    });
  });

  describe('Data-api tests', function () {
    it('should order table by the column whoms <th> element was clicked', function () {
      var $table = $('<table>' +
        '<thead><tr><th data-toggle="sort" id="headerA">HeaderA</th></tr></thead>' +
        '<tbody>' +
        '<tr id="row2"><td>2</td></tr>' +
        '<tr id="row1"><td>1</td></tr>' +
        '<tr id="row3"><td>3</td></tr>' +
        '</tbody>' +
        '</table>');
      $('#mocha-fixture').append($table);

      $table.on('sorted.bui.sortableTable', function () {
        var $rows = $table.find('tbody tr');
        assert.strictEqual($($rows[0]).attr('id'), 'row1', 'row1 is first');
        assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second');
        assert.strictEqual($($rows[2]).attr('id'), 'row3', 'row3 is third');
      });

      $('#headerA').click();
    });

    it(
      'should order table by the column on whoms <th> element Enter was pressed',
      function (done) {
        var $table = $('<table>' +
          '<thead><tr><th data-toggle="sort" id="headerA">HeaderA</th></tr></thead>' +
          '<tbody>' +
          '<tr id="row2"><td>2</td></tr>' +
          '<tr id="row1"><td>1</td></tr>' +
          '<tr id="row3"><td>3</td></tr>' +
          '</tbody>' +
          '</table>');
        $('#mocha-fixture').append($table);

        $table.on('sorted.bui.sortableTable', function () {
          var $rows = $table.find('tbody tr');
          assert.strictEqual($($rows[0]).attr('id'), 'row1', 'row1 is first');
          assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second');
          assert.strictEqual($($rows[2]).attr('id'), 'row3', 'row3 is third');
          done();
        });

        $('#headerA').trigger($.Event('keydown', { keyCode: 13 }));
      }
    );

    it(
      'should order table by the column on whoms <th> element space was pressed',
      function (done) {
        var $table = $('<table>' +
          '<thead><tr><th data-toggle="sort" id="headerA">HeaderA</th></tr></thead>' +
          '<tbody>' +
          '<tr id="row2"><td>2</td></tr>' +
          '<tr id="row1"><td>1</td></tr>' +
          '<tr id="row3"><td>3</td></tr>' +
          '</tbody>' +
          '</table>');
        $('#mocha-fixture').append($table);

        $table.on('sorted.bui.sortableTable', function () {
          var $rows = $table.find('tbody tr');
          assert.strictEqual($($rows[0]).attr('id'), 'row1', 'row1 is first');
          assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second');
          assert.strictEqual($($rows[2]).attr('id'), 'row3', 'row3 is third');
          done();
        });

        $('#headerA').trigger($.Event('keydown', { keyCode: 32 }));
      }
    );

    it(
      'should sort the table in ascending mode on load ' +
      'if <th> has data-sort-onload="asc" attribute',
      function (done) {
        var $table = $('<table>' +
          '<thead>' +
          '<tr><th data-toggle="sort" data-sort-onload="asc" id="headerA">HeaderA</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr id="row2"><td>2</td></tr>' +
          '<tr id="row1"><td>1</td></tr>' +
          '<tr id="row3"><td>3</td></tr>' +
          '</tbody>' +
          '</table>');
        $('#mocha-fixture').append($table);

        $table.on('sorted.bui.sortableTable', function () {
          var $rows = $table.find('tbody tr');
          assert.strictEqual($($rows[0]).attr('id'), 'row1', 'row1 is first');
          assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second');
          assert.strictEqual($($rows[2]).attr('id'), 'row3', 'row3 is third');
          done();
        });

        $(window).trigger('load');
      }
    );

    it(
      'should sort the table in descending mode on load if <th> has data-sort-onload="desc" ' +
      'attribute',
      function (done) {
        var $table = $('<table>' +
          '<thead>' +
          '<tr><th data-toggle="sort" data-sort-onload="desc" id="headerA">HeaderA</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr id="row2"><td>2</td></tr>' +
          '<tr id="row1"><td>1</td></tr>' +
          '<tr id="row3"><td>3</td></tr>' +
          '</tbody>' +
          '</table>');
        $('#mocha-fixture').append($table);

        $table.on('sorted.bui.sortableTable', function () {
          var $rows = $table.find('tbody tr');
          assert.strictEqual($($rows[0]).attr('id'), 'row3', 'row3 is first');
          assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second');
          assert.strictEqual($($rows[2]).attr('id'), 'row1', 'row1 is third');
          done();
        });

        $(window).trigger('load');
      }
    );

    it('should sort two tables data-sort-onload attribute independently', function (done) {
      var $table1 = $('<table>' +
        '<thead>' +
        '<tr><th data-toggle="sort" data-sort-onload="desc" id="headerA">HeaderA</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr id="row2"><td>2</td></tr>' +
        '<tr id="row1"><td>1</td></tr>' +
        '<tr id="row3"><td>3</td></tr>' +
        '</tbody>' +
        '</table>');
      var $table2 = $('<table>' +
        '<thead>' +
        '<tr><th data-toggle="sort" data-sort-onload="asc" id="headerB">HeaderB</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr id="row2"><td>2</td></tr>' +
        '<tr id="row1"><td>1</td></tr>' +
        '<tr id="row3"><td>3</td></tr>' +
        '</tbody>' +
        '</table>');

      $('#mocha-fixture')
        .append($table1)
        .append($table2);

      $table1.on('sorted.bui.sortableTable', function () {
        var $rows = $table1.find('tbody tr');
        assert.strictEqual($($rows[0]).attr('id'), 'row3', 'row3 is first');
        assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second');
        assert.strictEqual($($rows[2]).attr('id'), 'row1', 'row1 is third');
        $table2.on('sorted.bui.sortableTable', function () {
          var $rows = $table2.find('tbody tr');
          assert.strictEqual($($rows[0]).attr('id'), 'row1', 'row1 is first');
          assert.strictEqual($($rows[1]).attr('id'), 'row2', 'row2 is second');
          assert.strictEqual($($rows[2]).attr('id'), 'row3', 'row3 is third');
          done();
        });
      });

      $(window).trigger('load');
    });
  });
});
