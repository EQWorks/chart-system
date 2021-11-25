"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLegendToggle = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var useLegendToggle = function useLegendToggle(data) {
  // workaround because legend doesn't rerender when data changes
  // manually turn off then on
  var _useState = (0, _react.useState)({}),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      legendToggle = _useState2[0],
      setLegendToggle = _useState2[1];

  (0, _react.useEffect)(function () {
    setLegendToggle({
      legends: []
    });
  }, [data]);
  (0, _react.useEffect)(function () {
    if (legendToggle.legends) {
      setLegendToggle({});
    }
  }, [legendToggle]);
  return legendToggle;
};

exports.useLegendToggle = useLegendToggle;