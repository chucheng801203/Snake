import Game from "./Game.js";
import Vector from "./Vector.js";
import "./main.css";

var game = new Game();

window.addEventListener("keydown", function (e) {
    game.start && game.snake.setDirection(e.key.replace("Arrow", ""));
});

var mousePos = new Vector();
window.addEventListener("touchstart", function (e) {
    if (e.changedTouches.length > 0) {
        mousePos = new Vector(
            e.changedTouches[0].pageX,
            e.changedTouches[0].pageY
        );
    }
});

var touchMoveHandle = throttle(function (e) {
    if (game.start && e.changedTouches.length > 0) {
        var newPos = new Vector(
            e.changedTouches[0].pageX,
            e.changedTouches[0].pageY
        );
        var d = newPos.sub(mousePos);
        if (Math.abs(d.x) > Math.abs(d.y)) {
            if (Math.abs(d.x) > 10) {
                if (d.x > 0) {
                    game.snake.setDirection("right");
                } else {
                    game.snake.setDirection("left");
                }
            }
        } else {
            if (Math.abs(d.y) > 10) {
                if (d.y > 0) {
                    game.snake.setDirection("down");
                } else {
                    game.snake.setDirection("up");
                }
            }
        }
        mousePos = newPos;
    }
}, 100);

window.addEventListener("touchmove", function (e) {
    touchMoveHandle(e);
});

function throttle(func, wait) {
    var n = Date.now();
    return function (e) {
        var now = Date.now();
        if (now - n > wait) {
            func(e);
            n = now;
        }
    };
}
