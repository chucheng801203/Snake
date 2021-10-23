import { floatAdd, floatSub, floatMul } from "./utils";

const Vector = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};
Vector.prototype.add = function (v) {
    return new Vector(floatAdd(this.x, v.x), floatAdd(this.y, v.y));
};
Vector.prototype.sub = function (v) {
    return new Vector(floatSub(this.x, v.x), floatSub(this.y, v.y));
};
Vector.prototype.mul = function (v) {
    return new Vector(floatMul(this.x, v.x), floatMul(this.y, v.y));
};
Vector.prototype.set = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
};
Vector.prototype.length = function () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};
Vector.prototype.clone = function () {
    return new Vector(this.x, this.y);
};

export default Vector;
