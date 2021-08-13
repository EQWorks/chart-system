"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBarChartScales = exports.getScaleTicks = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _d3Time = require("d3-time");

var _d3Scale = require("d3-scale");

var _d3Shape = require("d3-shape");

// pulled from https://github.com/plouc/nivo/blob/f967380e2900d893f5174c5070743a9b4dffa9ec/packages/axes/src/compute.js
// to manually get number of ticks
var extreme = function extreme(method) {
  return function (arr) {
    return !arr || !arr.length ? undefined : Math[method].apply(Math, arr);
  };
};

var min = extreme('min');
var max = extreme('max');
var timeByType = {
  millisecond: [_d3Time.timeMillisecond, _d3Time.utcMillisecond],
  second: [_d3Time.timeSecond, _d3Time.utcSecond],
  minute: [_d3Time.timeMinute, _d3Time.utcMinute],
  hour: [_d3Time.timeHour, _d3Time.utcHour],
  day: [_d3Time.timeDay, _d3Time.utcDay],
  week: [_d3Time.timeWeek, _d3Time.utcWeek],
  sunday: [_d3Time.timeSunday, _d3Time.utcSunday],
  monday: [_d3Time.timeMonday, _d3Time.utcMonday],
  tuesday: [_d3Time.timeTuesday, _d3Time.utcTuesday],
  wednesday: [_d3Time.timeWednesday, _d3Time.utcWednesday],
  thursday: [_d3Time.timeThursday, _d3Time.utcThursday],
  friday: [_d3Time.timeFriday, _d3Time.utcFriday],
  saturday: [_d3Time.timeSaturday, _d3Time.utcSaturday],
  month: [_d3Time.timeMonth, _d3Time.utcMonth],
  year: [_d3Time.timeYear, _d3Time.utcYear]
};
var timeTypes = Object.keys(timeByType);
var timeIntervalRegexp = new RegExp("^every\\s*(\\d+)?\\s*(".concat(timeTypes.join('|'), ")s?$"), 'i');

var isInteger = function isInteger(value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

var getScaleTicks = function getScaleTicks(scale, spec) {
  // specific values
  if (Array.isArray(spec)) {
    return spec;
  } // continuous scales


  if (scale.ticks) {
    // default behaviour
    if (spec === undefined) {
      return scale.ticks();
    } // specific tick count


    if (isInteger(spec)) {
      return scale.ticks(spec);
    }

    if (typeof spec === 'string') {
      // time interval
      var matches = spec.match(timeIntervalRegexp);

      if (matches) {
        // UTC is used as it's more predictible
        // however local time could be used too
        // let's see how it fits users' requirements
        var timeType = timeByType[matches[2]][scale.useUTC ? 1 : 0];

        if (matches[1] === undefined) {
          return scale.ticks(timeType);
        }

        return scale.ticks(timeType.every(Number(matches[1])));
      }

      throw new Error("Invalid tickValues: ".concat(spec));
    }
  } // non linear scale default


  return scale.domain();
}; // https://github.com/plouc/nivo/blob/f967380e2900d893f5174c5070743a9b4dffa9ec/packages/bar/src/compute/grouped.js#L25


exports.getScaleTicks = getScaleTicks;

var getGroupedScale = function getGroupedScale(data, keys, _minValue, _maxValue, range) {
  var allValues = data.reduce(function (acc, entry) {
    return [].concat((0, _toConsumableArray2.default)(acc), (0, _toConsumableArray2.default)(keys.map(function (k) {
      return entry[k];
    })));
  }, []).filter(function (val) {
    return val !== undefined;
  });
  var maxValue = _maxValue;

  if (maxValue === 'auto') {
    maxValue = max(allValues);
  }

  var minValue = _minValue;

  if (minValue === 'auto') {
    minValue = min(allValues);
    if (minValue > 0) minValue = 0;
  }

  return (0, _d3Scale.scaleLinear)().rangeRound(range).domain([minValue, maxValue]);
}; // https://github.com/plouc/nivo/blob/f967380e2900d893f5174c5070743a9b4dffa9ec/packages/bar/src/compute/stacked.js#L25


var getStackedScale = function getStackedScale(data, _minValue, _maxValue, range) {
  var allValues = data.flat(2).filter(function (val) {
    return val !== undefined;
  });
  var minValue = _minValue;

  if (minValue === 'auto') {
    minValue = min(allValues);
  }

  var maxValue = _maxValue;

  if (maxValue === 'auto') {
    maxValue = max(allValues);
  }

  return (0, _d3Scale.scaleLinear)().rangeRound(range).domain([minValue, maxValue]);
}; // https://github.com/plouc/nivo/blob/f967380e2900d893f5174c5070743a9b4dffa9ec/packages/bar/src/compute/common.js


var getIndexedScale = function getIndexedScale(data, getIndex, range, padding) {
  return (0, _d3Scale.scaleBand)().rangeRound(range).domain(data.map(getIndex)).padding(padding);
};

var getBarChartScales = function getBarChartScales(_ref) {
  var width = _ref.width,
      height = _ref.height,
      data = _ref.data,
      finalIndexBy = _ref.finalIndexBy,
      keys = _ref.keys,
      _ref$minValue = _ref.minValue,
      minValue = _ref$minValue === void 0 ? 'auto' : _ref$minValue,
      _ref$maxValue = _ref.maxValue,
      maxValue = _ref$maxValue === void 0 ? 'auto' : _ref$maxValue,
      padding = _ref.padding,
      reverse = _ref.reverse,
      groupMode = _ref.groupMode;
  var xScale = getIndexedScale(data, function (row) {
    return row[finalIndexBy];
  }, [0, width], padding);
  var yRange = reverse ? [0, height] : [height, 0];
  var yScale;

  if (groupMode === 'grouped') {
    yScale = getGroupedScale(data, keys, minValue, maxValue, yRange);
  } else {
    var stackedData = (0, _d3Shape.stack)().keys(keys).offset(_d3Shape.stackOffsetDiverging)(data);
    yScale = getStackedScale(stackedData, minValue, maxValue, yRange);
  }

  return {
    xScale: xScale,
    yScale: yScale
  };
};

exports.getBarChartScales = getBarChartScales;