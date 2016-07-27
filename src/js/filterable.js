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
        $(document).trigger('resetStart.bui.filterable');
      } else {
        $(document).trigger('filter.bui.filterable');
      }

      this.each(function () {
        var data;
        var $this = $(this);

        data = $this.data('bui.filterable');
        if (!data) {
          data = new Filterable($this);
          $this.data('bui.filterable', data);
        }

        if (options === 'reset') {
          data.resetFilter();
        } else {
          data.filter(options);
        }
      });

      if (options === 'reset') {
        $(document).trigger('resetEnd.bui.filterable');
      } else {
        $(document).trigger('filtered.bui.filterable');
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

  $(window).on('load', function () {
    $.each($('form'), function () {
      var $this = $(this);
      var filterData;

      if ($this.data('filter-storage-id')) {
        var storageId = window.location.pathname + '|' + $this.data('filter-storage-id');
        if (window.sessionStorage.getItem(storageId)) {
          filterData = JSON.parse(window.sessionStorage.getItem(storageId));
          $.each(filterData, function () {
            $this
              .find('[data-filter-attrib=' + this['filter-attrib'] + ']')
              .val(this['filter-value']);
          });

          Plugin.call($($this.data('filter-target')), filterData);
        }
      }
    });
  });

  $(document).on(
    'keyup.bui.filterable.data-api change.bui.filterable.data-api',
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

          if ($filter.data('filter-storage-id')) {
            window.sessionStorage.setItem(
              window.location.pathname + '|' + $filter.data('filter-storage-id'),
              JSON.stringify(filterData)
            );
          }

          Plugin.call($($filter.data('filter-target')), filterData);
        });
      }

      lastEventTarget = e.target;
      lastEventValue = e.target.value;
    }
  );

  $(document).on('click.bui.filterable.data-api', '[data-toggle="filter-reset"]', function () {
    var $filter = $(this).closest('form');
    var storageId = $filter.data('filter-storage-id');

    $filter[0].reset();
    if (storageId) {
      window.sessionStorage.removeItem(window.location.pathname + '|' + storageId);
    }

    Plugin.call($($filter.data('filter-target')), 'reset');
  });

}(jQuery, window, document));
