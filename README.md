# exponential-smoothing-stream [![Build Status](https://travis-ci.org/zaphod1984/exponential-smoothing-stream.png)](https://travis-ci.org/zaphod1984/exponential-smoothing-stream)

[![NPM](https://nodei.co/npm/exponential-smoothing-stream.png)](https://nodei.co/npm/exponential-smoothing-stream/)

[![NPM](https://nodei.co/npm-dl/exponential-smoothing-stream.png?months=3)](https://nodei.co/npm/exponential-smoothing-stream/)

## Exponential Smoothing

You may have seen graphs like this (e.g. stock market):
<p align="center">
  <img src="https://raw.github.com/zaphod1984/exponential-smoothing-stream/master/img/exponentialSmoothing.png" width="250" />
</p>

The algorithm that is used to calculate the smoothed graphs is called "exponential smoothing" and can be described via this formula (source: [Wikipedia](http://en.wikipedia.org/wiki/Exponential_smoothing)):
<p align="center">
  <img src="https://raw.github.com/zaphod1984/exponential-smoothing-stream/master/img/exponentialSmoothingFormula.png" />
</p>

## Module

This module implements a stream that takes values and transforms them via the above mentioned formula.

### Installation

````bash
$ npm install exponential-smoothing-stream
````

### Invocation

````javascript
var ESS = require('exponential-smoothing-stream');

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
    //value list now equals: [2, 2, 2.5, 2.25, 1.625]
});
````

#### Constructor(options)

Creates a new exponential-smoothing-stream.
Takes an optional configuration hash that consists of the following elements:

* `smoothingFactor`: Defines the smoothing factor
* `initialStrategy`: Defines the strategy that is used to determine the initial value of the series

### Initial Strategy

The strategy the is used for the first series element is expressed via a Strategy instance.
Built in there are three different strategies:

#### First

Uses the first element from the series to determine the first smoothed value.

````javascript
var ESS = require('exponential-smoothing-stream');

var a = new ESS({
    smoothingFactor: 0.5,
    initialStrategy: new ESS.strategies.InitialStrategyFirst()
});
````

#### Fixed

Uses a fixed value that is used as the smoothed value.

Uses the first element from the series to determine the first smoothed value.

````javascript
var ESS = require('exponential-smoothing-stream');

var a = new ESS({
    smoothingFactor: 0.5,
    initialStrategy: new ESS.strategies.InitialStrategyFixed(10)
});
````

#### Percentage

Uses a percentage value (of the first element of the series) as the first smoothed value.

````javascript
var ESS = require('exponential-smoothing-stream');

var a = new ESS({
    smoothingFactor: 0.5,
    initialStrategy: new ESS.strategies.InitialStrategyPercentage(0.7) //has to be an positive number that's smaller than 1
});
````

#### Custom

If you want to specify your own logic simply create a class that follows this interface

````javascript
function InitialStrategyCustom () {

}

/**
 * determines the first value of a smoothed series based on the first series element
 *
 * @param value Number the first element of the series
 * @returns Number
 */
InitialStrategyCustom.prototype.determine = function (value) {
    return value;
};
````
