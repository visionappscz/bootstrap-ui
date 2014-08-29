# Data View Table
# Provides client-side sorting functionality.

$(document).ready () ->
    initDataViewTable();

initDataViewTable = () ->
    table = $('[data-view="table"]')
    th = table.find('[data-toggle="sort"]')

    th.prepend('<span class="data-view-table-icon"></span>')
    th.click () ->
        sort(this)
    # Keyboard accessibility for enter and spacebar
    th.keyup (e) ->
        if (e.keyCode == 13 || e.keyCode == 32)
            sort(this)

    sort = (colHeaderEl) ->
        rows = table.find('tbody tr').toArray()
        rows = rows.sort(comparer($(colHeaderEl).index()))

        # Indicate active column and reverse order if the column is already active
        if $(colHeaderEl).hasClass('sorting-active')
            colHeaderEl.asc = !colHeaderEl.asc
        else
            th.removeClass('sorting-active')
            $(colHeaderEl).addClass('sorting-active')

        # Descending order
        if colHeaderEl.asc
            rows = rows.reverse()
            $(colHeaderEl).addClass('sorting-desc')
        else
            $(colHeaderEl).removeClass('sorting-desc')

        # Grouped sorting with navigation
        table.find('thead:gt(0)').remove()
        if table.data('navigation')
            navigation = $(table.data('navigation'))
            navigation.children().remove()
        if $(colHeaderEl).data('group') && $(colHeaderEl).data('group') == 'first-letter'
            isGrouped = true
            colCount = rows[0].childElementCount

        for row in rows
            if isGrouped == true
                letter = getCellValue(row, $(colHeaderEl).index())[0]
                if letter
                    letter = letter.toUpperCase()
                else
                    letter = ''

                if newLetter != letter
                    newLetter = letter
                    if navigation
                        navigation.append('<li><a href="#letter-' + letter + '">' + letter + '</a></li>')
                    table.append($('<thead><tr class="active"><th colspan="' + colCount + '"><h2 class="h3" id="letter-' + newLetter + '">' + newLetter + '</h2></th></tr></thead>'))
                    table.append($('<tbody></tbody>'))

            table.find('tbody:last').append(row)

    comparer = (index) ->
        (a, b) ->
            valA = getCellValue(a, index)
            valB = getCellValue(b, index)
            if $.isNumeric(valA) && $.isNumeric(valB)
                valA - valB
            else
                valA.localeCompare(valB)

    getCellValue = (row, index) ->
        $(row).children('td').eq(index).text()

    defaultSort = table.find('[data-order]')
    if defaultSort.data('order') == 'default'
        sort(defaultSort[0])
    else if defaultSort.data('order') == 'default desc'
        defaultSort[0].asc = !defaultSort[0].asc
        sort(defaultSort[0])

    return
