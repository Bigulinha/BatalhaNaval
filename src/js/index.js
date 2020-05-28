function showTry(e) {

    var parent = e.parentElement;
    parent.children[0].setAttribute("hidden", "hidden");
    parent.children[1].removeAttribute("hidden");    
}
function ramdomizeGrid() {
   
}
function getShipSpace(shipSize) {

    return 7 - (shipSize - 1);
}
function getDirection() {

    var rand = Math.floor(Math.random() * (2));   
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