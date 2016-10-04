/// <reference path="../node_modules/htm-sdr/dist/index.d.ts" />
import SDR from 'htm-sdr/dist';
export declare type SizeCalculator = (w: number, minValue: number, maxValue: number, periodic: boolean) => number;
export declare type Encoder<T> = (value: T) => SDR;
export declare function ScalarEncoder(w: number, min: number, max: number, n: number | SizeCalculator, periodic?: boolean): Encoder<number>;
export declare module ScalarEncoder {
    function resolution(resolution: number): SizeCalculator;
    function radius(radius: number): SizeCalculator;
}
export declare function CategoryEncoder<T>(w: number, categories: T[]): Encoder<T>;
export declare function BooleanEncoder(w: number): Encoder<boolean>;
