function onBoardClick(e) {
    var parent = e.parentElement;
    if (parent.children[0].getAttribute("hidden") === "hidden")
        return;
    showTry(parent);
    if (!parent.children[1].src.includes("agua_tem_nada"))
        calculateScore(parent.children[1]);
    movesForCurrentPlayer();
}
function showTry(parent) {
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
                setHorizontalShip(matrix, ships[i], j);
            } else {
                setVerticalShip(matrix, ships[i], j);
            }
        }
    }
}
function setHorizontalShip(matrix, ship, currentShip) {
    var availableRowSpaces = getVerificationSpaceHorizontal(matrix, ship.shipSize);
    var row_availableSpaces = getRndInteger(0, availableRowSpaces.length - 1);
    var row = availableRowSpaces[row_availableSpaces].row;
    var init = availableRowSpaces[row_availableSpaces].init;
    var gap = availableRowSpaces[row_availableSpaces].gap;
    var column = getRndInteger(init, init + (gap - ship.shipSize));
    var count = 0;
    for (var k = column; k < column + ship.shipSize; ++k) {
        matrix[row][k] = ship.shipSize;
        insertHtmlShipImg(row, k, ship.shipSize, "horizontal", count++, currentShip);
    }
}
function setVerticalShip(matrix, ship, currentShip) {
    var availableColumnSpaces = getVerificationSpaceVertical(matrix, ship.shipSize);
    var column_availableSpaces = getRndInteger(0, availableColumnSpaces.length - 1);
    var column = availableColumnSpaces[column_availableSpaces].column;
    var init = availableColumnSpaces[column_availableSpaces].init;
    var gap = availableColumnSpaces[column_availableSpaces].gap;
    var row = getRndInteger(init, init + (gap - ship.shipSize));
    var count = 0;
    for (var k = row; k < row + ship.shipSize; ++k) {
        matrix[k][column] = ship.shipSize;
        insertHtmlShipImg(k, column, ship.shipSize, "vertical", count++, currentShip);
    }
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
        { shipSize: 5, shipQuantity: 1, shipPoints: 10 },
        { shipSize: 4, shipQuantity: 1, shipPoints: 8 },
        { shipSize: 3, shipQuantity: 2, shipPoints: 6 },
        { shipSize: 2, shipQuantity: 3, shipPoints: 4 }
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
function insertHtmlShipImg(row, column, shipSize, direction, count, currentShip) {
    var htmlRows = document.getElementsByClassName("row");
    var selectedRow = htmlRows[row];
    var selectedColumn = selectedRow.children[column];
    var selectedImage = selectedColumn.children[1];
    var newSrcImg = selectedImage.src.replace("water", "ships/" + direction + "/" + shipSize).replace("agua_tem_nada", count);
    selectedImage.src = newSrcImg;
    if (count === 0) {
        selectedImage.setAttribute("remaining", shipSize);
        selectedImage.id = "ship" + shipSize + "position" + currentShip;
        selectedImage.setAttribute("headShip", "ship" + shipSize + "position" + currentShip);
        selectedImage.setAttribute("shipSize", shipSize);
    } else {
        var headShip = $("#ship" + shipSize + "position" + currentShip)[0].id;
        selectedImage.setAttribute("headShip", headShip);
    }
}
function calculateScore(currentImageShip) {
    var headShipId = currentImageShip.getAttribute("headShip");
    var headShip = document.getElementById(headShipId);
    var remainingShips = headShip.getAttribute("remaining");
    remainingShips = parseInt(remainingShips) - 1;
    headShip.setAttribute("remaining", remainingShips);
    if (remainingShips === 0) {
        var shipSize = parseInt(headShip.getAttribute("shipSize"));
        var allShips = getShipObject();
        var shipScore = allShips.find(f => f.shipSize === shipSize).shipPoints;
        var currentPlayer = document.getElementById("grid").getAttribute("currentPlayer");
        currentPlayer = parseInt(currentPlayer);
        currentPlayer = document.getElementById("players").children[currentPlayer];
        var totalScore = currentPlayer.getAttribute("score");
        totalScore = parseInt(totalScore) + shipScore;
        currentPlayer.setAttribute("score", totalScore);
    }
}
function movesForCurrentPlayer() {
    var board = document.getElementById("grid");
    var moves = board.getAttribute("movesPlayed");
    moves = parseInt(moves) + 1;
    board.setAttribute("movesPlayed", moves);
    changePlayer(moves, board);
}
function changePlayer(moves, board) {
    if (moves === 5) {
        board.setAttribute("movesPlayed", 0);
        var player = board.getAttribute("currentPlayer");
        player = parseInt(player) + 1;
        board.setAttribute("currentPlayer", player);
    }
}
