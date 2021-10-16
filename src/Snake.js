import Vector from "./Vector.js";

var Snake = function (args = {}) {
    var defaults = {
        game: null,
        body: [],
        head: new Vector(),
        maxLength: 30,
        step: 0.1,
        color: "#9500f8",
        direction: "right",
        directionQueue: [],
        maxdirectionQueueLength: 2,
    };

    for (const argName in defaults) {
        if (Object.hasOwnProperty.call(defaults, argName)) {
            this[argName] = args[argName] ? args[argName] : defaults[argName];
        }
    }

    this.speed = this.getDirectionSpeed(this.direction);
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
    var d = this.game.bw / 8 / this.body.length;
    this.body.forEach((v, i) => {
        var r = this.game.bw / 2 - d * (this.body.length - i);
        this.drawBody(v, r, this.color, i === this.body.length - 1);
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
        // 畫向前看的眼睛
        var drawEyes = () => {
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
        };

        var drawFocusEye = (foodPos, eyePos, eyeCenter) => {
            var dxy = eyePos.sub(foodPos);
            var length = dxy.length();
            var sin = dxy.y / length;
            var cos = dxy.x / length;

            this.game.ctx.beginPath();
            if (this.direction === "up") {
                eyeCenter.set(
                    eyeCenter.x - (cos * r) / 4,
                    eyeCenter.y - (sin * r) / 4
                );
            } else if (this.direction === "down") {
                eyeCenter.set(
                    eyeCenter.x + (cos * r) / 4,
                    eyeCenter.y + (sin * r) / 4
                );
            } else if (this.direction === "right") {
                eyeCenter.set(
                    eyeCenter.x - (sin * r) / 4,
                    eyeCenter.y + (cos * r) / 4
                );
            } else if (this.direction === "left") {
                eyeCenter.set(
                    eyeCenter.x + (sin * r) / 4,
                    eyeCenter.y - (cos * r) / 4
                );
            }

            this.game.ctx.arc(
                eyeCenter.x,
                eyeCenter.y,
                r / 4,
                0,
                Math.PI * 2
            );
            this.game.ctx.fill();
        }

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
                drawEyes();
            } else {
                var foodPos = this.game.getPosition(food.x, food.y);
                var eyePos = new Vector(pos.x + r - r / 2, pos.y + r - r / 2);
                
                drawFocusEye(foodPos, eyePos, new Vector(0 - r / 2, 0 - r / 2));

                eyePos = new Vector(pos.x + r + r / 2, pos.y + r - r / 2);

                drawFocusEye(foodPos, eyePos, new Vector(0 + r / 2, 0 - r / 2));
            }
        } else {
            drawEyes();
        }
    }

    this.game.ctx.restore();
};

export default Snake;
