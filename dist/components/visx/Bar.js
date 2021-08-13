"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _shape = require("@visx/shape");

var _group = require("@visx/group");

var _scale = require("@visx/scale");

var _axis = require("@visx/axis");

var calculateMargin = function calculateMargin(_ref) {
  var axisX = _ref.axisX,
      axisY = _ref.axisY;
  var baseMargin = 24;
  var bottomMargin = baseMargin + (axisX.axis ? 24 : 0) + (axisX.label ? 24 : 0);
  var leftMargin = baseMargin + (axisY.axis ? 24 : 0) + (axisY.label ? 24 : 0);
  return {
    top: baseMargin,
    right: baseMargin,
    bottom: bottomMargin,
    left: leftMargin
  };
};

var Bar = function Bar(_ref2) {
  var data = _ref2.data,
      width = _ref2.width,
      height = _ref2.height,
      config = _ref2.config;
  var color = config.color,
      dataKey = config.dataKey,
      axisX = config.axisX,
      axisY = config.axisY;
  var margin = calculateMargin(config);
  var xMax = width - margin.right - margin.left;
  var yMax = height - margin.bottom - margin.top;

  var getX = function getX(d) {
    return d[dataKey.x];
  };

  var getY = function getY(d) {
    return d[dataKey.y];
  };

  var xScale = (0, _scale.scaleBand)({
    range: [0, xMax],
    round: true,
    domain: data.map(getX),
    padding: 0.4
  });
  var yScale = (0, _scale.scaleLinear)({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max.apply(Math, (0, _toConsumableArray2.default)(data.map(getY)))],
    padding: 0.4
  });
  return /*#__PURE__*/_react.default.createElement("svg", {
    width: width,
    height: height
  }, /*#__PURE__*/_react.default.createElement(_group.Group, {
    left: margin.left,
    top: margin.top
  }, data.map(function (d, i) {
    var _yScale;

    var xPoint = getX(d);
    var barWidth = xScale.bandwidth();
    var barHeight = yMax - ((_yScale = yScale(getY(d))) !== null && _yScale !== void 0 ? _yScale : 0);
    var barX = xScale(xPoint);
    var barY = yMax - barHeight;
    return /*#__PURE__*/_react.default.createElement(_shape.Bar, {
      key: i,
      x: barX,
      y: barY,
      width: barWidth,
      height: barHeight,
      fill: color
    });
  }), axisX.axis && /*#__PURE__*/_react.default.createElement(_axis.AxisBottom, {
    label: axisX.label ? dataKey.x : null,
    top: yMax,
    scale: xScale
  }), axisY.axis && /*#__PURE__*/_react.default.createElement(_axis.AxisLeft, {
    label: axisY.label ? dataKey.y : null,
    scale: yScale
  })));
};

Bar.propTypes = {
  data: _propTypes.default.object.isRequired,
  height: _propTypes.default.number.isRequired,
  width: _propTypes.default.number.isRequired,
  config: _propTypes.default.object.isRequired
};
var _default = Bar;
exports.default = _default;