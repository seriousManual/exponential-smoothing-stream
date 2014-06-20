var expect = require('chai').expect;

var ESS = require('../ExponentialSmoothingStream');
var strategies = require('../lib/strategies');

describe('exponential-smoothing-stream', function() {
    describe('stream', function() {
        it('should', function(done) {
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

            a.on('data', function(data) {
                valueList.push(data);
            });

            a.on('end', function() {
                expect(valueList).to.deep.equal([2, 2, 2.5, 2.25, 1.625]);
                done();
            });
        });
    });

    describe('initial strategies', function() {
        describe('first', function() {
            it('should return the first value', function() {
                var a = new strategies.InitialStrategyFirst();

                expect(a.determine(1337)).to.equal(1337);
            });
        });

        describe('fixed value', function() {
            it('should return a fixed value', function() {
                var a = new strategies.InitialStrategyFixed(1);

                expect(a.determine(100)).to.equal(1);
            });

            it('should throw on NAN value', function() {
                expect(function() {
                    new strategies.InitialStrategyFixed('foobar');
                }).to.throw();
            });
        });

        describe('percentage', function() {
            it('should return a percentage', function() {
                var a = new strategies.InitialStrategyPercentage(0.1);

                expect(a.determine(1)).to.equal(0.1);
            });

            it('should throw on NAN value', function() {
                expect(function() {
                    new strategies.InitialStrategyPercentage('foobar');
                }).to.throw();
            });

            it('should throw on a value < 0', function() {
                expect(function() {
                    new strategies.InitialStrategyPercentage(-1);
                }).to.throw();
            });

            it('should throw on a value > 1', function() {
                expect(function() {
                    new strategies.InitialStrategyPercentage(10);
                }).to.throw();
            });
        });
    });
});