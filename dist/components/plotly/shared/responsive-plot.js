"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _goober = require("goober");

var _plotly = _interopRequireDefault(require("plotly.js-basic-dist-min"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _factory = _interopRequireDefault(require("react-plotly.js/factory"));

var _reactResizeDetector = require("react-resize-detector");

var _templateObject, _templateObject2;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Plot = (0, _factory.default)(_plotly.default);
(0, _goober.setup)(_react.default.createElement);
var Wrapper = (0, _goober.styled)('div', _react.forwardRef)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  height: 100%;\n  width: 100%;\n"])));
var SubPlotsWrapper = (0, _goober.styled)('div')(function (_ref) {
  var columns = _ref.columns,
      rows = _ref.rows;
  return {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: "repeat(".concat(columns, ", 1fr)"),
    gridTemplateRows: "repeat(".concat(rows, ", 1fr)")
  };
});
var SubPlotInnerWrapper = (0, _goober.styled)('div')(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n  overflow: hidden;\n"])));
var SizeablePlotWrapper = (0, _goober.styled)('div')(function (_ref2) {
  var size = _ref2.size;
  return {
    width: '100%',
    height: '100%',
    padding: "".concat(100 - (MIN_SIZE + size * (MAX_SIZE - MIN_SIZE)), "%")
  };
});
var MIN_SIZE = 60;
var MAX_SIZE = 100;

var ResponsivePlot = function ResponsivePlot(_ref3) {
  var type = _ref3.type,
      data = _ref3.data,
      layout = _ref3.layout,
      subPlots = _ref3.subPlots,
      size = _ref3.size,
      titleX = _ref3.titleX,
      titleY = _ref3.titleY,
      props = (0, _objectWithoutProperties2.default)(_ref3, ["type", "data", "layout", "subPlots", "size", "titleX", "titleY"]);

  var _useResizeDetector = (0, _reactResizeDetector.useResizeDetector)({}),
      width = _useResizeDetector.width,
      ref = _useResizeDetector.ref;

  var doSubPlots = (0, _react.useMemo)(function () {
    return data.length > 1 && subPlots;
  }, [data.length, subPlots]);
  var subPlotColumns = 2;
  var subPlotRows = (0, _react.useMemo)(function () {
    return Math.ceil(data.length / subPlotColumns);
  }, [data.length]);
  var transformedData = (0, _react.useMemo)(function () {
    return doSubPlots ? data.map(function (obj, i) {
      return _objectSpread(_objectSpread({
        type: type
      }, type === 'pie' ? {
        domain: {
          column: i % subPlotColumns,
          row: Math.floor(i / subPlotColumns)
        }
      } : {
        xaxis: "x".concat(i + 1),
        yaxis: "y".concat(i + 1)
      }), obj);
    }) : data.map(function (obj) {
      return _objectSpread({
        type: type
      }, obj);
    });
  }, [data, doSubPlots, type]);

  var renderPlot = function renderPlot() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var data = props.data,
        layout = props.layout,
        rest = (0, _objectWithoutProperties2.default)(props, ["data", "layout"]);
    return /*#__PURE__*/_react.default.createElement(Plot, (0, _extends2.default)({
      data: data,
      layout: _objectSpread({
        autosize: true,
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        modebar: {
          bgcolor: 'transparent',
          color: 'black',
          activecolor: 'black'
        }
      }, layout)
    }, rest));
  };

  var renderTitle = function renderTitle(title) {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        width: '100%',
        height: "".concat(100 * (1 - titleY), "% "),
        textAlign: 'center',
        overflow: 'visible',
        zIndex: '10'
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      style: {
        position: 'absolute',
        top: "".concat(100 * (1 - titleY), "% "),
        left: "".concat(100 * (titleX - 0.5), "% "),
        width: '100%'
      }
    }, title));
  };

  return doSubPlots ? /*#__PURE__*/_react.default.createElement(SubPlotsWrapper, {
    columns: subPlotColumns,
    rows: subPlotRows
  }, transformedData.map(function (d, i) {
    return /*#__PURE__*/_react.default.createElement(SubPlotInnerWrapper, {
      key: i
    }, renderTitle(d.name), /*#__PURE__*/_react.default.createElement(SizeablePlotWrapper, {
      size: size
    }, renderPlot(_objectSpread({
      data: [d],
      style: {
        width: '100%',
        height: '100%'
      },
      layout: {
        showlegend: false,
        margin: {
          b: 0,
          t: 0,
          l: 0,
          r: 0
        }
      }
    }, props))));
  })) : /*#__PURE__*/_react.default.createElement(Wrapper, {
    ref: ref
  }, renderPlot(_objectSpread({
    data: transformedData,
    layout: {
      width: width,
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        xanchor: 'right',
        y: 1,
        x: 1
      }
    },
    style: {
      height: 'inherit'
    }
  }, props)));
};

ResponsivePlot.propTypes = {
  type: _propTypes.default.string.isRequired,
  data: _propTypes.default.array.isRequired,
  layout: _propTypes.default.object,
  subPlots: _propTypes.default.bool,
  titleX: _propTypes.default.number,
  titleY: _propTypes.default.number,
  size: _propTypes.default.number
};
ResponsivePlot.defaultProps = {
  layout: {},
  subPlots: false,
  titleX: 0.5,
  titleY: 1,
  size: 0.8
};
var _default = ResponsivePlot;
exports.default = _default;