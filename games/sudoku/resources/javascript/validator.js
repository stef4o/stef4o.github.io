let Validator = (function() {

    let isSafe = function(row, column, number, matrix) {
        return validRow(row, column, number, matrix) &&
            validColumn(row, column, number, matrix) &&
            validBox(row, column, number, matrix);
    }

    let validRow = function(row, column, number, matrix) {
        for (let i = 0; i < 9; ++i)
            if (i != column)
                if (number == matrix[row][i]) return false;
        return true;
    }

    let validColumn = function(row, column, number, matrix) {
        for (let i = 0; i < 9; ++i)
            if (i != row)
                if (number == matrix[i][column]) return false;
        return true;
    }

    let validBox = function(row, column, number, matrix) {
        let x = row,
            y = column;
        row = Math.floor(row - (row % 3));
        column = Math.floor(column - (column % 3));
        for (let i = 0; i < 3; ++i)
            for (let j = 0; j < 3; ++j)
                if ((row + i) != x || (column + j) != y)
                    if (number == matrix[row + i][column + j]) return false;
        return true;
    }

    return {
        isSafe,
        validRow,
        validColumn,
        validBox
    }
})()