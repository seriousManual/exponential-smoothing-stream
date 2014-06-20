function InitialStrategyFirst () {

}

/**
 * determines the first value of a smoothed series based on the first series element
 *
 * @param value Number the first element of the series
 * @returns Number
 */
InitialStrategyFirst.prototype.determine = function (value) {
    return value;
};

module.exports = InitialStrategyFirst;