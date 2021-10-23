import Vector from "./Vector";

const Food = function (args = {}) {
    const defaults = {
        game: null,
        color: "red",
        v: new Vector(),
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
    const pos = this.game.getPosition(this.v.x, this.v.y);
    const r = this.r;
    const ctx = this.game.ctx;

    ctx.save();
    ctx.translate(pos.x + r, pos.y + r);
    ctx.scale(this.scale, this.scale);
    ctx.beginPath();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.fillStyle = this.color;
    ctx.arc(0, Math.sin(this.time / 30) * 2 - 2, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.arc(
        0,
        Math.sin(this.time / 30) * 2 - 2,
        (r * 2) / 3,
        -0.95 * Math.PI,
        -0.6 * Math.PI
    );
    ctx.stroke();
    ctx.restore();

    if (this.scale < 0.8) {
        this.scale *= 1.2;
    }
    this.time = (this.time + 1) % 100;
};

export default Food;
