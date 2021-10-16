var Food = function (args = {}) {
    var defaults = {
        game: null,
        color: "red",
        x: 0,
        y: 0,
        r: 0,
    };

    for (const argName in defaults) {
        if (Object.hasOwnProperty.call(defaults, argName)) {
            this[argName] = args[argName] ? args[argName] : defaults[argName];
        }
    }

    this.scale = 0.4;
    this.time = 0;

    this.r = this.r === 0 ? this.game.bw / 2 : this.r;
};

Food.prototype.draw = function () {
    var pos = this.game.getPosition(this.x, this.y);
    var r = this.r;

    this.game.ctx.save();
    this.game.ctx.translate(pos.x + r, pos.y + r);
    this.game.ctx.scale(this.scale, this.scale);
    this.game.ctx.beginPath();
    this.game.ctx.shadowOffsetX = 0;
    this.game.ctx.shadowOffsetY = 2;
    this.game.ctx.shadowBlur = 4;
    this.game.ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    this.game.ctx.fillStyle = this.color;
    this.game.ctx.arc(0, Math.sin(this.time / 30) * 2 - 2, r, 0, Math.PI * 2);
    this.game.ctx.fill();
    this.game.ctx.beginPath();
    this.game.ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    this.game.ctx.lineWidth = 5;
    this.game.ctx.lineCap = "round";
    this.game.ctx.shadowColor = "rgba(0, 0, 0, 0)";
    this.game.ctx.arc(
        0,
        Math.sin(this.time / 30) * 2 - 2,
        (r * 2) / 3,
        -0.95 * Math.PI,
        -0.6 * Math.PI
    );
    this.game.ctx.stroke();
    this.game.ctx.restore();

    if (this.scale < 0.8) {
        this.scale *= 1.2;
    }
    this.time = (this.time + 1) % 100;
};

export default Food;
