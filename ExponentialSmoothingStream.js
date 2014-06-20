var util = require('util');
var Transform = require('stream').Transform;

var strategies = require('./lib/strategies');

function ExponentialSmoothingStream (options) {
    Transform.call(this, {objectMode: true});

    options = options || {};

    this._smoothingFactor = options.smoothingFactor || 1;
    this._initialStrategy = options.initialStrategy || new strategies.InitialStrategyFirst;
    this._currentValue = null;
}

util.inherits(ExponentialSmoothingStream, Transform);

ExponentialSmoothingStream.prototype._transform = function (streamValue, enc, callback) {
    if (isNaN(streamValue)) {
        return this.emit('error', new Error('not a number: ' + streamValue));
    }

    if (this._currentValue === null) {
        this._currentValue = this._initialStrategy.determine(streamValue);
    }

    this._currentValue = (this._currentValue * this._smoothingFactor) + ((1 - this._smoothingFactor) * streamValue);

    this.push(this._currentValue);

    callback();
};

ExponentialSmoothingStream.strategies = strategies;

module.exports = ExponentialSmoothingStream;