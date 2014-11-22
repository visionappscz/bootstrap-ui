;(function($, window, document) {
    'use strict';

  // FILTERABLE CLASS DEFINITION
  // ===========================

  var Filterable = function($filterable) {
    this.$filterable = $filterable;
  };

  Filterable.prototype.filter = function(fObjects) {
    var dataVal, filterValCounter, filterValLength, filterVal,
      filterOper, dataValCounter, dataValLength, fObjCounter, hideEl, fObjectsLength;

    if (fObjects && fObjects.length) {
      this.$filterable.show();
      fObjectsLength = fObjects.length;
      for (fObjCounter = 0; fObjCounter < fObjectsLength; fObjCounter++) {
        filterVal = fObjects[fObjCounter]['filter-value'];
        filterOper = fObjects[fObjCounter]['filter-operator'];
        dataVal = this.$filterable.data(fObjects[fObjCounter]['filter-attrib']);

        if (dataVal !== null) {
          hideEl = false;

          filterValLength = filterVal.length;
          if (filterOper === 'subset') {
            for (filterValCounter = 0; filterValCounter < filterValLength; filterValCounter++) {
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
            dataValLength = dataVal.length;
            for (filterValCounter = 0; filterValCounter < filterValLength; filterValCounter++) {
              for (dataValCounter = 0; dataValCounter < dataValLength; dataValCounter++) {
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
  };


  // FILTERABLE PLUGIN DEFINITION
  // ============================

  function Plugin(options) {
    if (this.length) {
      if (options === 'reset') {
        $(document).trigger('resetStart.sui.filterable', [this.$filterable]);
      } else {
        $(document).trigger('filter.sui.filterable');
      }

      this.each(function() {
        var $element, data;

        $element = $(this);
        data = $element.data('sui.filterable');
        if (!data) {
          $element.data('sui.filterable', (data = new Filterable($element)));
        }

        if (options === 'reset') {
          data.resetFilter();
        } else {
          data.filter(options);
        }
      });

      if (options === 'reset') {
        $(document).trigger('resetEnd.sui.filterable', [this.$filterable]);
      } else {
        $(document).trigger('filtered.sui.filterable');
      }
    }

    return this;
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
    Plugin.call($($form.data('target')), 'reset');
  });

}(jQuery, window, document));
