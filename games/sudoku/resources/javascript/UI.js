let createSudokuTable = function() {
    let container = $("#sudokuGrid");

    for (let i = 0; i < 9; ++i) {
        let element = `<div id="box-${i}" class="grid-box"></div>`;
        if (i == 1 || i == 3 || i == 5 || i == 7)
            element = `<div id="box-${i}" class="grid-box dark-theme"></div>`;
        container.append(element);
    }

    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            let element = `<div id="cell-${i}-${j}" class="cell-box">
                                <div class="possible_choices"></div>
                                <input type="text">
                           </div>`;
            let boxId = undefined;
            if (i < 3) {
                if (j < 3) boxId = 0;
                if (j > 2 && j < 6) boxId = 1;
                if (j > 5 && j < 9) boxId = 2;
            } else if (i > 2 && i < 6) {
                if (j < 3) boxId = 3;
                if (j > 2 && j < 6) boxId = 4;
                if (j > 5 && j < 9) boxId = 5;
            } else if (i > 5) {
                if (j < 3) boxId = 6;
                if (j > 2 && j < 6) boxId = 7;
                if (j > 5 && j < 9) boxId = 8;
            }
            $(`#box-${boxId}`).append(element);
        }
    }
}