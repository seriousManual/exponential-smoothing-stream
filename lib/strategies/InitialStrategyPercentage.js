function InitialStrategyPercentage (percentage) {
    if (percentage < 0 || percentage > 1 || isNaN(percentage)) throw new Error('percentage has to be a numeric, positive smaller than zero value');

    this._percentage = +percentage;
}

InitialStrategyPercentage.prototype.determine = function (value) {
    return this._percentage * value;
};

module.exports = InitialStrategyPercentage;