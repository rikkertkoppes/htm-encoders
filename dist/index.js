"use strict";
var dist_1 = require('htm-sdr/dist');
function assertOdd(x) {
    if ((x % 2) === 0) {
        throw new Error(x + ' must be odd');
    }
}
function ScalarEncoder(w, min, max, n, periodic) {
    if (periodic === void 0) { periodic = false; }
    assertOdd(w);
    var range = max - min;
    var size = (typeof n === 'function') ? n(w, min, max, periodic) : n;
    var uniquePositions = periodic ? size : size - w;
    return function (value) {
        var bucketSize = range / uniquePositions;
        var bucketNumber = Math.round((value - min) / bucketSize);
        var i, indices = [];
        for (i = 0; i < w; i++) {
            indices.push((bucketNumber + i) % size);
        }
        return new dist_1.default(size, indices);
    };
}
exports.ScalarEncoder = ScalarEncoder;
var ScalarEncoder;
(function (ScalarEncoder) {
    function resolution(resolution) {
        return function (w, min, max, periodic) {
            return (periodic ? 0 : w) + (max - min) / resolution;
        };
    }
    ScalarEncoder.resolution = resolution;
    function radius(radius) {
        return function (w, min, max, periodic) {
            return (periodic ? 0 : w) + w * (max - min) / radius;
        };
    }
    ScalarEncoder.radius = radius;
})(ScalarEncoder = exports.ScalarEncoder || (exports.ScalarEncoder = {}));
function CategoryEncoder(w, categories) {
    var enc = ScalarEncoder(w, 0, categories.length - 1, ScalarEncoder.radius(1));
    var indexMap = categories.reduce(function (map, category, i) {
        map[category.toString()] = i;
        return map;
    }, {});
    return function (value) {
        var i = indexMap[value.toString()];
        if (i === undefined) {
            throw new Error('given value is not defined as possible category');
        }
        return enc(i);
    };
}
exports.CategoryEncoder = CategoryEncoder;
function BooleanEncoder(w) {
    return CategoryEncoder(w, [true, false]);
}
exports.BooleanEncoder = BooleanEncoder;
