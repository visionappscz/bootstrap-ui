;(function ($, window, document) {
  'use strict';

  // FILTERABLE CLASS DEFINITION
  // ===========================

  var Filterable = function ($filterable) {
    this.$filterable = $filterable;
  };

  Filterable.prototype.filter = function (fObjects) {
    var dataVal;
    var filterValCounter;
    var filterValLength;
    var filterVal;
    var filterOper;
    var dataValCounter;
    var dataValLength;
    var fObjCounter;
    var hideEl;
    var fObjectsLength;

    this.$filterable.show();
    if (fObjects && fObjects.length) {
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
            if (typeof filterVal === 'string') {
              filterVal = [filterVal];
            }

            if (typeof dataVal === 'string') {
              dataVal = [dataVal];
            }

            filterValLength = filterVal.length;
            dataValLength = dataVal.length;
            for (filterValCounter = 0; filterValCounter < filterValLength; filterValCounter++) {
              for (dataValCounter = 0; dataValCounter < dataValLength; dataValCounter++) {
                if (dataVal[dataValCounter].toLowerCase().indexOf(filterVal[filterValCounter]
                        .toLowerCase()) !== -1) {
                  hideEl = false;
                  break;
                }
              }
            }
          } else if (
            filterOper === '=' && +dataVal !== +filterVal ||
            filterOper === '>=' && +dataVal < +filterVal ||
            filterOper === '<=' && +dataVal > +filterVal ||
            filterOper === '<' && +dataVal >= +filterVal ||
            filterOper === '>' && +dataVal <= +filterVal
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

  Filterable.prototype.resetFilter = function () {
    this.$filterable.show();
  };

  // FILTERABLE PLUGIN DEFINITION
  // ============================

  function Plugin(options) {
    if (this.length) {
      if (options === 'reset') {
        $(document).trigger('resetStart.sui.filterable');
      } else {
        $(document).trigger('filter.sui.filterable');
      }

      this.each(function () {
        var data;
        var $this = $(this);

        data = $this.data('sui.filterable');
        if (!data) {
          data = new Filterable($this);
          $this.data('sui.filterable', data);
        }

        if (options === 'reset') {
          data.resetFilter();
        } else {
          data.filter(options);
        }
      });

      if (options === 'reset') {
        $(document).trigger('resetEnd.sui.filterable');
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

  $.fn.filterable.noConflict = function () {
    $.fn.filterable = old;
    return this;
  };

  // FILTERABLE DATA-API
  // ===================

  var lastEventTarget;
  var lastEventValue;

  $(document).on(
    'keyup.sui.filterable.data-api change.sui.filterable.data-api',
    '[data-toggle=filter]',
    function (e) {
      var $filter = $(this).closest('form');
      var filterData = [];

      if (lastEventTarget !== e.target || lastEventTarget === e.target &&
        lastEventValue !== e.target.value) {
        $filter.find(':input').each(function () {
          var $this = $(this);
          if ($this.val() !== '' && $this.val() !== null) {
            filterData.push({
              'filter-attrib': $this.data('filter-attrib'),
              'filter-operator': $this.data('filter-operator'),
              'filter-value': $this.val(),
            });
          }

          Plugin.call($($filter.data('filter-target')), filterData);
        });
      }

      lastEventTarget = e.target;
      lastEventValue = e.target.value;
    }
  );

  $(document).on('click.sui.filterable.data-api', '[data-toggle="filter-reset"]', function () {
    var $form = $(this).closest('form');
    $form[0].reset();
    Plugin.call($($form.data('filter-target')), 'reset');
  });

}(jQuery, window, document));
