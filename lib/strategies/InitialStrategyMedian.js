function InitialStrategyMedian(medianValues) {
    this._medianValues = +medianValues;
    this._numbers = [];
}

/**
 * determines the first value of a smoothed series based on the first series element
 *
 * @param value Number the first element of the series
 * @returns Number
 */
InitialStrategyMedian.prototype.determine = function (value) {
    this._numbers.push(value);

    if (this._numbers.length == this._medianValues) {
        this._numbers.sort();

        if (this._numbers.length % 2 == 1) {
            return this._numbers[Math.ceil(this._numbers.length / 2) -1];
        } else {
            var index1 = this._numbers.length / 2;
            var index2 = this._numbers.length / 2 - 1;

            return (this._numbers[index1] + this._numbers[index2]) / 2;
        }
    } else {
        return null;
    }
};

module.exports = InitialStrategyMedian;