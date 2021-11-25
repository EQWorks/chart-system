"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var propTypes = {
  x: _propTypes.default.number.isRequired,
  y: _propTypes.default.number.isRequired,
  size: _propTypes.default.number.isRequired,
  fill: _propTypes.default.string.isRequired,
  borderWidth: _propTypes.default.number.isRequired,
  borderColor: _propTypes.default.string.isRequired,
  trimLegendLabel: _propTypes.default.func.isRequired
};

var LegendCircle = function LegendCircle(_ref) {
  var x = _ref.x,
      y = _ref.y,
      size = _ref.size,
      fill = _ref.fill,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor,
      trimLegendLabel = _ref.trimLegendLabel;
  var initRef = (0, _react.useCallback)(trimLegendLabel, [trimLegendLabel]);
  return /*#__PURE__*/_react.default.createElement("circle", {
    r: size / 2,
    cx: x + size / 2,
    cy: y + size / 2,
    fill: fill,
    strokeWidth: borderWidth,
    stroke: borderColor,
    style: {
      pointerEvents: 'none'
    },
    ref: initRef
  });
};

LegendCircle.propTypes = propTypes;
var _default = LegendCircle;
exports.default = _default;