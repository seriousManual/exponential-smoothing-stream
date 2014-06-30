var util = require('util');
var Transform = require('stream').Transform;

var strategies = require('./lib/strategies');

function ExponentialSmoothingStream(options) {
    Transform.call(this, {objectMode: true});

    options = options || {};

    this._smoothingFactor = options.smoothingFactor || 1;
    this._initialStrategy = options.initialStrategy || new strategies.InitialStrategyFirst();
    this._currentValue = null;

    this._queue = [];
}

util.inherits(ExponentialSmoothingStream, Transform);

ExponentialSmoothingStream.prototype._transform = function (streamValue, enc, callback) {
    if (isNaN(streamValue)) {
        return this.emit('error', new Error('not a number: ' + streamValue));
    }

    if (this._currentValue === null) {
        this._invokeInitialStrategy(streamValue);
    } else {
        this._applyStreamValue(streamValue);
    }

    callback();
};

ExponentialSmoothingStream.prototype._flush = function (callback) {
    if (this._queue.length > 0) {
        return this.emit('error', new Error('there are ' + this._queue.length + ' values left in the queue, nevertheless the stream has ended'))
    }

    callback();
};

ExponentialSmoothingStream.prototype._invokeInitialStrategy = function (streamValue) {
    var strategyOutput = this._initialStrategy.determine(streamValue);

    if (strategyOutput === null) {
        this._queue.push(streamValue);
    } else {
        this._currentValue = strategyOutput;
        this.push(strategyOutput);

        this._queue.forEach(this._applyStreamValue.bind(this));
        this._queue.length = 0;
    }
};

ExponentialSmoothingStream.prototype._applyStreamValue = function (streamValue) {
    this._currentValue = (this._currentValue * this._smoothingFactor) + ((1 - this._smoothingFactor) * streamValue);

    this.push(this._currentValue);
};

ExponentialSmoothingStream.strategies = strategies;

module.exports = ExponentialSmoothingStream;
