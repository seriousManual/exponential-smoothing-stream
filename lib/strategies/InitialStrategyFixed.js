function InitialStrategyFixed (fixedValue) {
    if (isNaN(fixedValue)) throw new Error('fixed value has to be a number');

    this._fixedValue = +fixedValue;
}

InitialStrategyFixed.prototype.determine = function (value) {
    return this._fixedValue;
};

module.exports = InitialStrategyFixed;