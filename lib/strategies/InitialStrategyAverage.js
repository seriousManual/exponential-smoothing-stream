function InitialStrategyAverage(averageValues) {
    this._averageValuesCount = +averageValues;
    this._numbers = [];
}

/**
 * determines the first value of a smoothed series based on the first series element
 *
 * @param value Number the first element of the series
 * @returns Number
 */
InitialStrategyAverage.prototype.determine = function (value) {
    this._numbers.push(value);

    if (this._numbers.length == this._averageValuesCount) {
        return this._numbers.reduce(function (value, memo) {
            return memo + value;
        }, 0) / this._numbers.length;
    } else {
        return null;
    }
};

module.exports = InitialStrategyAverage;