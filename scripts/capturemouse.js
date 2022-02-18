const robot = require("robotjs")


function captureMouse(DIM) {
    let scale = DIM.width / robot.getScreenSize().width;
    let pos = robot.getMousePos()
    return {x: Math.round(pos.x * scale), y: Math.round(pos.y * scale)}
}

module.exports = {
    captureMouse: captureMouse
}
