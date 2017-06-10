let Generator = (function() {

    let generateMatrix = function() {
        //let cellsToBeFilled = Math.floor(Math.random() * 10) + 55;
        let matrix = Array(9).fill(null).map(() => Array(9).fill(0));
        for (let i = 0; i < 35; ++i) {
            while (true) {
                let numberToBeInserted = Math.floor(Math.random() * 9) + 1;
                let row = Math.floor(Math.random() * 9);
                let column = Math.floor(Math.random() * 9);

                if (!matrix[row][column])
                    if (Validator.isSafe(row, column, numberToBeInserted, matrix)) {
                        matrix[row][column] = numberToBeInserted;
                        break;
                    }
            }
        }
        return matrix;
    }

    let generateUniqueSudoku = function() {
        let matrix = null;
        let solution = null;
        $("main").fadeOut();
        $("#spinner-loading").fadeIn();
        while (true) {
            matrix = Generator.generateMatrix();
            solution = matrix.map(arr => arr.slice(0));
            if (Solver.solveSudoku(solution)) {
                break;
            }
        }
        $("#spinner-loading").fadeOut(() => {
            $("main").fadeIn();
        });

        return {
            matrix,
            solution
        }
    }

    return {
        generateMatrix,
        generateUniqueSudoku
    }
})();