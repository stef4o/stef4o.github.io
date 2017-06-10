let keyboard = $("#keyboard");
let lastCellAccess = null;
let currentMatrix = null;
let currentSolution = null;
let timer = null;
let hintsActive = false;
let games = [];

let initializeGrid = function() {
    clearTheGrid();
    resetState();
    $("#spinner-loading").fadeIn();
    $("main").fadeOut();
    setTimeout(() => {
        let obj = Generator.generateUniqueSudoku();
        setMatrixAndSolution(obj.matrix, obj.solution);
        fillInTheGrid(obj.matrix);
        // Solver.printInConsole(obj.solution);
        startTiming();
    }, 1000);
    refreshGamesPanel();
}

let fillInTheGrid = function(matrix) {
    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            if (matrix[i][j] != 0) {
                $(`#cell-${i}-${j} > input`).val(matrix[i][j]);
                $(`#cell-${i}-${j} > input`).prop("disabled", true);
                $(`#cell-${i}-${j}`).addClass("disabled_cell");
            } else {
                showHints();
            }
        }
    }
}

let fillInThePossibleChoices = function() {
    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            if (!currentMatrix[i][j]) {
                fillTheCellWithPossibleChoices(i, j);
            } else {
                $(`#cell-${i}-${j}`).find("div").text("");
            }
        }
    }
}

let removePossibleChoices = function() {
    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            if (!currentMatrix[i][j]) {
                $(`#cell-${i}-${j}`).find("div").text("");
            }
        }
    }
}

let showHints = function() {
    if (hintsActive)
        fillInThePossibleChoices();
    else
        removePossibleChoices();
}

let fillTheCellWithPossibleChoices = function(row, column) {
    let choices = recursiveFormatText(1, row, column, 0);
    let element = $(`#cell-${row}-${column}`);
    element.find("div").text(choices);
}

let recursiveFormatText = function(number, row, column, choicesAdded) {
    if (number > 9) return "";
    else {
        if (Validator.isSafe(row, column, number, currentMatrix)) {
            if (choicesAdded == 0) {
                return `${number}` + recursiveFormatText(number + 1, row, column, choicesAdded + 1);
            } else if (choicesAdded % 2 == 0) {
                return `\n${number}` + recursiveFormatText(number + 1, row, column, choicesAdded + 1);
            } else if (choicesAdded % 2 < 2) {
                return `, ${number}` + recursiveFormatText(number + 1, row, column, choicesAdded + 1);
            }
        } else {
            return recursiveFormatText(number + 1, row, column, choicesAdded);
        }
    }
}

let resetState = function() {
    $("#sudokuGrid").removeClass("valid-solution").removeClass("invalid-solution");
    for (let row = 0; row < 9; ++row) {
        for (let column = 0; column < 9; ++column) {
            $(`#cell-${row}-${column}`).removeClass("warning");
        }
    }
}

let setMatrixAndSolution = (matrix, solution) => {
    currentMatrix = matrix;
    currentSolution = solution;
}

let clearTheGrid = function() {
    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            $(`#cell-${i}-${j} > input`).val("");
            $(`#cell-${i}-${j} > input`).prop("disabled", false);
        }
    }
}

let checkInput = function(row, column, number) {
    if (Validator.isSafe(row, column, number, currentMatrix)) {
        currentMatrix[row][column] = number;
        return true;
    }
    return false;
}

let checkForAMistakes = function(row, column, number, currentMatrix) {
    let validRow = Validator.validRow(row, column, number, currentMatrix);
    let validColumn = Validator.validColumn(row, column, number, currentMatrix);
    let validBox = Validator.validBox(row, column, number, currentMatrix);
    return { validBox, validRow, validColumn };
}

let markTheMistake = function(row, column, number, currentMatrix) {
    let mistakeObj = checkForAMistakes(row, column, number, currentMatrix);
    if (!mistakeObj.validBox && !mistakeObj.validRow && !mistakeObj.validColumn) {
        markABox(row, column, function(element) { element.addClass("warning"); })
        markARow(row, function(element) { element.addClass("warning"); });
        markAColumn(column, function(element) { element.addClass("warning"); });
    }
    if (!mistakeObj.validRow && mistakeObj.validBox) markARow(row, function(element) { element.addClass("warning"); });
    if (!mistakeObj.validColumn && mistakeObj.validBox) markAColumn(column, function(element) { element.addClass("warning"); });
    if (!mistakeObj.validBox) markABox(row, column, function(element) { element.addClass("warning"); });
}

let markARow = function(row, fn) {
    for (let column = 0; column < 9; ++column) {
        fn($(`#cell-${row}-${column}`));
    }
}

let markAColumn = function(column, fn) {
    for (let row = 0; row < 9; ++row) {
        fn($(`#cell-${row}-${column}`));
    }
}

let markABox = function(row, column, fn) {
    row = Math.floor(row - (row % 3));
    column = Math.floor(column - (column % 3));
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            fn($(`#cell-${row+i}-${column+j}`));
        }
    }
}

let removeMistakeWarnings = function() {
    for (let row = 0; row < 9; ++row) {
        for (let column = 0; column < 9; ++column) {
            $(`#cell-${row}-${column}`).removeClass("warning");
        }
    }
}

let startTiming = function() {
    timer = new Timer();
    timer.start();
    setInterval(() => {
        $("#timing > div").text(TimeHelper.parse(timer.getTime()));
    }, 50);
}

let checkUserSolution = function() {
    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            if (currentMatrix[i][j] != currentSolution[i][j]) return false;
        }
    }
    return true;
}

let setANumber = function(element) {
    let row = parseInt(element.parent().attr('id')[5]);
    let column = parseInt(element.parent().attr('id')[7]);
    let number = parseInt(element.val());
    currentMatrix[row][column] = number | 0;
    if (currentMatrix[row][column])
        if (Validator.isSafe(row, column, number, currentMatrix)) {
            removeMistakeWarnings();
            checkForAValidSolution();
        } else {
            markTheMistake(row, column, number, currentMatrix);
        }
    showHints();
}

let checkForAValidSolution = function() {
    if (Solver.FindEmptyCells(currentMatrix).row == -1) {
        if (checkUserSolution()) {
            $("#sudokuGrid").addClass("valid-solution");
            timer.stop();
            games.push({
                gameNumber: games.length + 1,
                time: timer.getTime()
            });
            refreshGamesPanel();
        } else {
            $("#sudokuGrid").addClass("invalid-solution");
        }
    } else console.log("Still has blank fields!");
}

let refreshGamesPanel = function() {
    if (games.length) {
        $("#games").html("");
        games.forEach((game) => {
            $("#games").append(`
            <div>
                <div>${game.gameNumber}</div>
                <div>${TimeHelper.normalizeTime((game.time.hours)) | 0}:${TimeHelper.normalizeTime(game.time.minutes)}:${TimeHelper.normalizeTime(game.time.seconds)}</div>
            </div>
        `);
        });
    } else {
        $("#games").html(`
            <div class="info-games">You have not played games yet.</div>
        `);
    }
    refreshAverageTime();
}

let refreshAverageTime = function() {
    if (games.length) {
        let avgTime = calculateAverageTime();
        let avgMessage = TimeHelper.parse({
            seconds: Math.floor(avgTime % 60),
            minutes: Math.floor(avgTime / 60),
            hours: Math.floor(avgTime / 3600)
        });
        $("#time").text(avgMessage);
    }
}

let calculateAverageTime = function() {
    let averageTime = 0;
    if (games.length) {
        games.forEach(game => averageTime += game.time.totalTimeInSeconds);
        averageTime = Math.floor(averageTime / games.length);
    }
    return averageTime;
}

$(() => {
    createSudokuTable();

    initializeGrid();

    $(".cell-box > input").on("focus", function() {
        keyboard.fadeIn();
    })

    $(".cell-box > input").on("blur", function() {
        lastCellAccess = $(this);
        keyboard.fadeOut();
        setANumber(lastCellAccess);
    })

    $("#play").on('click', () => {
        initializeGrid();
    })

    $("#stop").on('click', () => {
        timer.stop();
        console.log(timer.getTime());
    })

    $("#solve").on('click', () => {
        timer.stop();
        fillInTheGrid(currentSolution);
    })

    $("#hint").on('click', () => {
        hintsActive = !hintsActive;
        let element = $("#hint > i");
        if (hintsActive) {
            element.removeClass("bulb_off");
            element.addClass("bulb_on");
            timer.increaseTimeBy(10);
        } else {
            element.removeClass("bulb_on");
            element.addClass("bulb_off");
            timer.increaseTimeBy(1);
        }
        showHints();
    })

    $("#keyboard > div").on('click', function() {
        lastCellAccess.val($(this).text());
        setANumber(lastCellAccess);
    })
})