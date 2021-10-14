import Game from "./Game.js";
import "./main.css";

var game = new Game();
game.init();

window.addEventListener("keydown", function (e) {
    game.snake && game.snake.setDirection(e.key.replace("Arrow", ""));
});

document
    .querySelector("#game .start-btn")
    .addEventListener("click", function () {
        game && game.gameStart();
    });
