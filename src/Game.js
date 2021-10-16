import Food from "./Food.js";
import Snake from "./Snake.js";
import Vector from "./Vector.js";

var Game = function (args = {}) {
    var defaults = {
        bw: 30,
        bs: 0,
        gameWidth: 20,
        bgColor: ["#e4e4e4", "#dbdbdb"],
        snake: null,
        start: false,
        food: [],
    };

    for (const argName in defaults) {
        if (Object.hasOwnProperty.call(defaults, argName)) {
            this[argName] = args[argName] ? args[argName] : defaults[argName];
        }
    }
};

Game.prototype.init = function () {
    this.canvas = document.querySelector("#game .mycanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width =
        this.bw * this.gameWidth + this.bs * (this.gameWidth - 1);
    this.canvas.height = this.canvas.width;

    this.update();
    this.render();
};

Game.prototype.getPosition = function (x, y) {
    return new Vector(x * (this.bw + this.bs), y * (this.bw + this.bs));
};

Game.prototype.drawBlock = function (v, color) {
    var pos = this.getPosition(v.x, v.y);

    this.ctx.fillStyle = color;
    this.ctx.fillRect(pos.x, pos.y, this.bw, this.bw);
};

Game.prototype.generateFood = function () {
    var x = parseInt(Math.random() * this.gameWidth);
    var y = parseInt(Math.random() * this.gameWidth);
    this.food.push(
        new Food({
            game: this,
            v: new Vector(x, y),
        })
    );
};

Game.prototype.render = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var y = 0; y < this.gameWidth; y++) {
        for (var x = 0; x < this.gameWidth; x++) {
            this.drawBlock(
                new Vector(x, y),
                this.bgColor[(y + x) % this.bgColor.length]
            );
        }
    }

    this.snake && this.snake.draw();

    this.food.forEach((f) => {
        f.draw();
    });

    requestAnimationFrame(() => {
        this.render();
    });
};

Game.prototype.update = function () {
    if (this.start) {
        this.snake.update();

        if (!this.snake.checkBoundary(this.gameWidth)) {
            this.gameEnd();
        }

        this.snake.body.forEach((v) => {
            if (
                Math.abs(v.x - this.snake.head.x) < this.snake.step / 1000 &&
                Math.abs(v.y - this.snake.head.y) < this.snake.step / 1000
            ) {
                this.gameEnd();
            }
        });

        this.food.forEach((f, i) => {
            if (
                Math.abs(f.v.x - this.snake.head.x) < this.snake.step / 2 &&
                Math.abs(f.v.y - this.snake.head.y) < this.snake.step / 2
            ) {
                this.snake.maxLength += 2;
                this.food.splice(i, 1);
                this.generateFood();
            }
        });
    }

    var speed = this.snake ? parseInt(20 - this.snake.maxLength * 0.1) + 1 : 30;
    setTimeout(
        () => {
            this.update();
        },
        speed < 7 ? 7 : speed
    );
};

Game.prototype.gameEnd = function () {
    this.start = false;

    var length = this.snake.body.length;
    var scoreElem = document.querySelector("#game .panel .score");
    var score = (length - this.snakeDefaultLength) * 5;
    scoreElem.innerHTML = "Score: " + (score >= 0 ? score : 0);
    scoreElem.style.display = "block";
    document.querySelector("#game .panel").style.display = "flex";
};

Game.prototype.gameStart = function () {
    this.snake = new Snake({
        game: this,
    });
    this.snakeDefaultLength = this.snake.maxLength;
    this.food = [];
    this.generateFood();
    this.start = true;
    document.querySelector("#game .panel").style.display = "none";
    document.querySelector("#game .title").style.display = "none";
};

export default Game;
