var expect = require('chai').expect;

var ESS = require('../ExponentialSmoothingStream');
var strategies = require('../lib/strategies');

function BufferingStrategy() {
    this._i = 0;
}

BufferingStrategy.prototype.determine = function (value) {
    return this._i++ < 2 ? null : 1;
};

function BlackHoleStrategy() {
}
BlackHoleStrategy.prototype.determine = function () {
    return null;
};

describe('exponential-smoothing-stream', function () {
    describe('stream', function () {
        it('should smooth out stream values', function (done) {
            var a = new ESS({
                smoothingFactor: 0.5
            });

            var valueList = [];

            a.write(2);
            a.write(2);
            a.write(3);
            a.write(2);
            a.write(1);

            a.end();

            a.on('data', function (data) {
                valueList.push(data);
            });

            a.on('end', function () {
                expect(valueList).to.deep.equal([2, 2, 2.5, 2.25, 1.625]);
                done();
            });
        });

        it('should queue up values when initial strategy does not return immediately', function (done) {
            var a = new ESS({
                smoothingFactor: 0.9,
                initialStrategy: new BufferingStrategy()
            });

            var valueList = [];

            a.write(2);
            a.write(2);
            a.write(2);
            a.write(2);
            a.write(2);

            a.end();

            a.on('data', function (data) {
                valueList.push(data);
            });

            a.on('end', function () {
                expect(valueList).to.deep.equal([1, 1.1, 1.19, 1.271, 1.3438999999999999]);
                done();
            });
        });

        it('should emit an error on invalid data', function (done) {
            var a = new ESS();

            var valueList = [];

            a.on('data', function (data) {
                valueList.push(data);
            });

            a.on('end', function () {
                expect(true).to.be.false;
            });

            a.on('error', function (error) {
                expect(error.message).to.equal('not a number: foobar');
                expect(valueList).to.deep.equal([]);
                done();
            });

            a.write('foobar');
            a.end();
        });

        it('should emit an error when a strategy has not yet emitted the initial value and the stream ends', function (done) {
            var a = new ESS({
                smoothingFactor: 0.9,
                initialStrategy: new BlackHoleStrategy()
            });

            var valueList = [];

            a.on('data', function (data) {
                valueList.push(data);
            });

            a.on('end', function () {
                expect(true).to.be.false;
            });

            a.on('error', function (error) {
                expect(error.message).to.equal('there are 5 values left in the queue, nevertheless the stream has ended');
                expect(valueList).to.deep.equal([]);
                done();
            });

            a.write(1);
            a.write(1);
            a.write(1);
            a.write(1);
            a.write(1);

            a.end();
        });
    });

    describe('initial strategies', function () {
        describe('first', function () {
            it('should return the first value', function () {
                var a = new strategies.InitialStrategyFirst();

                expect(a.determine(1337)).to.equal(1337);
            });
        });

        describe('fixed value', function () {
            it('should return a fixed value', function () {
                var a = new strategies.InitialStrategyFixed(1);

                expect(a.determine(100)).to.equal(1);
            });

            it('should throw on NAN value', function () {
                expect(function () {
                    new strategies.InitialStrategyFixed('foobar');
                }).to.throw();
            });
        });

        describe('percentage', function () {
            it('should return a percentage', function () {
                var a = new strategies.InitialStrategyPercentage(0.1);

                expect(a.determine(1)).to.equal(0.1);
            });

            it('should throw on NAN value', function () {
                expect(function () {
                    new strategies.InitialStrategyPercentage('foobar');
                }).to.throw();
            });

            it('should throw on a value < 0', function () {
                expect(function () {
                    new strategies.InitialStrategyPercentage(-1);
                }).to.throw();
            });

            it('should throw on a value > 1', function () {
                expect(function () {
                    new strategies.InitialStrategyPercentage(10);
                }).to.throw();
            });
        });

        describe('average', function () {
            it('should return the average of the first four calls at the fourth call', function () {
                var a = new strategies.InitialStrategyAverage(4);

                expect(a.determine(2)).to.be.null;
                expect(a.determine(1)).to.be.null;
                expect(a.determine(2)).to.be.null;
                expect(a.determine(1)).to.equal(1.5);
            });
        });

        describe('median', function () {
            it('should return the median of the first three calls at the third call', function () {
                var a = new strategies.InitialStrategyMedian(3);

                expect(a.determine(2)).to.be.null;
                expect(a.determine(1)).to.be.null;
                expect(a.determine(2)).to.equal(2);
            });

            it('should return the median of the first four calls at the fourth call', function () {
                var a = new strategies.InitialStrategyMedian(4);

                expect(a.determine(1)).to.be.null;
                expect(a.determine(4)).to.be.null;
                expect(a.determine(3)).to.be.null;
                expect(a.determine(2)).to.equal(2.5);
            });
        });
    });
});