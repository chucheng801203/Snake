import Food from "./Food.js";
import Snake from "./Snake.js";
import Vector from "./Vector.js";

var Game = function () {
    this.bw = 30;
    this.bs = 0;
    this.gameWidth = 20;
    this.bgColor = ["#eeb825", "rgba(75, 2, 158, 0.227)"];
    this.snake = null;
    this.snakeDefaultLength = 0;
    this.start = false;
    this.food = [];
};

Game.prototype.init = function () {
    var game = document.querySelector("#game");
    this.canvas = game.querySelector(".mycanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width =
        this.bw * this.gameWidth + this.bs * (this.gameWidth - 1);
    this.canvas.height = this.canvas.width;
    game.style.width = this.canvas.width;
    game.style.height = this.canvas.width;

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
    this.food.push(new Food(this, new Vector(x, y)));
};

Game.prototype.render = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var that = this;
    for (var y = 0; y < this.gameWidth; y++) {
        for (var x = 0; x < this.gameWidth; x++) {
            this.drawBlock(
                new Vector(x, y),
                this.bgColor[(y + x) % this.bgColor.length]
            );
        }
    }

    this.snake && this.snake.draw();

    this.food.forEach(function (f) {
        f.draw();
    });

    requestAnimationFrame(function () {
        that.render();
    });
};

Game.prototype.update = function () {
    var that = this;

    if (this.start) {
        this.snake.update();

        if (!this.snake.checkBoundary(this.gameWidth)) {
            this.gameEnd();
        }

        this.snake.body.forEach(function (v) {
            if (
                Math.abs(v.x - that.snake.head.x) < that.snake.step / 1000 &&
                Math.abs(v.y - that.snake.head.y) < that.snake.step / 1000
            ) {
                that.gameEnd();
            }
        });

        this.food.forEach(function (v, i) {
            if (
                Math.abs(v.x - that.snake.head.x) < that.snake.step / 2 &&
                Math.abs(v.y - that.snake.head.y) < that.snake.step / 2
            ) {
                that.snake.maxLength += 2;
                that.food.splice(i, 1);
                that.generateFood();
            }
        });
    }

    var speed = this.snake ? parseInt(20 - this.snake.maxLength * 0.1) + 1 : 30;
    setTimeout(
        function () {
            that.update();
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
    this.snake = new Snake(this);
    this.snakeDefaultLength = this.snake.maxLength;
    this.food = [];
    this.generateFood();
    this.start = true;
    document.querySelector("#game .panel").style.display = "none";
    document.querySelector("#game .title").style.display = "none";
};

export default Game;
