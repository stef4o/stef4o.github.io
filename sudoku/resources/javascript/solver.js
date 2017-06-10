let Solver = (function() {

    let solveSudoku = function(matrix) {
        let matrixState = FindEmptyCells(matrix);
        if (matrixState.row == -1) {
            return true;
        }

        for (let number = 1; number < 10; ++number) {
            if (Validator.isSafe(matrixState.row, matrixState.column, number, matrix)) {
                matrix[matrixState.row][matrixState.column] = number;
                if (solveSudoku(matrix))
                    return true;
                matrix[matrixState.row][matrixState.column] = 0;
            }
        }
        return false;
    }

    let FindEmptyCells = function(matrix) {
        let i, j;
        for (i = 0; i < 9; ++i) {
            for (j = 0; j < 9; ++j) {
                if (matrix[i][j] == 0)
                    return {
                        row: i,
                        column: j
                    }
            }
        }
        return {
            row: -1,
            column: -1
        }
    }

    let printInConsole = function(matrix) {
        for (let i = 0; i < 9; ++i) {
            let message = "";
            for (let j = 0; j < 9; ++j) {
                message += `${matrix[i][j]} `;
            }
            console.log(message);
        }
        console.log("END--------------");
    }

    return {
        FindEmptyCells,
        printInConsole,
        solveSudoku
    }

})();