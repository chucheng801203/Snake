import Vector from "./Vector.js";

var Snake = function (game) {
    this.game = game;
    this.body = [];
    this.head = new Vector();
    this.maxLength = 30;
    this.step = 0.1;
    this.speed = new Vector(this.step, 0);
    this.color = "#9500f8";
    this.direction = "right";

    this.directionQueue = [];
    this.maxdirectionQueueLength = 2;
};

Snake.prototype.update = function () {
    var intX = Math.round(this.head.x);
    var intY = Math.round(this.head.y);
    var dx = Math.abs(intX - this.head.x);
    var dy = Math.abs(intY - this.head.y);
    if (dx < this.step / 2 && dy < this.step / 2) {
        this.head.set(intX, intY);
        var direction = this.directionQueue.shift();
        if (direction) {
            this.direction = direction;
            this.setSpeed(this.direction);
        }
    }

    var newHead = this.head.add(this.speed);
    this.body.push(this.head);
    this.head = newHead;

    while (this.body.length > this.maxLength) {
        this.body.shift();
    }
};

Snake.prototype.setDirection = function (d) {
    if (
        this.directionQueue.length >= this.maxdirectionQueueLength ||
        this.directionQueue[this.directionQueue.length - 1] === d.toLowerCase()
    ) {
        return;
    }

    var direction = this.direction;
    if (this.directionQueue.length !== 0) {
        direction = this.directionQueue[this.directionQueue.length - 1];
    }

    var nowSpeed = this.getDirectionSpeed(direction);
    var speed = this.getDirectionSpeed(d);
    if (
        Math.abs(speed.x) === Math.abs(nowSpeed.x) &&
        Math.abs(speed.y) === Math.abs(nowSpeed.y)
    ) {
        return;
    }

    this.directionQueue.push(d.toLowerCase());
};

Snake.prototype.setSpeed = function (direction) {
    var target = this.getDirectionSpeed(direction);

    if (target) {
        this.speed = target;
    }
};

Snake.prototype.getDirectionSpeed = function (direction) {
    switch (direction.toLowerCase()) {
        case "right":
            return new Vector(this.step, 0);
        case "left":
            return new Vector(-1 * this.step, 0);
        case "up":
            return new Vector(0, -1 * this.step);
        case "down":
            return new Vector(0, this.step);
    }

    return this.speed;
};

Snake.prototype.checkBoundary = function (gameWidth) {
    var xInWidth = this.head.x > -1 && this.head.x < gameWidth;
    var yInWidth = this.head.y > -1 && this.head.y < gameWidth;

    return xInWidth && yInWidth;
};

Snake.prototype.draw = function () {
    var that = this;
    var d = that.game.bw / 8 / this.body.length;
    this.body.forEach(function (v, i) {
        var r = that.game.bw / 2 - d * (that.body.length - i);
        that.drawBody(v, r, that.color, i === that.body.length - 1);
    });
};

Snake.prototype.drawBody = function (v, r, color, isHead) {
    var pos = this.game.getPosition(v.x, v.y);

    this.game.ctx.save();
    this.game.ctx.translate(pos.x + this.game.bw / 2, pos.y + this.game.bw / 2);
    this.game.ctx.scale(0.85, 0.85);
    this.game.ctx.beginPath();
    this.game.ctx.fillStyle = color;
    this.game.ctx.arc(0, 0, r, 0, Math.PI * 2);
    this.game.ctx.fill();

    if (isHead) {
        if (this.direction === "top") {
            this.game.ctx.rotate(0 * Math.PI);
        } else if (this.direction === "right") {
            this.game.ctx.rotate(Math.PI / 2);
        } else if (this.direction === "left") {
            this.game.ctx.rotate((Math.PI / 2) * -1);
        } else if (this.direction === "down") {
            this.game.ctx.rotate(Math.PI * -1);
        }

        this.game.ctx.fillStyle = "white";
        this.game.ctx.beginPath();
        this.game.ctx.arc(0 - r / 2, 0 - r / 2, r / 2, 0, Math.PI * 2);
        this.game.ctx.fill();

        this.game.ctx.beginPath();
        this.game.ctx.arc(0 + r / 2, 0 - r / 2, r / 2, 0, Math.PI * 2);
        this.game.ctx.fill();

        this.game.ctx.fillStyle = "black";
        if (this.game.food.length > 0) {
            var l = [];
            var food = this.game.food[0];

            if (this.game.food.length > 1) {
                this.game.food.forEach(function (fv) {
                    l.push(v.sub(new Vector(fv.x, fv.y)).length());
                });

                food = this.game.food[l.indexOf(Math.min.apply(null, l))];
            }

            if (
                (v.y === food.y &&
                    food.x - v.x > 0 &&
                    this.direction === "right") ||
                (v.y === food.y &&
                    food.x - v.x < 0 &&
                    this.direction === "left") ||
                (v.y - food.y > 0 &&
                    food.x === v.x &&
                    this.direction === "up") ||
                (v.y - food.y < 0 &&
                    food.x === v.x &&
                    this.direction === "down")
            ) {
                this.game.ctx.beginPath();
                this.game.ctx.arc(
                    0 + (r * 1) / 2,
                    0 - (r * 2) / 3 - 2,
                    r / 4,
                    0,
                    Math.PI * 2
                );
                this.game.ctx.fill();

                this.game.ctx.beginPath();
                this.game.ctx.arc(
                    0 - (r * 1) / 2,
                    0 - (r * 2) / 3 - 2,
                    r / 4,
                    0,
                    Math.PI * 2
                );
                this.game.ctx.fill();
            } else {
                var foodPos = this.game.getPosition(food.x, food.y);
                var eyePos = new Vector(pos.x + r - r / 2, pos.y + r - r / 2);
                var dxy = eyePos.sub(foodPos);
                var length = dxy.length();
                var sin = dxy.y / length;
                var cos = dxy.x / length;

                this.game.ctx.beginPath();
                var eye1Center = new Vector(0 - r / 2, 0 - r / 2);
                if (this.direction === "up") {
                    eye1Center.set(
                        0 - r / 2 - (cos * r) / 4,
                        0 - r / 2 - (sin * r) / 4
                    );
                } else if (this.direction === "down") {
                    eye1Center.set(
                        0 - r / 2 + (cos * r) / 4,
                        0 - r / 2 + (sin * r) / 4
                    );
                } else if (this.direction === "right") {
                    eye1Center.set(
                        0 - r / 2 - (sin * r) / 4,
                        0 - r / 2 + (cos * r) / 4
                    );
                } else if (this.direction === "left") {
                    eye1Center.set(
                        0 - r / 2 + (sin * r) / 4,
                        0 - r / 2 - (cos * r) / 4
                    );
                }

                this.game.ctx.arc(
                    eye1Center.x,
                    eye1Center.y,
                    r / 4,
                    0,
                    Math.PI * 2
                );
                this.game.ctx.fill();

                eyePos = new Vector(pos.x + r + r / 2, pos.y + r - r / 2);
                dxy = eyePos.sub(foodPos);
                length = dxy.length();
                sin = dxy.y / length;
                cos = dxy.x / length;

                var eye2Center = new Vector(0 + r / 2, 0 - r / 2);
                if (this.direction === "up") {
                    eye2Center.set(
                        0 + r / 2 - (cos * r) / 4,
                        0 - r / 2 - (sin * r) / 4
                    );
                } else if (this.direction === "down") {
                    eye2Center.set(
                        0 + r / 2 + (cos * r) / 4,
                        0 - r / 2 + (sin * r) / 4
                    );
                } else if (this.direction === "right") {
                    eye2Center.set(
                        0 + r / 2 - (sin * r) / 4,
                        0 - r / 2 + (cos * r) / 4
                    );
                } else if (this.direction === "left") {
                    eye2Center.set(
                        0 + r / 2 + (sin * r) / 4,
                        0 - r / 2 - (cos * r) / 4
                    );
                }

                this.game.ctx.beginPath();
                this.game.ctx.arc(
                    eye2Center.x,
                    eye2Center.y,
                    r / 4,
                    0,
                    Math.PI * 2
                );
                this.game.ctx.fill();
            }
        } else {
            this.game.ctx.beginPath();
            this.game.ctx.arc(
                0 + (r * 1) / 2,
                0 - (r * 2) / 3 - 2,
                r / 4,
                0,
                Math.PI * 2
            );
            this.game.ctx.fill();

            this.game.ctx.beginPath();
            this.game.ctx.arc(
                0 - (r * 1) / 2,
                0 - (r * 2) / 3 - 2,
                r / 4,
                0,
                Math.PI * 2
            );
            this.game.ctx.fill();
        }
    }

    this.game.ctx.restore();
};

export default Snake;
