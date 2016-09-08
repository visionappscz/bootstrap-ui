/*!
 * Bootstrap UI
 * Built on the shoulders of a giant: Bootstrap 3
 * http://www.bootstrap-ui.com
 *
 * Created by VisionApps (www.visionapps.cz)
 *
 * v2.3.2 (8 September 2016)
 */
;(function ($, window) {
  'use strict';

  // CKEDITOR-LOADER DATA-API
  // ========================

  (function ($, window) {
    // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).on('load', function () {
      $('[data-onload-ckeditor]').each(function () {
        var language = $('html').attr('lang');
        var confObj = {};
        var $this = $(this);
        var confValue = $this.data('onload-ckeditor');

        if (confValue) {
          if (typeof confValue === 'object') {
            confObj = confValue;
          } else {
            confObj = { customConfig: confValue };
          }
        }

        if (language && !confObj.hasOwnProperty('language')) {
          confObj.language = language;
        }

        $this.ckeditor(confObj);
      });
    });
  }($, window));

}(jQuery, window));

;(function ($, window, document) {
  'use strict';

  // CONFIRMATION CLASS DEFINITION
  // =============================

  var Confirmation = function ($triggerEl, options) {
    options = $.extend({}, this.options, options);
    this.modal = this.getModal(
        options['confirm-message'],
        options['confirm-yes'],
        options['confirm-no']
    );
    this.$triggerEl = $triggerEl;
    this.callback = options.callback;
  };

  Confirmation.prototype.options = {
    'confirm-message': 'Are you sure?',
    'confirm-yes': 'Yes',
    'confirm-no': 'No',
    callback: function () {}, // Having empty callback is useless, it is here as a sane fallback for
    // tests
  };

  Confirmation.prototype.showConfirmation = function () {
    var $triggerEl = this.$triggerEl;
    var callback = this.callback;
    var $modal = this.modal.modal({
      keboard: false,
      backdrop: 'static',
    });

    $triggerEl.trigger('show.bui.confirmation');
    $triggerEl.on('rejected.bui.confirmation', function () {
      callback(false);
    });

    $triggerEl.on('confirmed.bui.confirmation', function () {
      callback(true);
    });

    $triggerEl.on('rejected.bui.confirmation confirmed.bui.confirmation', function () {
      $modal.on('hidden.bs.modal', function () {
        $(this).remove();
      });

      // The fade class is removed before hiding the modal to prevent the backdrop from staying
      // behond
      // Thats why there is no animation :(
      // http://stackoverflow.com/questions/22056147/bootstrap-modal-backdrop-remaining
      $modal.removeClass('fade').modal('hide');
      $triggerEl.off('rejected.bui.confirmation confirmed.bui.confirmation');
    });

    $modal.on('keydown.bui.confirmation', function (e) {
      if (e.keyCode === 27) { //escape
        $triggerEl.trigger('rejected.bui.confirmation');
      } else if (e.keyCode === 13) { //enter
        $triggerEl.trigger('confirmed.bui.confirmation');
      }
    });

    $modal
      .find('[data-confirmation=reject]')
      .on('click.bui.confirmation', function () {
        $triggerEl.trigger('rejected.bui.confirmation');
      });

    $modal
      .find('[data-confirmation=confirm]')
      .on('click.bui.confirmation', function () {
        $triggerEl.trigger('confirmed.bui.confirmation');
      });
  };

  Confirmation.prototype.getModal = function (message, yes, no) {
    return $('<div class="modal fade" tabindex="-1">' +
      '<div class="modal-dialog modal-sm">' +
      '<div class="modal-content">' +
      '<div class="modal-body">' + message + '</div>' +
      '<div class="modal-footer">' +
      '<button type="button" class="btn btn-default" data-confirmation="reject">' + no +
      '</button>' + '<button type="button" class="btn btn-primary" data-confirmation="confirm">' +
      yes + '</button></div></div></div></div>');
  };

  // CONFIRMATION PLUGIN DEFINITION
  // ==============================

  function Plugin(options) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bui.confirmation');

      if (!data) {
        data = new Confirmation($this, options);
        $this.data('bui.confirmation', data);
      }

      data.showConfirmation();
    });
  }

  var old = $.fn.confirmation;

  $.fn.confirmation = Plugin;
  $.fn.confirmation.Constructor = Confirmation;

  // CONFIRMATION NO CONFLICT
  // ========================
  $.fn.confirmation.noConflict = function () {
    $.fn.confirmation = old;
    return this;
  };

  // CONFIRMATION DATA-API
  // =====================

  $(document).on('click.bui.confirmation.data-api', '[data-toggle=confirm]',
    function (e, noConfirm) {
      var $this = $(this);

      if (!noConfirm) {
        e.preventDefault();

        Plugin.call($this, {
          'confirm-message': $this.data('confirm-message'),
          'confirm-yes': $this.data('confirm-yes'),
          'confirm-no': $this.data('confirm-no'),
          callback: function (result) {
            if (result) {
              $this.trigger('click.bui.confirmation.data-api', true);
            }
          },
        });
      }
    }
  );

}(jQuery, window, document));

;(function ($, moment, window) {
  'use strict';

  var DatetimePickerLoader = function ($element) {
    this.$element = $element;
  };

  DatetimePickerLoader.prototype.filterLocale = function (locale) {
    return moment.locale(locale);
  };

  DatetimePickerLoader.prototype.init = function (confObj) {
    confObj.locale = this.filterLocale(confObj.locale);
    this.$element.datetimepicker(confObj);
  };

  // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
  // and thus it would make it impossible to test this part of the code.
  $(window).on('load', function () {
    var initComponentFn = function (inlineConf) {
      var datetimePickerLoader = new DatetimePickerLoader($(this));
      var conf = {
        allowInputToggle: true,
        sideBySide: true,
        locale: $('html').attr('lang'),
      };

      if (inlineConf) {
        $.extend(conf, inlineConf);
      }

      datetimePickerLoader.init(conf);
    };

    // CKEDITOR-LOADER DATA-API
    // ========================

    $('[data-onload-datetimepicker]').each(function () {
      initComponentFn.call(this, $(this).data('onload-datetimepicker'));
    });
  });

}(jQuery, moment, window));

;(function ($, window, document) {
  'use strict';

  // DISABLE CLASS DEFINITION
  // ========================
  var Disable = function ($element) {
    this.$element = $element;
  };

  Disable.prototype.toggle = function () {
    $(document).trigger('toggle.bui.disable');
    this.$element.prop('disabled', !this.$element.prop('disabled'));
    $(document).trigger('toggled.bui.disable');
  };

  // DISABLE PLUGIN DEFINITION
  // =========================

  function Plugin() {
    this.each(function () {
      var $this = $(this);
      var data = $this.data('bui.disable');

      if (!data) {
        data = new Disable($this);
        $this.data('bui.disable', data);
      }

      data.toggle();
    });

    return this;
  }

  var old = $.fn.disable;

  $.fn.disable = Plugin;
  $.fn.disable.Constructor = Disable;

  // DISABLE NO CONFLICT
  // ===================

  $.fn.disable.noConflict = function () {
    $.fn.disable = old;
    return this;
  };

  // DISABLE DATA-API
  // ================

  (function (Plugin, $, window) {
    // We have to use $(window).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).on('load', function () {
      var $controls = $('[data-toggle=disable]');

      $controls.each(function () {
        var $this = $(this);
        var eventType = $this.data('disable-event');
        if (!eventType) {
          eventType = 'change';
        }

        $this.on(eventType + '.bui.disable.data-api', function () {
          Plugin.call($($this.data('disable-target')));
        });
      });
    });
  }(Plugin, $, window));

}(jQuery, window, document));

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

;(function ($, window) {
  'use strict';

  // SELECT2-LOADER DATA-API
  // ========================

  (function ($, window) {
    // We have to use $(winodow).load() as $(document).ready() can not be triggered manually
    // and thus it would make it impossible to test this part of the code.
    $(window).on('load', function () {
      $('[data-onload-select2]').each(function () {
        var confObj = {};
        var $this = $(this);
        var confValue = $this.data('onload-select2');
        var formatFunc = function (option) {
          var $optionEl = $(option.element);
          var imageSrc = $optionEl.data('image-src');
          var imageSrcset = $optionEl.data('image-srcset');
          var imageHeight = $optionEl.data('image-height');
          var imageWidth = $optionEl.data('image-width');
          var attribs = '';

          if (imageSrc) {
            attribs = 'src="' + imageSrc + '" alt="' + option.text + '"';
            if (imageSrcset) {
              attribs = attribs + ' srcset="' + imageSrcset + '"';
            }

            if (imageHeight) {
              attribs = attribs + ' height="' + imageHeight + '"';
            }

            if (imageWidth) {
              attribs = attribs + ' width="' + imageWidth + '"';
            }

            return '<img ' + attribs + '>&nbsp;' + option.text;
          }

          return option.text;
        };

        if (confValue) {
          confObj = confValue;
        }

        confObj.formatSelection = formatFunc;
        confObj.formatResult = formatFunc;
        confObj.escapeMarkup = function (m) { return m; };

        $this.select2(confObj);
      });
    });
  }($, window));

}(jQuery, window));

;(function ($, window, document) {
  'use strict';

  // SLUGGER CLASS DEFINITION
  // ========================
  var Slugger = function ($source, options) {
    this.$source = $source;
    this.$target = options.target;
  };

  Slugger.prototype.updateSlug = function () {
    var generateSlug = function (str) {
      var from = 'ãàáäâåčçďẽèéëêìíïîñõòóöôřšťùúüûýž·/_,:;';
      var to   = 'aaaaaaccdeeeeeiiiinooooorstuuuuyz------';

      str = str
        .replace(/^\s+|\s+$/g, '') //trim
        .toLowerCase();

      for (var i = 0; i < from.length; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
      }

      str = str
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

      return str;
    };

    this.$target.val(generateSlug(this.$source.val()));
    this.$source.trigger('updated.bui.slugger');
  };

  // SLUGGER PLUGIN DEFINITION
  // =========================

  function Plugin(options) {
    this.each(function () {
      var $this = $(this);
      var data = $this.data('bui.slugger');

      if (!data) {
        data = new Slugger($this, options);
        $this.data('bui.slugger', data);
      }

      data.updateSlug();
    });

    return this;
  }

  var old = $.fn.slugger;

  $.fn.slugger = Plugin;
  $.fn.slugger.Constructor = Slugger;

  // SLUGGER NO CONFLICT
  // ===================

  $.fn.slugger.noConflict = function () {
    $.fn.slugger = old;
    return this;
  };

  // SLUGGER DATA-API
  // ================

  $(document)
    .on('keyup.bui.slugger.data-api', '[data-toggle=slugger]', function () {
      $('[data-toggle=slugger]').each(function () {
        var $this = $(this);
        Plugin.call($this, { target: $($this.data('slugger-target')) });
      });
    })
    .on('change.bui.slugger.data-api', '[data-toggle=slugger]', function () {
      $(this).trigger('changed.bui.slugger');
    });

}(jQuery, window, document));

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

//# sourceMappingURL=bootstrap-ui.js.map