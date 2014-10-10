// Prevent jshinf from raising the "Expected an assignment or function call and instead saw an expression" warning
// jshint -W030

+function ($) {
    'use strict';

  // SORTABLE TABLE CLASS DEFINITION
  // ======================
  var SortableTable = function ($sortedTh) {
    this.$sortedTable = $sortedTh.closest('table');
    this.$sortableThs = this.$sortedTable.find('[data-toggle="sort"]');
  };

  SortableTable.prototype.sort = function ($sortedTh) {
    var $navigation = $(this.$sortedTable.data('sort-navigation'));
    var rows = this.$sortedTable
      .find('tbody tr')
      .toArray()
      .sort(this.comparer($sortedTh.index()));


    if ($sortedTh.hasClass('sorting-asc')) {
      $sortedTh.asc = !$sortedTh.asc;
    }
    else {
      this.$sortableThs.removeClass('sorting-active');
      $sortedTh.addClass('sorting-active');
    }

    if ($sortedTh.asc) {
      rows = rows.reverse();
      $sortedTh.addClass('sorting-desc');
      $sortedTh.removeClass('sorting-asc');
    }
    else {
      $sortedTh.removeClass('sorting-desc');
      $sortedTh.addClass('sorting-asc');
    }

    var colCount;
    if ($navigation) {
      this.$sortedTable.find('thead:gt(0)').remove();
      $navigation.children().remove();
      colCount = rows[0].childElementCount;
    }

    for (var i = 0; i < rows.length; i++) {
      if ($navigation) {
        var newSortGroup;
        var sortGroup = $(rows[i])
          .children('td')
          .eq($sortedTh.index())
          .data('sort-group');

        if (newSortGroup != sortGroup) {
          newSortGroup = sortGroup;
          $navigation.append('<li><a href="#letter-' + sortGroup + '">' + sortGroup + '</a></li>');
          this.$sortedTable.append($('<thead><tr class="active"><th colspan="' + colCount + '"><h2 class="h3" id="letter-' + newSortGroup + '">' + newSortGroup + '</h2></th></tr></thead>'));
          this.$sortedTable.append($('<tbody></tbody>'));
        }
      }

      this.$sortedTable.find('tbody:last').append(rows[i]);
    }
  };

  SortableTable.prototype.comparer = function(index) {
    return function(a, b) {
      var getCellValue = function(row, index) {
        return $(row).children('td').eq(index).text();
      };
      var valA = getCellValue(a, index);
      var valB = getCellValue(b, index);
      if ($.isNumeric(valA) && $.isNumeric(valB)) {
        return valA - valB;
      }
      else {
        return valA.localeCompare(valB);
      }
    };
  };


  // SORTABLE TABLE PLUGIN DEFINITION
  // =======================

  function Plugin() {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('sui.sortableTable');
      if (!data) {
        $this.data('sui.sortableTable', (data = new SortableTable($this)));
      }
      data.sort($this);
    });
  }

  var old = $.fn.sort;

  $.fn.sortableTable             = Plugin;
  $.fn.sortableTable.Constructor = SortableTable;


  // SORTABLE TABLE NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.sortableTable = old;
    return this;
  };


  // SORTABLE TABLE DATA-API
  // ==============

  $(document).on('click.sui.sortableTable.data-api', '[data-toggle=sort]', function(e) {
    var $sortedTh = $(e.currentTarget);
    Plugin.call($sortedTh);
  });

  $(document).on('keyup.sui.sortableTable.data-api', '[data-toggle=sort]', function(e) {
    var $sortedTh = $(e.currentTarget);
    if (e.keyCode == 13 || e.keyCode == 32) {
      Plugin.call($sortedTh);
    }
  });

}(jQuery);
