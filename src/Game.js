import Vector from "./Vector.js";
import SingleMode from "./modes/SingleMode.js";

const Game = function (args = {}) {
    this.args = args;

    this.canvas = document.querySelector("#mycanvas");
    this.panel = document.querySelector("#panel");
    this.score = document.querySelector("#panel .score");
    this.title = document.querySelector("#panel .title");
    this.startBtn = document.querySelector("#panel .start-btn");
    this.mode = null;

    this.startBtn.addEventListener("click", () => {
        if (this.start && this.mode) this.mode.gameEnd();

        this.mode = new SingleMode(this);
        this.mode.gameStart();
    });

    this.init();
};

Game.prototype.initArgs = function (args = {}) {
    const defaults = {
        bw: 30,
        bs: 0,
        gameWidth: 20,
        bgColor: ["#e4e4e4", "#dbdbdb"],
        start: false,
    };

    for (const argName in defaults) {
        if (Object.hasOwnProperty.call(defaults, argName)) {
            this[argName] = args[argName] ? args[argName] : defaults[argName];
        }
    }
};

Game.prototype.init = function () {
    this.initArgs(this.args);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width =
        this.bw * this.gameWidth + this.bs * (this.gameWidth - 1);
    this.canvas.height = this.canvas.width;

    this.score.innerHTML = "Score: 0";
    this.score.style.display = "none";
    this.panel.style.display = "flex";
    this.title.style.display = "block";

    this.drawBg();
};

Game.prototype.getPosition = function (x, y) {
    return new Vector(x * (this.bw + this.bs), y * (this.bw + this.bs));
};

Game.prototype.drawBlock = function (v, color) {
    const pos = this.getPosition(v.x, v.y);

    this.ctx.fillStyle = color;
    this.ctx.fillRect(pos.x, pos.y, this.bw, this.bw);
};

Game.prototype.drawBg = function () {
    for (let y = 0; y < this.gameWidth; y++) {
        for (let x = 0; x < this.gameWidth; x++) {
            this.drawBlock(
                new Vector(x, y),
                this.bgColor[(y + x) % this.bgColor.length]
            );
        }
    }
};

export default Game;
