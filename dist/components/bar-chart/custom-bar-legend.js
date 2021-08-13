"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _legends = require("@nivo/legends");

var propTypes = {
  legends: _propTypes.default.array.isRequired,
  height: _propTypes.default.number.isRequired,
  width: _propTypes.default.number.isRequired
};

var BoxLegend = function BoxLegend(_ref) {
  var legends = _ref.legends,
      height = _ref.height,
      width = _ref.width;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, legends.map(function (legend) {
    return /*#__PURE__*/_react.default.createElement(_legends.BoxLegendSvg, (0, _extends2.default)({
      key: legend.id
    }, legend, {
      containerHeight: height,
      containerWidth: width
    }));
  }));
};

BoxLegend.propTypes = propTypes;
var _default = BoxLegend;
exports.default = _default;