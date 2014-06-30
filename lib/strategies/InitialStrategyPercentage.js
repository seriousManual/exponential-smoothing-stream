function InitialStrategyPercentage(percentage) {
    if (percentage < 0 || percentage > 1 || isNaN(percentage)) throw new Error('percentage has to be a numeric, positive smaller than zero value');

    this._percentage = +percentage;
}

/**
 * determines the first value of a smoothed series based on the first series element
 *
 * @param value Number the first element of the series
 * @returns Number
 */
InitialStrategyPercentage.prototype.determine = function (value) {
    return this._percentage * value;
};

module.exports = InitialStrategyPercentage;