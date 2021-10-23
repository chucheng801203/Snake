const _cf = (function () {
    function _shift(x) {
        const parts = x.toString().split(".");
        return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
    }
    return function () {
        return Array.prototype.reduce.call(
            arguments,
            function (prev, next) {
                return prev === undefined || next === undefined
                    ? undefined
                    : Math.max(prev, _shift(next));
            },
            -Infinity
        );
    };
})();

export const floatAdd = function () {
    const f = _cf.apply(null, arguments);
    if (f === undefined) return undefined;
    function cb(x, y, i, o) {
        return x + f * y;
    }
    return Array.prototype.reduce.call(arguments, cb, 0) / f;
};

export const floatSub = function (l, r) {
    var f = _cf(l, r);
    return (l * f - r * f) / f;
};

export const floatMul = function () {
    const f = _cf.apply(null, arguments);
    function cb(x, y, i, o) {
        return (x * f * (y * f)) / (f * f);
    }
    return Array.prototype.reduce.call(arguments, cb, 1);
};

export const floatDiv = function (l, r) {
    const f = _cf(l, r);
    return (l * f) / (r * f);
};
