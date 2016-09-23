/// <reference path="../node_modules/htm-sdr/dist/index.d.ts" />

import SDR from 'htm-sdr/dist';

function assertOdd(x: number) {
    if ((x % 2) === 0) {
        throw new Error(x + ' must be odd')
    }
}

type SizeCalculator = (w: number, minValue: number, maxValue: number) => number;
type Encoder<T> = (value: T) => SDR;

/**
 * examples:
 *
 * enc = ScalarEncoder(3,1,4,6);
 * enc = ScalarEncoder(3,1,4,ScalarEncoder.resolution(0.5));
 * enc = ScalarEncoder(3,1,4,ScalarEncoder.radius(3));
 *
 * enc.encode(1)
 *
 * @param  {number} w [The number of bits that are set to encode a single value - the "width" of the output signal restriction: w must be odd to avoid centering problems.]
 * @param  {number} minValue [The minimum value of the input signal.]
 * @param  {number} maxValue The upper bound of the input signal
 * @param {boolean} periodic If true, then the input value "wraps around" such that minval = maxval
          For a periodic value, the input must be strictly less than maxval,
          otherwise maxval is a true upper bound.
 */
export function ScalarEncoder(w: number, min: number, max: number, n: number | SizeCalculator, periodic: boolean = false): Encoder<number> {
    assertOdd(w);
    var range = max - min;
    var size = (typeof n === 'function') ? n(w, min, max) : n;
    var uniquePositions = periodic ? size : size - w;
    return (value: number): SDR => {
        var bucketSize = range / uniquePositions;
        var bucketNumber = Math.round((value - min) / bucketSize);
        var i, indices = [];
        for (i = 0; i < w; i++) {
            indices.push((bucketNumber + i) % size);
        }
        return new SDR(size, indices);
    }
}

//static members on ScalarEncoder
export module ScalarEncoder {

    /**
     * calculate n for the given resolution
     * the bit block shifts every [resolution] step in the input range
     *
     * when w = 3 and resolution = 1 minvalue = 1 maxValue = 4
     *
     * 111000    // 1
     * 011100    // 2
     * 001110    // 3
     * 000111    // 4
     *
     * number of bits needed = 6
     *
     * when w = 3 and resolution = 0.5 minValue = 1 maxValue = 4
     *
     * 111000000    // 1
     * 011100000    // 1.5
     * 001110000    // 2
     * 000011100    // 3
     * 000000111    // 4
     *
     * number of bits needed = 9
     */

    export function resolution(resolution: number): SizeCalculator {
        return (w, min, max) => {
            //calculate n for the given resolution
            return w + (max - min) / resolution;
        }
    }

    /**
     * calculate n for the given radius
     * each block of radius in the range should be w bits apart
     *
     * when w = 3 and radius = 1 minValue = 1, maxValue = 4
     *
     * 111000000000    //1
     * 011100000000    //1.33
     * 001110000000    //1.66
     * 000111000000    //2
     * 000000111000    //3
     * 000000000111    //4
     *
     * nr of bits needed = 12
     *
     * when w = 3 and radius = 3 minValue = 1, maxValue = 4
     *
     * 111000         //1
     * 011100         //2
     * 001110         //3
     * 000111         //4
     *
     * nr of bits needed = 6
     */
    export function radius(radius: number): SizeCalculator {
        return (w, min, max) => {
            return w + w * (max - min) / radius;
        }
    }
}

export function CategoryEncoder<T>(w: number, categories: T[]): Encoder<T> {
    var enc = ScalarEncoder(w, 0, categories.length - 1, ScalarEncoder.radius(1));
    //map for O(n) fast access instead of indexOf ( O(nlog(n)) ?)
    var indexMap = categories.reduce((map, category, i) => {
        map[category.toString()] = i;
        return map;
    },{});
    return (value: T): SDR => {
        var i = indexMap[value.toString()];
        if (i === undefined) {
            throw new Error('given value is not defined as possible category');
        }
        return enc(i);
    }
}

export function BooleanEncoder(w: number): Encoder<boolean> {
    return CategoryEncoder(w, [true, false]);
}