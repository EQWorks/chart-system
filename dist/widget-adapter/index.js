"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _barChart = _interopRequireDefault(require("../components/bar-chart/"));

var _pieChart = _interopRequireDefault(require("../components/pie-chart/"));

var _lineChart = _interopRequireDefault(require("../components/line-chart/"));

var _scatterChart = _interopRequireDefault(require("../components/scatter-chart"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var charts = {
  bar: _barChart.default,
  line: _lineChart.default,
  pie: _pieChart.default,
  scatter: _scatterChart.default
};

var WidgetAdapter = function WidgetAdapter(_ref) {
  var rows = _ref.rows,
      columns = _ref.columns,
      _ref$config = _ref.config,
      type = _ref$config.type,
      options = _ref$config.options;
  var shuffledRows = (0, _react.useMemo)(function () {
    return rows.sort(function () {
      return Math.random() - Math.random();
    });
  }, [rows]);
  var adaptedData = (0, _react.useMemo)(function () {
    if (type === 'bar' || type === 'pie' || type === 'scatter') {
      return shuffledRows.slice(0, 15);
    } else if (type === 'line') {
      return rows.slice(0, 15);
    }

    throw new Error();
  }, [rows, shuffledRows, type]);
  var adaptedConfig = (0, _react.useMemo)(function () {
    if (type === 'bar') {
      return _objectSpread(_objectSpread(_objectSpread({
        data: adaptedData,
        groupMode: options.stack ? 'stacked' : 'grouped'
      }, options.indexBy && {
        indexBy: options.indexBy
      }), options.group ? {
        groupByKey: options.groupBy,
        valueKey: options.keys[0]
      } : {
        keys: options.keys
      }), options.group && options.keys[0] && {
        axisLeftLegendLabel: options.keys[0]
      });
    } else if (type === 'line') {
      return _objectSpread(_objectSpread({
        // title={title}
        data: adaptedData
      }, options.indexByValue && {
        indexBy: options.indexBy
      }), {}, {
        yKeys: options.y,
        xKey: options.x,
        xScale: {
          type: 'point'
        },
        indexByValue: options.indexByValue,
        axisBottomLegendLabel: options.x,
        axisLeftLegendLabel: options.y.join(', ')
      });
    } else if (type === 'pie') {
      return {
        //   title:title ,
        data: adaptedData,
        dataKey: options.keys[0],
        // TODO support multi..?
        indexBy: options.indexBy,
        isDonut: options.donut
      };
    } else if (type === 'scatter') {
      return {
        //   title:title ,
        data: adaptedData,
        xKey: options.x,
        yKeys: options.y,
        indexBy: options.indexBy
      };
    }
  }, [adaptedData, options, type]);
  return /*#__PURE__*/(0, _react.createElement)(charts[type], _objectSpread({}, adaptedConfig));
};

WidgetAdapter.propTypes = {
  rows: _propTypes.default.array,
  columns: _propTypes.default.array,
  config: _propTypes.default.object
};
WidgetAdapter.default = {
  rows: [],
  columns: [],
  config: {}
};
var _default = WidgetAdapter;
exports.default = _default;