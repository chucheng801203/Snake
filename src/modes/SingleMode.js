import Vector from "../Vector";
import Food from "../Food";
import Snake from "../Snake";

const SingleMode = function (game) {
    this.game = game;
    this.snake = null;
    this.food = [];
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
    const check = (v) =>
        Math.abs(x - v.x) < this.snake.step / 1000 &&
        Math.abs(y - v.y) < this.snake.step / 1000;

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
    if (this.game.start) {
        this.game.drawBg();

        this.snake && this.snake.draw();

        this.food.forEach((f) => {
            f.draw();
        });

        requestAnimationFrame(() => {
            this.render();
        });
    }
};

SingleMode.prototype.update = function () {
    if (this.game.start) {
        this.snake.update();

        if (!this.snake.checkBoundary(this.game.gameWidth)) {
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

        const speed = this.snake
            ? parseInt(20 - this.snake.maxLength * 0.1) + 1
            : 30;
        setTimeout(
            () => {
                this.update();
            },
            speed < 7 ? 7 : speed
        );
    }
};

SingleMode.prototype.gameEnd = function () {
    this.game.start = false;

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

    this.update();
    this.render();
};

export default SingleMode;
