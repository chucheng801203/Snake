import Vector from "../Vector";
import Food from "../Food";
import Snake from "../Snake";
import { floatSub } from "../utils";

const SingleMode = function (game) {
    this.game = game;
    this.snake = null;
    this.food = [];

    this.fps = 80;
    this.maxFps = 180;
    this.timeoutId = null;
};

SingleMode.prototype.generateFood = function () {
    let pos = this.getRandomPosition();

    while (this.checkObstacle(pos.x, pos.y)) {
        pos = this.getRandomPosition();
    }

    this.food.push(
        new Food({
            game: this.game,
            v: pos,
        })
    );
};

SingleMode.prototype.checkObstacle = function (x, y) {
    const check = (v) => floatSub(x, v.x) === 0 && floatSub(y, v.y) === 0;

    if (check(this.snake.head)) {
        return true;
    }

    const body = this.snake.body;
    for (let i = 0; i < body.length; i++) {
        if (check(body[i])) {
            return true;
        }
    }

    for (let i = 0; i < this.food.length; i++) {
        if (check(this.food[i])) {
            return true;
        }
    }

    return false;
};

SingleMode.prototype.getRandomPosition = function () {
    const x = parseInt(Math.random() * this.game.gameWidth);
    const y = parseInt(Math.random() * this.game.gameWidth);

    return new Vector(x, y);
};

SingleMode.prototype.render = function () {
    if (!this.game.start) {
        return;
    }

    const fpsInterval = 1000 / this.fps;

    this.timeoutId = setTimeout(() => {
        this.render();
    }, fpsInterval);

    this.update();

    this.game.drawBg();

    this.snake && this.snake.draw();

    this.food.forEach((f) => {
        f.draw();
    });
};

SingleMode.prototype.update = function () {
    if (!this.game.start) {
        return;
    }

    this.snake.update();

    if (!this.snake.checkBoundary(this.game.gameWidth)) {
        this.gameEnd();
    }

    this.snake.body.forEach((v) => {
        if (
            floatSub(v.x, this.snake.head.x) === 0 &&
            floatSub(v.y, this.snake.head.y) === 0
        ) {
            this.gameEnd();
        }
    });

    this.food.forEach((f, i) => {
        if (
            floatSub(f.v.x, this.snake.head.x) === 0 &&
            floatSub(f.v.y, this.snake.head.y) === 0
        ) {
            if (this.fps < this.maxFps) {
                this.fps += 1;
            }
            this.snake.maxLength += 2;
            this.food.splice(i, 1);
            this.generateFood();
        }
    });
};

SingleMode.prototype.gameEnd = function () {
    this.game.start = false;
    clearTimeout(this.timeoutId);

    const length = this.snake.body.length;
    const score = (length - this.snakeDefaultLength) * 5;
    this.game.score.innerHTML = "Score: " + (score >= 0 ? score : 0);
    this.game.score.style.display = "block";
    this.game.panel.style.display = "flex";
};

SingleMode.prototype.gameStart = function () {
    this.snake = new Snake({
        game: this.game,
    });
    this.snakeDefaultLength = this.snake.maxLength;
    this.food = [];
    this.generateFood();
    this.game.start = true;
    this.game.panel.style.display = "none";
    this.game.title.style.display = "none";

    this.render();
};

export default SingleMode;
