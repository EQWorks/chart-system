"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

var padding = 10;
var spacing = 10;
var scale = 0.9;
var minWidth = 300;

var GaugeBar = function GaugeBar(_ref) {
  var data = _ref.data,
      width = _ref.width,
      height = _ref.height,
      config = _ref.config;
  var color = config.color,
      backgroundColor = config.backgroundColor,
      dataKey = config.dataKey,
      axis = config.axis;
  var percentage = data[dataKey.x2] ? data[dataKey.x1] / data[dataKey.x2] * 100 : 0;
  var axisRange = axis.dynamicRange ? [axis.range[0], axis.optimalRatio > 0 ? percentage * Math.max(0, axis.optimalRatio) : Math.ceil(percentage)] : [axis.range[0], axis.range[1]];
  var xScale = d3.scaleLinear().domain(axisRange).range([0, width]);
  var tickNum = width < minWidth ? 5 : 10;
  var ticks = xScale.nice().ticks(tickNum); //ticks are calculated based on domain range

  var filledAmt = xScale(percentage);
  var rectHeight = height * 0.7;
  return /*#__PURE__*/_react.default.createElement("svg", {
    preserveAspectRatio: "xMidYMid meet",
    width: width,
    height: height
  }, /*#__PURE__*/_react.default.createElement("g", {
    transform: "translate(".concat(padding, ",").concat(padding, ")")
  }, /*#__PURE__*/_react.default.createElement("rect", {
    rx: 0,
    width: width * scale,
    height: rectHeight,
    style: {
      fill: backgroundColor
    }
  }), /*#__PURE__*/_react.default.createElement("rect", {
    rx: 0,
    width: filledAmt * scale,
    height: rectHeight,
    style: {
      fill: color
    }
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "width",
    from: "0",
    to: filledAmt,
    dur: "0.3s",
    repeatCount: "1"
  })), /*#__PURE__*/_react.default.createElement("g", {
    transform: "translate(0 ".concat(rectHeight + spacing, ")")
  }, ticks.map(function (tick, idx) {
    return /*#__PURE__*/_react.default.createElement("g", {
      key: idx
    }, /*#__PURE__*/_react.default.createElement("line", {
      x1: xScale(tick) * scale,
      y1: 0,
      x2: xScale(tick) * scale,
      y2: 8,
      stroke: "black"
    }), /*#__PURE__*/_react.default.createElement("text", {
      style: {
        textAnchor: 'middle',
        fontFamily: 'Open Sans',
        fontSize: '12px',
        fontWeight: 400
      },
      transform: "translate(".concat(xScale(tick) * scale, ", ", 25, ")")
    }, "".concat(tick, "%")));
  }))));
};

GaugeBar.propTypes = {
  backgroundColor: _propTypes.default.string,
  color: _propTypes.default.string,
  config: _propTypes.default.shape({
    axis: _propTypes.default.shape({
      dynamicRange: _propTypes.default.bool,
      range: _propTypes.default.array,
      optimalRatio: _propTypes.default.number
    }),
    backgroundColor: _propTypes.default.string,
    color: _propTypes.default.string,
    dataKey: _propTypes.default.shape({
      x1: _propTypes.default.string,
      x2: _propTypes.default.string
    })
  }).isRequired,
  data: _propTypes.default.object.isRequired,
  height: _propTypes.default.number.isRequired,
  width: _propTypes.default.number.isRequired
};
GaugeBar.defaultProps = {
  color: '#0075FF',
  backgroundColor: '#cdcdcd',
  config: {
    axis: {
      dynamicRange: false,
      range: [0, 100],
      optimalRatio: 0
    }
  }
};
var _default = GaugeBar;
exports.default = _default;