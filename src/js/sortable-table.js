;(function ($, window, document) {
  'use strict';

  // SORTABLE TABLE CLASS DEFINITION
  // ===============================

  var SortableTable = function ($sortedTable, $navigation) {
    this.$sortedTable = $sortedTable;
    this.$navigation = $navigation;
    if ($navigation) {
      this.colCount = $sortedTable.find('tr')[0].childElementCount;
    }
  };

  SortableTable.prototype.sort = function ($sortedTh, sortDir) {
    var sortGroup;
    var rowCounter;
    var rowsLength;
    var tableHtml;
    var row;
    var isNavigationCol;
    var rows;
    var newSortGroup = null;
    var navigationHtml = '';
    var isSortedAsc = $sortedTh.hasClass('sorting-asc');

    this.$sortedTable
      .trigger('sort.bui.sortableTable')
      .find('th')
      .removeClass('sorting-asc')
      .removeClass('sorting-desc');

    if (isSortedAsc || sortDir === 'desc') {
      sortDir = 'desc';
      $sortedTh.addClass('sorting-desc');
    } else {
      $sortedTh.addClass('sorting-asc');
    }

    rows = this.$sortedTable
      .find('tbody tr')
      .toArray()
      .sort(this.comparer($sortedTh.index(), sortDir));

    isNavigationCol = this.$navigation && typeof $(rows[0]).children('td').eq($sortedTh.index())
            .data('sort-group') !== 'undefined';
    tableHtml = '<thead>' + this.$sortedTable.find('thead:eq(0)').html() + '</thead>';

    rowsLength = rows.length;
    for (rowCounter = 0; rowCounter < rowsLength; rowCounter++) {
      row = rows[rowCounter];
      if (isNavigationCol) {
        sortGroup = $(row)
          .children('td')
          .eq($sortedTh.index())
          .data('sort-group');

        if (newSortGroup !== sortGroup) {
          newSortGroup = sortGroup;
          navigationHtml += '<li><a href="#letter-' + sortGroup + '">' + sortGroup + '</a></li>';
          tableHtml += '<thead><tr class="active"><th colspan="' + this.colCount + '">' +
            '<h2 class="h3" id="letter-' + newSortGroup + '">' + newSortGroup + '</h2>' +
            '</th></tr></thead><tbody>';
        }
      }

      tableHtml += row.outerHTML;
    }

    if (this.$navigation) {
      if (isNavigationCol) {
        navigationHtml = '<ul>' + navigationHtml + '</ul>';
      }

      this.$navigation.html(navigationHtml);
    }

    this.$sortedTable.html(tableHtml + '</tbody>');
    this.$sortedTable.trigger('sorted.bui.sortableTable');
  };

  SortableTable.prototype.comparer = function (index, sortDir) {
    return function (a, b) {
      var result;
      var valA;
      var valB;
      var getCellValue = function (row, index) {
        var cell = $(row).children('td').eq(index);
        if (cell.attr('data-sort-value')) {
          return cell.attr('data-sort-value');
        } else {
          return cell.text();
        }
      };

      valA = getCellValue(a, index);
      valB = getCellValue(b, index);
      if ($.isNumeric(valA) && $.isNumeric(valB)) {
        result = valA - valB;
      } else {
        try {
          result = valA.localeCompare(valB, $('html').attr('lang'));
        } catch (err) {
          if (err instanceof RangeError) {
            result = valA.localeCompare(valB);
          }
        }
      }

      return sortDir === 'desc' ? result * -1 : result;
    };
  };

  // SORTABLE TABLE PLUGIN DEFINITION
  // ================================

  function Plugin(options) {
    return this.each(function () {
      var $navigation;
      var $this = $(this);
      var data = $this.data('bui.sortableTable');

      if (!data) {
        $navigation = options && 'navigation' in options && options.navigation ?
            $(options.navigation) : false;
        data = new SortableTable($this, $navigation);
        $this.data('bui.sortableTable', data);
      }

      data.sort(options['sorted-th'], options['sort-direction']);
    });
  }

  var old = $.fn.sortableTable;

  $.fn.sortableTable = Plugin;
  $.fn.sortableTable.Constructor = SortableTable;

  // SORTABLE TABLE NO CONFLICT
  // ==========================

  $.fn.sortableTable.noConflict = function () {
    $.fn.sortableTable = old;
    return this;
  };

  // SORTABLE TABLE DATA-API
  // =======================

  (function (Plugin, $, window, document) {
    var callPlugin = function ($this) {
      var $sortedTable = $this.closest('table');
      Plugin.call($sortedTable, {
        'sorted-th': $this,
        navigation: $($sortedTable.data('sort-navigation')),
      });
    };

    $(document).on('click.bui.sortableTable.data-api', 'th[data-toggle=sort]', function () {
      callPlugin($(this));
    });

    $(document).on('keydown.bui.sortableTable.data-api', 'th[data-toggle=sort]', function (e) {
      if (e.keyCode === 13 || e.keyCode === 32) { //enter or space
        callPlugin($(this));
      }
    });

    // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).on('load', function () {
      var $sortedTh = $('th[data-sort-onload]');
      $sortedTh.each(function (i) {
        var $sortedTable = $($sortedTh[i]).closest('table');
        Plugin.call($sortedTable, {
          'sorted-th': $($sortedTh[i]),
          navigation: $sortedTable.data('sort-navigation'),
          'sort-direction': $($sortedTh[i]).data('sort-onload'),
        });
      });
    });
  }(Plugin, $, window, document));

}(jQuery, window, document));
