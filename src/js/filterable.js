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
