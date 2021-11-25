"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlotlyPropTypes = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var PlotlyPropTypes = {
  data: _propTypes.default.arrayOf(_propTypes.default.object).isRequired
};
exports.PlotlyPropTypes = PlotlyPropTypes;