/// <reference path="../../typings/index.d.ts" />

import {expect} from 'chai';
import {ScalarEncoder, CategoryEncoder, BooleanEncoder} from '../index';

describe('ScalarEncoder', function() {
    describe('construction', function() {
        it('first parameter must be odd', function() {
            expect(() => ScalarEncoder(1, 0, 100, 16)).not.to.throw();
            expect(() => ScalarEncoder(2, 0, 100, 16)).to.throw();
            expect(() => ScalarEncoder(3, 0, 100, 16)).not.to.throw();
            expect(() => ScalarEncoder(4, 0, 100, 16)).to.throw();
        });
        it('should construct with a radius', function() {
            //nupic examples
            expect(ScalarEncoder(5, 1, 10, ScalarEncoder.radius(1))(1).size).to.equal(50);
            //own examples
            expect(ScalarEncoder(3, 1, 4, ScalarEncoder.radius(1))(1).size).to.equal(12);
            expect(ScalarEncoder(3, 1, 4, ScalarEncoder.radius(3))(1).size).to.equal(6);
        });
        it('should construct with a resolution', function() {
            //nupic examples (source says 22, should be 23)
            expect(ScalarEncoder(5, 1, 10, ScalarEncoder.resolution(0.5))(1).size).to.equal(23);
            //own examples
            expect(ScalarEncoder(3, 1, 4, ScalarEncoder.resolution(1))(1).size).to.equal(6);
            expect(ScalarEncoder(3, 1, 4, ScalarEncoder.resolution(0.5))(1).size).to.equal(9);
        });
    });

    describe('encoding', function() {
        it('should encode non periodic, 1 width', function() {
            var enc = ScalarEncoder(1, 1, 4, 4);
            expect(enc(1).toString()).to.equal('1000');
            expect(enc(2).toString()).to.equal('0100');
            expect(enc(3).toString()).to.equal('0010');
            expect(enc(4).toString()).to.equal('0001');
        });
        it('should encode non periodic, 3 width', function() {
            var enc = ScalarEncoder(3, 1, 5, 4);
            expect(enc(1).toString()).to.equal('1110');
            expect(enc(2).toString()).to.equal('1110');
            expect(enc(3).toString()).to.equal('0111');    //rounding down
            expect(enc(4).toString()).to.equal('0111');
            expect(enc(5).toString()).to.equal('0111');
        });
        it('should encode periodic, 3 width', function() {
            var enc = ScalarEncoder(3, 1, 3, 4, true);
            expect(enc(1).toString()).to.equal('1110');
            expect(enc(2).toString()).to.equal('1011');
            expect(enc(3).toString()).to.equal('1110');
        });
        it('should encode periodic, 3 width, with radius', function() {
            var enc = ScalarEncoder(3, 1, 3, ScalarEncoder.radius(1), true);
            expect(enc(1).toString()).to.equal('111000');
            expect(enc(2).toString()).to.equal('000111');
            expect(enc(3).toString()).to.equal('111000');
        });
        it('should encode periodic, 3 width, with resolution', function() {
            var enc = ScalarEncoder(3, 1, 3, ScalarEncoder.resolution(0.5), true);
            expect(enc(1.0).toString()).to.equal('1110');
            expect(enc(1.5).toString()).to.equal('0111');
            expect(enc(2.0).toString()).to.equal('1011');
            expect(enc(2.5).toString()).to.equal('1101');
            expect(enc(3.0).toString()).to.equal('1110');
        });
    });
});

describe('CategoryEncoder', function() {
    describe('construction', function() {
        it('should set up for the given categories', function() {
            var enc = CategoryEncoder(3, ['foo', 'bar', 'baz']);
            expect(() => enc('qux')).to.throw();
        });
    })
    describe('encoding', function() {
        it('should create separate bit ranges for each category for w=3', function() {
            var enc = CategoryEncoder(3, ['foo', 'bar', 'baz']);
            expect(enc('foo').toString()).to.equal('111000000');
            expect(enc('bar').toString()).to.equal('000111000');
            expect(enc('baz').toString()).to.equal('000000111');
        });
        it('should create separate bit ranges for each category for w=3', function() {
            var enc = CategoryEncoder(1, ['foo', 'bar', 'baz']);
            expect(enc('foo').toString()).to.equal('100');
            expect(enc('bar').toString()).to.equal('010');
            expect(enc('baz').toString()).to.equal('001');
        });
        it('should work with categories of boolean types', function() {
            var enc = CategoryEncoder(1, [true, false]);
            expect(enc(true).toString()).to.equal('10');
            expect(enc(false).toString()).to.equal('01');
        });
        it('should work with categories of mixed types', function() {
            var enc = CategoryEncoder(1, [3, true]);
            expect(enc(3).toString()).to.equal('10');
            expect(enc(true).toString()).to.equal('01');
        });
    });
});

describe('BooleanEncoder', function() {
    describe('construction', function() {
        var enc = BooleanEncoder(3);
        expect(enc(true).toString()).to.equal('111000');
        expect(enc(false).toString()).to.equal('000111');
    })
})