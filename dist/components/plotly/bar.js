"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactPlotly = _interopRequireDefault(require("react-plotly.js"));

var Bar = function Bar(_ref) {
  var data = _ref.data,
      layout = _ref.layout,
      config = _ref.config;
  return /*#__PURE__*/_react.default.createElement(_reactPlotly.default, {
    data: data,
    layout: layout,
    config: config
  });
};

Bar.propTypes = {
  config: _propTypes.default.object,
  data: _propTypes.default.array,
  layout: _propTypes.default.object
};
var _default = Bar;
exports.default = _default;