(function ($) {
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
    var newSortGroup, sortGroup, rowCounter, rowsLength, navigationHtml = '', tableHtml = '', row, isNavigationCol, rows;
    var isSortedAsc = $sortedTh.hasClass('sorting-asc');

    this.$sortedTable
      .trigger('sort.sui.sortableTable')
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

    isNavigationCol = this.$navigation && typeof $(rows[0]).children('td').eq($sortedTh.index()).data('sort-group') !== 'undefined';
    tableHtml = '<thead>' + this.$sortedTable.find('thead:eq(0)').html() + '</thead>';
    navigationHtml = '';

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
    this.$sortedTable.trigger('sorted.sui.sortableTable');
  };

  SortableTable.prototype.comparer = function(index, sortDir) {
    return function(a, b) {
      var result, valA, valB;
      var getCellValue = function(row, index) {
        var cell = $(row).children('td').eq(index);
        if (cell.attr('data-sort-value'))
          return cell.attr('data-sort-value');
        else {
          return cell.text();
        }
      };

      valA = getCellValue(a, index);
      valB = getCellValue(b, index);
      if ($.isNumeric(valA) && $.isNumeric(valB)) {
        result = valA - valB;
      } else {
        result = valA.localeCompare(valB);
      }

      return sortDir === 'desc' ? result * -1 : result;
    };
  };


  // SORTABLE TABLE PLUGIN DEFINITION
  // ================================

  function Plugin(options) {
    var $element, data, $navigation;

    return this.each(function () {
      $element = $(this);

      data = $element.data('sui.sortableTable');
      if (!data) {
        $navigation = options && ('navigation' in options) && options.navigation ? $(options.navigation) : false;
        $element.data('sui.sortableTable', (data = new SortableTable($element, $navigation)));
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

  (function() {
    var callPlugin = function(e) {
      var $sortedTh = $(e.currentTarget);
      var $sortedTable = $sortedTh.closest('table');
      Plugin.call($sortedTable, {
        'sorted-th': $sortedTh,
        'navigation': $($sortedTable.data('sort-navigation'))
      });
    };

    $(document).on('click.sui.sortableTable.data-api', 'th[data-toggle=sort]', function(e) {
      callPlugin(e);
    });

    $(document).on('keydown.sui.sortableTable.data-api', 'th[data-toggle=sort]', function(e) {
      if (e.keyCode == 13 || e.keyCode == 32) { //enter or space
        callPlugin(e);
      }
    });

    // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).load(function() {
      var $sortedTh = $('th[data-sortable-onload]');
      var $sortedTable = $sortedTh.closest('table');
      Plugin.call($sortedTable, {
        'sorted-th': $sortedTh,
        'navigation': $($sortedTable.data('sort-navigation')),
        'sort-direction': $sortedTh.data('sortable-onload')
      });
    });
  }());

}(jQuery));
