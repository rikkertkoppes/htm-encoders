"use strict";
var chai_1 = require('chai');
var index_1 = require('../index');
describe('ScalarEncoder', function () {
    describe('construction', function () {
        it('first parameter must be odd', function () {
            chai_1.expect(function () { return index_1.ScalarEncoder(1, 0, 100, 16); }).not.to.throw();
            chai_1.expect(function () { return index_1.ScalarEncoder(2, 0, 100, 16); }).to.throw();
            chai_1.expect(function () { return index_1.ScalarEncoder(3, 0, 100, 16); }).not.to.throw();
            chai_1.expect(function () { return index_1.ScalarEncoder(4, 0, 100, 16); }).to.throw();
        });
        it('should construct with a radius', function () {
            chai_1.expect(index_1.ScalarEncoder(5, 1, 10, index_1.ScalarEncoder.radius(1))(1).size).to.equal(50);
            chai_1.expect(index_1.ScalarEncoder(3, 1, 4, index_1.ScalarEncoder.radius(1))(1).size).to.equal(12);
            chai_1.expect(index_1.ScalarEncoder(3, 1, 4, index_1.ScalarEncoder.radius(3))(1).size).to.equal(6);
        });
        it('should construct with a resolution', function () {
            chai_1.expect(index_1.ScalarEncoder(5, 1, 10, index_1.ScalarEncoder.resolution(0.5))(1).size).to.equal(23);
            chai_1.expect(index_1.ScalarEncoder(3, 1, 4, index_1.ScalarEncoder.resolution(1))(1).size).to.equal(6);
            chai_1.expect(index_1.ScalarEncoder(3, 1, 4, index_1.ScalarEncoder.resolution(0.5))(1).size).to.equal(9);
        });
    });
    describe('encoding', function () {
        it('should encode non periodic, 1 width', function () {
            var enc = index_1.ScalarEncoder(1, 1, 4, 4);
            chai_1.expect(enc(1).toString()).to.equal('1000');
            chai_1.expect(enc(2).toString()).to.equal('0100');
            chai_1.expect(enc(3).toString()).to.equal('0010');
            chai_1.expect(enc(4).toString()).to.equal('0001');
        });
        it('should encode non periodic, 3 width', function () {
            var enc = index_1.ScalarEncoder(3, 1, 5, 4);
            chai_1.expect(enc(1).toString()).to.equal('1110');
            chai_1.expect(enc(2).toString()).to.equal('1110');
            chai_1.expect(enc(3).toString()).to.equal('0111');
            chai_1.expect(enc(4).toString()).to.equal('0111');
            chai_1.expect(enc(5).toString()).to.equal('0111');
        });
        it('should encode periodic, 3 width', function () {
            var enc = index_1.ScalarEncoder(3, 1, 3, 4, true);
            chai_1.expect(enc(1).toString()).to.equal('1110');
            chai_1.expect(enc(2).toString()).to.equal('1011');
            chai_1.expect(enc(3).toString()).to.equal('1110');
        });
        it('should encode periodic, 3 width, with radius', function () {
            var enc = index_1.ScalarEncoder(3, 1, 3, index_1.ScalarEncoder.radius(1), true);
            chai_1.expect(enc(1).toString()).to.equal('111000');
            chai_1.expect(enc(2).toString()).to.equal('000111');
            chai_1.expect(enc(3).toString()).to.equal('111000');
        });
        it('should encode periodic, 3 width, with resolution', function () {
            var enc = index_1.ScalarEncoder(3, 1, 3, index_1.ScalarEncoder.resolution(0.5), true);
            chai_1.expect(enc(1.0).toString()).to.equal('1110');
            chai_1.expect(enc(1.5).toString()).to.equal('0111');
            chai_1.expect(enc(2.0).toString()).to.equal('1011');
            chai_1.expect(enc(2.5).toString()).to.equal('1101');
            chai_1.expect(enc(3.0).toString()).to.equal('1110');
        });
    });
});
describe('CategoryEncoder', function () {
    describe('construction', function () {
        it('should set up for the given categories', function () {
            var enc = index_1.CategoryEncoder(3, ['foo', 'bar', 'baz']);
            chai_1.expect(function () { return enc('qux'); }).to.throw();
        });
    });
    describe('encoding', function () {
        it('should create separate bit ranges for each category for w=3', function () {
            var enc = index_1.CategoryEncoder(3, ['foo', 'bar', 'baz']);
            chai_1.expect(enc('foo').toString()).to.equal('111000000');
            chai_1.expect(enc('bar').toString()).to.equal('000111000');
            chai_1.expect(enc('baz').toString()).to.equal('000000111');
        });
        it('should create separate bit ranges for each category for w=3', function () {
            var enc = index_1.CategoryEncoder(1, ['foo', 'bar', 'baz']);
            chai_1.expect(enc('foo').toString()).to.equal('100');
            chai_1.expect(enc('bar').toString()).to.equal('010');
            chai_1.expect(enc('baz').toString()).to.equal('001');
        });
        it('should work with categories of boolean types', function () {
            var enc = index_1.CategoryEncoder(1, [true, false]);
            chai_1.expect(enc(true).toString()).to.equal('10');
            chai_1.expect(enc(false).toString()).to.equal('01');
        });
        it('should work with categories of mixed types', function () {
            var enc = index_1.CategoryEncoder(1, [3, true]);
            chai_1.expect(enc(3).toString()).to.equal('10');
            chai_1.expect(enc(true).toString()).to.equal('01');
        });
    });
});
describe('BooleanEncoder', function () {
    describe('construction', function () {
        var enc = index_1.BooleanEncoder(3);
        chai_1.expect(enc(true).toString()).to.equal('111000');
        chai_1.expect(enc(false).toString()).to.equal('000111');
    });
});
