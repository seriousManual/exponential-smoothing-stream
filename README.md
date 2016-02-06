# exponential-smoothing-stream [![Build Status](https://travis-ci.org/seriousManual/exponential-smoothing-stream.png)](https://travis-ci.org/seriousManual/exponential-smoothing-stream)

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
* `initialStrategy`: Defines the strategy that is used to determine the initial value of the series, defaults to the `First` strategy

### Initial Strategy

The strategy the is used for the first series element is expressed via a Strategy instance.
Built in there are five different strategies:

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

#### Average

Uses the first n values and calculates the average which will be used as the initial stream value.
The stream itself will queue up the stream values until the strategy returns with a valid number.

````javascript
var ESS = require('exponential-smoothing-stream');

var a = new ESS({
    smoothingFactor: 0.5,
    initialStrategy: new ESS.strategies.InitialStrategyAverage(4) //will use the first four elements from the stream to determine the average
});
````

#### Median

Uses the first n values and calculates the median which will be used as the initial stream value.
The stream itself will queue up the stream values until the strategy returns with a valid number.

````javascript
var ESS = require('exponential-smoothing-stream');

var a = new ESS({
    smoothingFactor: 0.5,
    initialStrategy: new ESS.strategies.InitialStrategyMedian(4) //will use the first four elements from the stream to determine the median
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

If the call to `determine` returns `null` the stream will buffer all stream values until `determine` returns a number.
This allows e.g. for an initial value that's the average of the first four stream elements.

### Smoothing Factor

It is tricky to determine exactly which smoothing factor is the best fitting factor. 
To get a rough idea on how the smoothing factor effects the smoothed series this table can be used:

On each row a certain smoothing factor is listed, the belonging columns show how many steps it takes until only a certain percentag of the initial value is left.

factor | 10% |	25% |	50% |	75% |	90%
:---|:---:|:---:|:---:|:---:|:---:
0,75 | 8 | 5 | 3 | 1	
0,8 | 10 | 6 | 3 | 1	
0,85 | 14 | 8 | 4 | 2 | 1
0,9 | 21 | 13 | 7 | 3 | 1
0,93 | 31 | 19 | 9 | 4 | 1
0,95 | 44 | 27 | 13 | 6 | 2
0,96 | 56 | 34 | 17 | 7 | 2
0,97 | 75 | 45 | 23 | 9 | 3
0,98 | 98 | 68 | 34 | 14 | 5
0,985 | 150 | 91 | 45 | 19 | 7
0,987 | 175 | 109 | 53 | 22 | 8
0,989 | 199 | 119 | 60 | 25 | 9
0,99 | 228 | 138 | 69 | 29 | 10
0,993 | 327 | 197 | 99 | 41 | 14
0,995 | 449 | 277 | 139 | 58 | 21
0,997 | 766 | 460 | 230 | 95 | 33
