import Vector from "./Vector.js";

const Snake = function (args = {}) {
    const defaults = {
        game: null,
        body: [],
        head: new Vector(),
        maxLength: 30,
        step: 0.1,
        color: "hsl(" + parseInt(359 * Math.random() + 1) + ", 70%, 50%)",
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
    if (Number.isInteger(this.head.x) && Number.isInteger(this.head.y)) {
        const direction = this.directionQueue.shift();
        if (direction) {
            this.direction = direction;
            this.setSpeed(this.direction);
        }
    }

    const newHead = this.head.add(this.speed);
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

    let direction = this.direction;
    if (this.directionQueue.length !== 0) {
        direction = this.directionQueue[this.directionQueue.length - 1];
    }

    const nowSpeed = this.getDirectionSpeed(direction);
    const speed = this.getDirectionSpeed(d);
    if (
        Math.abs(speed.x) === Math.abs(nowSpeed.x) &&
        Math.abs(speed.y) === Math.abs(nowSpeed.y)
    ) {
        return;
    }

    this.directionQueue.push(d.toLowerCase());
};

Snake.prototype.setSpeed = function (direction) {
    const target = this.getDirectionSpeed(direction);

    if (target) {
        this.speed = target;
    }
};

Snake.prototype.getDirectionSpeed = function (direction) {
    switch (direction.toLowerCase()) {
        case "right":
            return new Vector(this.step, 0);
        case "left":
            return new Vector(-this.step, 0);
        case "up":
            return new Vector(0, -this.step);
        case "down":
            return new Vector(0, this.step);
    }

    return this.speed;
};

Snake.prototype.checkBoundary = function (gameWidth) {
    const xInWidth = this.head.x > -1 && this.head.x < gameWidth;
    const yInWidth = this.head.y > -1 && this.head.y < gameWidth;

    return xInWidth && yInWidth;
};

Snake.prototype.draw = function () {
    const d = this.game.bw / 8 / this.body.length;
    this.body.forEach((v, i) => {
        const r = this.game.bw / 2 - d * (this.body.length - i);
        this.drawBody(v, r, this.color, i === this.body.length - 1);
    });
};

Snake.prototype.drawBody = function (v, r, color, isHead) {
    const pos = this.game.getPosition(v.x, v.y);
    const ctx = this.game.ctx;

    ctx.save();
    ctx.translate(pos.x + this.game.bw / 2, pos.y + this.game.bw / 2);
    ctx.scale(0.85, 0.85);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    if (isHead) {
        if (this.direction === "top") {
            ctx.rotate(0 * Math.PI);
        } else if (this.direction === "right") {
            ctx.rotate(Math.PI / 2);
        } else if (this.direction === "left") {
            ctx.rotate((Math.PI / 2) * -1);
        } else if (this.direction === "down") {
            ctx.rotate(Math.PI * -1);
        }

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(0 - r / 2, 0 - r / 2, r / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0 + r / 2, 0 - r / 2, r / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        // 畫向前看的眼睛
        const drawEyes = () => {
            ctx.beginPath();
            ctx.arc(
                0 + (r * 1) / 2,
                0 - (r * 2) / 3 - 2,
                r / 4,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
                0 - (r * 1) / 2,
                0 - (r * 2) / 3 - 2,
                r / 4,
                0,
                Math.PI * 2
            );
            ctx.fill();
        };

        const drawFocusEye = (foodPos, eyePos, eyeCenter) => {
            const dxy = eyePos.sub(foodPos);
            const length = dxy.length();
            const sin = dxy.y / length;
            const cos = dxy.x / length;

            ctx.beginPath();
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

            ctx.arc(eyeCenter.x, eyeCenter.y, r / 4, 0, Math.PI * 2);
            ctx.fill();
        };

        if (this.game.mode.food.length > 0) {
            const l = [];
            let food = this.game.mode.food[0];

            if (this.game.mode.food.length > 1) {
                this.game.mode.food.forEach(function (fv) {
                    l.push(v.sub(fv.v).length());
                });

                food = this.game.mode.food[l.indexOf(Math.min.apply(null, l))];
            }

            if (
                (v.y === food.v.y &&
                    ((food.v.x - v.x > 0 && this.direction === "right") ||
                        (food.v.x - v.x < 0 && this.direction === "left"))) ||
                (v.x === food.v.x &&
                    ((v.y - food.v.y > 0 && this.direction === "up") ||
                        (v.y - food.v.y < 0 && this.direction === "down")))
            ) {
                drawEyes();
            } else {
                const foodPos = this.game.getPosition(food.v.x, food.v.y);
                let eyePos = new Vector(pos.x + r - r / 2, pos.y + r - r / 2);

                drawFocusEye(foodPos, eyePos, new Vector(0 - r / 2, 0 - r / 2));

                eyePos = new Vector(pos.x + r + r / 2, pos.y + r - r / 2);

                drawFocusEye(foodPos, eyePos, new Vector(0 + r / 2, 0 - r / 2));
            }
        } else {
            drawEyes();
        }
    }

    ctx.restore();
};

export default Snake;
