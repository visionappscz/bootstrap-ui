(function() {
  var initDataViewTable;

  $(document).ready(function() {
    return initDataViewTable();
  });

  initDataViewTable = function() {
    var comparer, defaultSort, getCellValue, sort, table, th;
    table = $('[data-view="table"]');
    th = table.find('[data-toggle="sort"]');
    th.prepend('<span class="data-view-table-icon"></span>');
    th.click(function() {
      return sort(this);
    });
    th.keyup(function(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        return sort(this);
      }
    });
    sort = function(colHeaderEl) {
      var colCount, isGrouped, letter, navigation, newLetter, row, rows, _i, _len, _results;
      rows = table.find('tbody tr').toArray();
      rows = rows.sort(comparer($(colHeaderEl).index()));
      if ($(colHeaderEl).hasClass('sorting-active')) {
        colHeaderEl.asc = !colHeaderEl.asc;
      } else {
        th.removeClass('sorting-active');
        $(colHeaderEl).addClass('sorting-active');
      }
      if (colHeaderEl.asc) {
        rows = rows.reverse();
        $(colHeaderEl).addClass('sorting-desc');
      } else {
        $(colHeaderEl).removeClass('sorting-desc');
      }
      table.find('thead:gt(0)').remove();
      if (table.data('navigation')) {
        navigation = $(table.data('navigation'));
        navigation.children().remove();
      }
      if ($(colHeaderEl).data('group') && $(colHeaderEl).data('group') === 'first-letter') {
        isGrouped = true;
        colCount = rows[0].childElementCount;
      }
      _results = [];
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        if (isGrouped === true) {
          letter = getCellValue(row, $(colHeaderEl).index())[0];
          if (letter) {
            letter = letter.toUpperCase();
          } else {
            letter = '';
          }
          if (newLetter !== letter) {
            newLetter = letter;
            if (navigation) {
              navigation.append('<li><a href="#letter-' + letter + '">' + letter + '</a></li>');
            }
            table.append($('<thead><tr class="active"><th colspan="' + colCount + '"><h2 class="h3" id="letter-' + newLetter + '">' + newLetter + '</h2></th></tr></thead>'));
            table.append($('<tbody></tbody>'));
          }
        }
        _results.push(table.find('tbody:last').append(row));
      }
      return _results;
    };
    comparer = function(index) {
      return function(a, b) {
        var valA, valB;
        valA = getCellValue(a, index);
        valB = getCellValue(b, index);
        if ($.isNumeric(valA) && $.isNumeric(valB)) {
          return valA - valB;
        } else {
          return valA.localeCompare(valB);
        }
      };
    };
    getCellValue = function(row, index) {
      return $(row).children('td').eq(index).text();
    };
    defaultSort = table.find('[data-order]');
    if (defaultSort.data('order') === 'default') {
      sort(defaultSort[0]);
    } else if (defaultSort.data('order') === 'default desc') {
      defaultSort[0].asc = !defaultSort[0].asc;
      sort(defaultSort[0]);
    }
  };

}).call(this);
