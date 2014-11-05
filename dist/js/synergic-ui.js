(function($) {
  'use strict';

  // CONFIRMATION CLASS DEFINITION
  // =============================

  var Confirmation = function($triggerEl, callback, message, yes, no) {
    message = message !== null ? message : this.defaults['confirm-message'];
    yes = yes !== null ? yes : this.defaults['confirm-yes'];
    no = no !== null ? no : this.defaults['confirm-no'];
    callback = callback !== null ? callback : this.defaults.callback;
    this.modal = this.getModal(message, yes, no);
    this.$triggerEl = $triggerEl;
    this.callback = callback;
  };

  Confirmation.prototype.defaults = {
    'confirm-message': 'Are you sure?',
    'confirm-yes': 'Yes',
    'confirm-no': 'No',
    'callback': function() {} // Having empty callback is useless, it is here as a sane fallback for tests
  };

  Confirmation.prototype.showConfirmation = function() {
    var $triggerEl = this.$triggerEl;
    var callback = this.callback;
    var $modal = this.modal.modal({
      keboard: false,
      backdrop: 'static'
    });

    $triggerEl.trigger('show.sui.confirmation');
    $triggerEl.on('rejected.sui.confirmation', function() {
      callback(false);
    });
    $triggerEl.on('confirmed.sui.confirmation', function() {
      callback(true);
    });
    $triggerEl.on('rejected.sui.confirmation confirmed.sui.confirmation', function() {
      $modal.on('hidden.bs.modal', function() {
        $(this).remove();
      });
      // The fade class is removed before hiding the modal to prevent the backdrop from staying behond
      // Thats why there is no animation :(
      // http://stackoverflow.com/questions/22056147/bootstrap-modal-backdrop-remaining
      $modal.removeClass('fade').modal('hide');
      $triggerEl.off('rejected.sui.confirmation confirmed.sui.confirmation');
    });

    $modal.on('keydown.sui.confirmation', function(e) {
      if (e.keyCode === 27) { //escape
        $triggerEl.trigger('rejected.sui.confirmation');
      }
      else if (e.keyCode === 13) { //enter
        $triggerEl.trigger('confirmed.sui.confirmation');
      }
    });
    $modal
      .find('[data-confirmation=reject]')
      .on('click.sui.confirmation', function() {
        $triggerEl.trigger('rejected.sui.confirmation');
      });
    $modal
      .find('[data-confirmation=confirm]')
      .on('click.sui.confirmation', function() {
        $triggerEl.trigger('confirmed.sui.confirmation');
      });
  };

  Confirmation.prototype.getModal = function(message, yes, no) {
    var footer = $('<div class="modal-footer"></div>')
      .append('<button type="button" class="btn btn-default" data-confirmation="reject">' + no + '</button>')
      .append('<button type="button" class="btn btn-primary" data-confirmation="confirm">' + yes + '</button>');
    var modal = $('<div class="modal fade" tabindex="-1"></div>');
    var dialog = $('<div class="modal-dialog modal-sm"></div>');
    var content = $('<div class="modal-content"></div>')
      .append('<div class="modal-body">' + message + '</div>')
      .append(footer);
    modal.append(dialog.append(content));

    return modal;
  };


  // CONFIRMATION PLUGIN DEFINITION
  // ==============================

  function Plugin(options) {
    var $element, data;
    var message = options && ('confirm-message' in options) && options['confirm-message'] ? options['confirm-message'] : null;
    var yes = options && ('confirm-yes' in options) && options['confirm-yes'] ? options['confirm-yes'] : null;
    var no = options && ('confirm-no' in options) && options['confirm-no'] ? options['confirm-no'] : null;
    var callback = options && ('callback' in options) && options.callback ? options.callback : null;

    return this.each(function() {
      $element = $(this);

      data = $element.data('sui.confirmation');
      if (!data) {
        $element.data('sui.confirmation', (data = new Confirmation($element, callback, message, yes, no)));
      }

      data.showConfirmation();
    });
  }

  var old = $.fn.confirmation;

  $.fn.confirmation = Plugin;
  $.fn.confirmation.Constructor = Confirmation;


  // CONFIRMATION NO CONFLICT
  // ========================

  $.fn.confirmation.noConflict = function() {
    $.fn.confirmation = old;
    return this;
  };


  // CONFIRMATION DATA-API
  // =====================

  $(document).on('click.sui.confirmation.data-api', '[data-toggle=confirm]', function(e, noConfirm) {
    if (!noConfirm) {
      var $clickedEl = $(e.target);
      Plugin.call($clickedEl, {
        'confirm-message': $clickedEl.data('confirm-message'),
        'confirm-yes': $clickedEl.data('confirm-yes'),
        'confirm-no': $clickedEl.data('confirm-no'),
        'callback': function(result) {
          if (result) {
            $clickedEl.trigger('click.sui.confirmation.data-api', true);
          }
        }
      });
      e.preventDefault();
    }
  });

}(jQuery));

(function($) {
    'use strict';

  // FILTERABLE CLASS DEFINITION
  // ===========================

  var Filterable = function($filterable) {
    this.$filterable = $filterable;
  };

  Filterable.prototype.filter = function(fObjects) {
    var filterValCounter, filterVal, filterOper, dataVal, dataValCounter, fObjCounter, hideEl;

    if (fObjects && fObjects.length) {
      this.$filterable.show();
      for (fObjCounter = 0; fObjCounter < fObjects.length; fObjCounter++) {
        filterVal = fObjects[fObjCounter]['filter-value'];
        filterOper = fObjects[fObjCounter]['filter-operator'];
        dataVal = this.$filterable.data(fObjects[fObjCounter]['filter-attrib']);

        if (dataVal !== null) {
          hideEl = false;

          if (filterOper === 'subset') {
            for (filterValCounter = 0; filterValCounter < filterVal.length; filterValCounter++) {
              if (dataVal.indexOf(filterVal[filterValCounter]) === -1) {
                hideEl = true;
                break;
              }
            }
          } else if (filterOper === 'intersect') {
            hideEl = true;
            if (typeof(filterVal) === 'string') {
              filterVal = [filterVal];
            }
            if (typeof(dataVal) === 'string') {
              dataVal = [dataVal];
            }
            for (filterValCounter = 0; filterValCounter < filterVal.length; filterValCounter++) {
              for (dataValCounter = 0; dataValCounter < dataVal.length; dataValCounter++) {
                if (dataVal[dataValCounter].indexOf(filterVal[filterValCounter]) !== -1) {
                  hideEl = false;
                  break;
                }
              }
            }
          } else if (
            (filterOper === '=' && +dataVal !== +filterVal) ||
            (filterOper === '>=' && +dataVal < +filterVal) ||
            (filterOper === '<=' && +dataVal > +filterVal) ||
            (filterOper === '<' && +dataVal >= +filterVal) ||
            (filterOper === '>' && +dataVal <= +filterVal)
          ) {
            hideEl = true;
          }

          if (hideEl === true) {
            this.$filterable.hide();
          }
        }
      }
    }
  };

  Filterable.prototype.resetFilter = function() {
    this.$filterable.show();
    $(document).trigger('resetEnd.sui.filterable', [this.$filterable]);
  };


  // FILTERABLE PLUGIN DEFINITION
  // ============================

  function Plugin(options) {
    var $elements, $element, data;

    if (options === 'resetFilter') {
      $(document).trigger('resetStart.sui.filterable', [this.$filterable]);
    } else {
      $(document).trigger('filter.sui.filterable');
    }

    $elements = this.each(function() {
      $element = $(this);
      data = $element.data('sui.filterable');
      if (!data) {
        $element.data('sui.filterable', (data = new Filterable($element)));
      }

      if (options === 'resetFilter') {
        data.resetFilter();
      } else {
        data.filter(options);
      }
    });

    if (options === 'resetFilter') {
      $(document).trigger('resetEnd.sui.filterable', [this.$filterable]);
    } else {
      $(document).trigger('filtered.sui.filterable');
    }

    return $elements;
  }

  var old = $.fn.filterable;

  $.fn.filterable = Plugin;
  $.fn.filterable.Constructor = Filterable;


  // FILTERABLE NO CONFLICT
  // ======================

  $.fn.filterable.noConflict = function() {
    $.fn.filterable = old;
    return this;
  };


  // FILTERABLE DATA-API
  // ===================

  $(document).on('change.sui.filterable.data-api', '[data-toggle=filter]', function() {
    var $filterInput;
    var $filter = $(this).closest('form');
    var filterData = [];

    $filter.find(':input').each(function(index, filterInput) {
      $filterInput = $(filterInput);
      if ($filterInput.val() !== '' && $filterInput.val() !== null) {
        filterData.push({
          'filter-attrib': $filterInput.data('filter-attrib'),
          'filter-operator': $filterInput.data('filter-operator'),
          'filter-value': $filterInput.val()
        });
      }
    });

    Plugin.call($($filter.data('target')), filterData);
  });

  $(document).on('click.sui.filterable.data-api', '[data-toggle="filter-reset"]', function() {
    var $form = $(this).closest('form');
    $form[0].reset();
    Plugin.call($($form.data('target')), 'resetFilter');
  });

}(jQuery));

(function ($) {
    'use strict';

  // SORTABLE TABLE CLASS DEFINITION
  // ===============================

  var SortableTable = function ($sortedTable, $navigation) {
    this.$sortedTable = $sortedTable;
    this.$navigation = $navigation;
  };

  SortableTable.prototype.sort = function ($sortedTh, sortDir) {
    var newSortGroup, sortGroup, colCount, $navigationUl, rowCounter;
    var rows = this.$sortedTable
      .find('tbody tr')
      .toArray()
      .sort(this.comparer($sortedTh.index()));

    this.$sortedTable.trigger('sort.sui.sortableTable');

    if ($sortedTh.hasClass('sorting-asc') && sortDir !== 'asc') {
      sortDir = 'desc';
    }
    this.$sortedTable
      .find('th')
      .removeClass('sorting-active')
      .removeClass('sorting-asc')
      .removeClass('sorting-desc');

    $sortedTh.addClass('sorting-active');
    if (sortDir === 'desc') {
      rows = rows.reverse();
      $sortedTh.addClass('sorting-desc');
    }
    else {
      $sortedTh.addClass('sorting-asc');
    }

    if (this.$navigation) {
      this.$navigation.find('ul').remove();
      this.$sortedTable.find('thead:gt(0)').remove();
      colCount = rows[0].childElementCount;
      if ($(rows[0]).children('td').eq($sortedTh.index()).data('sort-group')) {
        $navigationUl = $('<ul></ul>');
        this.$navigation.append($navigationUl);
      }
    }

    for (rowCounter = 0; rowCounter < rows.length; rowCounter++) {
      if (this.$navigation) {
        sortGroup = $(rows[rowCounter])
          .children('td')
          .eq($sortedTh.index())
          .data('sort-group');

        if (newSortGroup != sortGroup) {
          newSortGroup = sortGroup;
          $navigationUl.append('<li><a href="#letter-' + sortGroup + '">' + sortGroup + '</a></li>');
          this.$sortedTable.append($('<thead><tr class="active"><th colspan="' + colCount + '"><h2 class="h3" id="letter-' + newSortGroup + '">' + newSortGroup + '</h2></th></tr></thead>'));
          this.$sortedTable.append($('<tbody></tbody>'));
        }
      }
      this.$sortedTable.find('tbody:last').append(rows[rowCounter]);
    }
    this.$sortedTable.trigger('sorted.sui.sortableTable');
  };

  SortableTable.prototype.comparer = function(index) {
    return function(a, b) {
      var getCellValue = function(row, index) {
        var cell = $(row).children('td').eq(index);
        if (cell.attr('data-sort-value'))
          return cell.attr('data-sort-value');
        else {
          return cell.text();
        }
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
  // ================================

  function Plugin(options) {
    var $element, data, $navigation;
    var sortedTh = options && ('sorted-th' in options) && options['sorted-th'] ? options['sorted-th'] : false;
    var sortDir = options && ('sort-direction' in options) && options['sort-direction'] ? options['sort-direction'] : false;

    return this.each(function () {
      $element = $(this);
      data = $element.data('sui.sortableTable');
      if (!data) {
        $navigation = options && ('navigation' in options) && options.navigation ? options.navigation : false;
        $element.data('sui.sortableTable', (data = new SortableTable($element, $navigation)));
      }
      if (sortedTh) {
        data.sort(options['sorted-th'], options['sort-direction']);
      }
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

    $(document).on('click.sui.sortableTable.data-api', '[data-toggle=sort]', function(e) {
      callPlugin(e);
    });

    $(document).on('keydown.sui.sortableTable.data-api', '[data-toggle=sort]', function(e) {
      if (e.keyCode == 13 || e.keyCode == 32) { //enter or space
        callPlugin(e);
      }
    });
  }());

}(jQuery));
