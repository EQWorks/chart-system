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

var Line = function Line(_ref) {
  var data = _ref.data,
      x = _ref.x,
      y = _ref.y,
      spline = _ref.spline,
      showTicks = _ref.showTicks,
      props = (0, _objectWithoutProperties2.default)(_ref, ["data", "x", "y", "spline", "showTicks"]);
  var finalData = (0, _react.useMemo)(function () {
    return y.map(function (k) {
      return {
        name: k,
        x: data.map(function (d) {
          return d[x];
        }),
        y: data.map(function (d) {
          return d[k];
        }),
        line: {
          shape: spline ? 'spline' : 'linear'
        }
      };
    });
  }, [data, spline, x, y]);
  var layout = (0, _react.useMemo)(function () {
    return _objectSpread({
      xaxis: {
        showticklabels: showTicks
      },
      yaxis: {
        showticklabels: showTicks
      }
    }, !showTicks && {
      margin: {
        t: 0,
        b: 0,
        l: 0,
        r: 0
      }
    });
  }, [showTicks]);
  return /*#__PURE__*/_react.default.createElement(_responsivePlot.default, (0, _extends2.default)({
    type: "line",
    layout: layout,
    data: finalData
  }, props));
};

Line.propTypes = _objectSpread({
  x: _propTypes.default.string.isRequired,
  y: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
  spline: _propTypes.default.bool,
  showTicks: _propTypes.default.bool
}, _constants.PlotlyPropTypes);
Line.defaultProps = {
  spline: false,
  showTicks: true
};
var _default = Line;
exports.default = _default;