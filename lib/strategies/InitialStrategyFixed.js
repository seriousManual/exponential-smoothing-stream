function InitialStrategyFixed (fixedValue) {
    if (isNaN(fixedValue)) throw new Error('fixed value has to be a number');

    this._fixedValue = +fixedValue;
}

/**
 * determines the first value of a smoothed series based on the first series element
 *
 * @param value Number the first element of the series
 * @returns Number
 */
InitialStrategyFixed.prototype.determine = function (value) {
    return this._fixedValue;
};

module.exports = InitialStrategyFixed;