"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _constants = require("../shared/constants");

var _responsivePlot = _interopRequireDefault(require("../shared/responsive-plot"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Pie = function Pie(_ref) {
  var groupByValue = _ref.groupByValue,
      data = _ref.data,
      label = _ref.label,
      values = _ref.values,
      donut = _ref.donut,
      showLegend = _ref.showLegend,
      showPercentage = _ref.showPercentage,
      props = (0, _objectWithoutProperties2.default)(_ref, ["groupByValue", "data", "label", "values", "donut", "showLegend", "showPercentage"]);
  var finalData = (0, _react.useMemo)(function () {
    return groupByValue ? data.map(function (d) {
      var _d = _objectSpread({}, d);

      var name = _d[label];
      delete _d[label];
      return {
        name: name,
        labels: Object.keys(_d),
        values: Object.values(_d),
        textinfo: showPercentage ? 'values' : 'none',
        hole: donut ? 0.4 : 0
      };
    }) : values.map(function (k) {
      return {
        name: k,
        labels: data.map(function (d) {
          return d[label];
        }),
        values: data.map(function (d) {
          return d[k];
        }),
        textinfo: showPercentage ? 'values' : 'none',
        hole: donut ? 0.4 : 0
      };
    });
  }, [data, donut, groupByValue, label, showPercentage, values]);
  var layout = (0, _react.useMemo)(function () {
    return {
      showlegend: showLegend,
      legend: {
        x: 1,
        y: 0.5
      }
    };
  }, [showLegend]);
  return /*#__PURE__*/_react.default.createElement(_responsivePlot.default, (0, _extends2.default)({
    type: "pie",
    data: finalData,
    layout: layout
  }, props));
};

Pie.propTypes = _objectSpread({
  label: _propTypes.default.string.isRequired,
  values: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
  donut: _propTypes.default.bool,
  showPercentage: _propTypes.default.bool,
  showLegend: _propTypes.default.bool
}, _constants.PlotlyPropTypes);
Pie.defaultProps = {
  donut: false,
  showPercentage: true,
  showLegend: true
};
var _default = Pie;
exports.default = _default;