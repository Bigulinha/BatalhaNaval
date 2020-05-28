function showTry(e) {
    var parent = e.parentElement;
    parent.children[0].setAttribute("hidden", "hidden");
    parent.children[1].removeAttribute("hidden");
}
function ramdomizeGrid() {
    var matrix = getMatrix();
    var ships = getShipObject();
    for (var i = 0; i < ships.length; ++i) {
        for (var j = 0; j < ships[i].shipQuantity; ++j) {
            var direction = getDirection();
            if (direction === "horizontal") {
                matrix = ramdomizeGridHorizontal(matrix, ships[i]);
            } else {
                matrix = ramdomizeGridVertical(matrix, ships[i]);
            }
        }
    }
}
function ramdomizeGridHorizontal(matrix, ship) {
    var availableRowSpaces = getVerificationSpaceHorizontal(matrix, ship.shipSize);
    var row_availableSpaces = getRndInteger(0, availableRowSpaces.length - 1);
    var row = availableRowSpaces[row_availableSpaces].row;
    var column = getRndInteger(availableRowSpaces[row_availableSpaces].init, availableRowSpaces[row_availableSpaces].init + (availableRowSpaces[row_availableSpaces].gap - ship.shipSize));
    for (var k = column; k < column + ship.shipSize; ++k) {
        matrix[row][k] = ship.shipSize;
    }
    return matrix;
}
function ramdomizeGridVertical(matrix, ship) {
    var availableColumnSpaces = getVerificationSpaceVertical(matrix, ship.shipSize);
    var column_availableSpaces = getRndInteger(0, availableColumnSpaces.length - 1);
    var column = availableColumnSpaces[column_availableSpaces].column;
    var row = getRndInteger(availableColumnSpaces[column_availableSpaces].init, availableColumnSpaces[column_availableSpaces].init + (availableColumnSpaces[column_availableSpaces].gap - ship.shipSize));

    for (var k = row; k < row + ship.shipSize; ++k) {
        matrix[k][column] = ship.shipSize;
    }
    return matrix;
}
function getDirection() {
    var rand = getRndInteger(0, 1);
    if (rand === 0)
        return "horizontal";
    return "vertical";
}
function getMatrix() {
    var matrix = Array(7).fill(undefined);
    for (const i in matrix) {
        matrix[i] = Array(7).fill(0);
    }

    return matrix;
}
function getShipObject() {
    return [
        { shipSize: 5, shipQuantity: 1 },
        { shipSize: 4, shipQuantity: 2 },
        { shipSize: 3, shipQuantity: 2 },
        { shipSize: 2, shipQuantity: 3 }
    ];
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getVerificationSpaceHorizontal(matrix, shipSize) {
    var horizontalSpaces = new Array();
    var sum = 0, total = 0, init = 0;
    for (var i = 0; i < 7; ++i) {
        for (var j = 0; j < 7; ++j) {
            if (matrix[i][j] === 0) {
                if (sum === 0) {
                    init = j;
                }
                ++sum;
            } else {
                if (total < sum) {
                    total = sum;
                    init_total = init;
                }
                sum = 0;
            }
        }
        if (sum > total) {
            total = sum;
            init_total = init;
        }
        if (shipSize <= total) {
            var obj = { init: init_total, gap: total, row: i };
            horizontalSpaces.push(obj);
        }
        sum = 0;
        total = 0;
    }
    return horizontalSpaces;
}
function getVerificationSpaceVertical(matrix, shipSize) {
    var verticalSpaces = new Array();
    var sum = 0, total = 0, init = 0, init_total = 0;
    for (var j = 0; j < 7; ++j) {
        for (var i = 0; i < 7; ++i) {
            if (matrix[i][j] === 0) {
                if (sum === 0) {
                    init = i;
                }
                ++sum;
            } else {
                if (total < sum) {
                    total = sum;
                    init_total = init;
                }
                sum = 0;
            }

        }
        if (sum > total) {
            total = sum;
            init_total = init;
        }
        if (shipSize <= total) {
            var obj = { init: init_total, gap: total, column: j };
            verticalSpaces.push(obj);
        }
        sum = 0;
        total = 0;
    }
    return verticalSpaces;
}