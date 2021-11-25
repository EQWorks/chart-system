"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _scatterplot = require("@nivo/scatterplot");

var _customScatterLegend = _interopRequireDefault(require("./custom-scatter-legend"));

var _chartWrapper = require("../chart-wrapper");

var _customNode = _interopRequireDefault(require("./custom-node"));

var _tooltip = _interopRequireDefault(require("../tooltip"));

var _events = require("./events");

var _hooks = require("../hooks");

var _utils = require("../shared/utils");

var _chartProps = require("../shared/constants/chart-props");

var _dimensions = require("../shared/constants/dimensions");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var propTypes = _objectSpread(_objectSpread(_objectSpread({}, _chartProps.seriesPropTypes), _chartProps.chartPropTypes), _chartProps.typographyPropTypes);

var defaultProps = _objectSpread(_objectSpread(_objectSpread({}, _chartProps.seriesDefaultProps), _chartProps.chartDefaultProps), _chartProps.typographyDefaultProps); // ScatterChart - creates a scatter chart


var ScatterChart = function ScatterChart(_ref) {
  var data = _ref.data,
      indexByValue = _ref.indexByValue,
      indexBy = _ref.indexBy,
      xKey = _ref.xKey,
      yKeys = _ref.yKeys,
      colors = _ref.colors,
      colorType = _ref.colorType,
      colorParam = _ref.colorParam,
      axisBottomLegendLabel = _ref.axisBottomLegendLabel,
      axisBottomTrim = _ref.axisBottomTrim,
      axisBottomLabelDisplayFn = _ref.axisBottomLabelDisplayFn,
      axisBottomOrder = _ref.axisBottomOrder,
      axisBottomLabelValues = _ref.axisBottomLabelValues,
      axisLeftLabelDisplayFn = _ref.axisLeftLabelDisplayFn,
      xScale = _ref.xScale,
      axisLeftLegendLabel = _ref.axisLeftLegendLabel,
      yScale = _ref.yScale,
      maxRowLegendItems = _ref.maxRowLegendItems,
      trimLegend = _ref.trimLegend,
      disableLegend = _ref.disableLegend,
      width = _ref.width,
      height = _ref.height,
      tooltipFormat = _ref.tooltipFormat,
      tooltipFormatX = _ref.tooltipFormatX,
      disableTooltipTitle = _ref.disableTooltipTitle,
      typographyProps = _ref.typographyProps,
      nivoProps = (0, _objectWithoutProperties2.default)(_ref, ["data", "indexByValue", "indexBy", "xKey", "yKeys", "colors", "colorType", "colorParam", "axisBottomLegendLabel", "axisBottomTrim", "axisBottomLabelDisplayFn", "axisBottomOrder", "axisBottomLabelValues", "axisLeftLabelDisplayFn", "xScale", "axisLeftLegendLabel", "yScale", "maxRowLegendItems", "trimLegend", "disableLegend", "width", "height", "tooltipFormat", "tooltipFormatX", "disableTooltipTitle", "typographyProps"]);

  var _useMemo = (0, _react.useMemo)(function () {
    var _processSeriesDataKey = (0, _utils.processSeriesDataKeys)({
      data: data,
      indexBy: indexBy,
      xKey: xKey,
      yKeys: yKeys,
      indexByValue: indexByValue
    }),
        finalIndexBy = _processSeriesDataKey.finalIndexBy,
        finalXKey = _processSeriesDataKey.finalXKey,
        finalYKeys = _processSeriesDataKey.finalYKeys;

    var unsortedData = (0, _utils.convertDataToNivo)({
      data: data,
      indexBy: finalIndexBy,
      xKey: finalXKey,
      yKeys: finalYKeys,
      indexByValue: indexByValue
    });
    var nivoData = (0, _utils.processAxisOrderNivo)({
      unsortedData: unsortedData,
      axisBottomOrder: axisBottomOrder
    });
    var baseColors = colors.length ? colors : (0, _utils.processColors)(data.length, colorType, colorParam); // ====[TODO] flexible/repeat nature of colors could screw up { id: color } map
    // =========] would need to include repeat logic here?

    var baseDataToColorMap = nivoData.reduce(function (agg, o, i) {
      return _objectSpread(_objectSpread({}, agg), {}, (0, _defineProperty2.default)({}, o.id, typeof baseColors === 'function' ? baseColors(o) : baseColors[i]));
    }, {});
    return {
      nivoData: nivoData,
      baseDataToColorMap: baseDataToColorMap
    };
  }, [data, indexBy, xKey, yKeys, indexByValue, axisBottomOrder, colorParam, colorType, colors]),
      nivoData = _useMemo.nivoData,
      baseDataToColorMap = _useMemo.baseDataToColorMap;

  var _useState = (0, _react.useState)(nivoData),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      finalData = _useState2[0],
      setFinalData = _useState2[1];

  (0, _react.useEffect)(function () {
    setFinalData(nivoData);
  }, [nivoData]);

  var _useMemo2 = (0, _react.useMemo)(function () {
    return finalData.reduce(function (_ref2, o) {
      var finalColors = _ref2.finalColors,
          currentColorMap = _ref2.currentColorMap;
      return {
        finalColors: [].concat((0, _toConsumableArray2.default)(finalColors), [baseDataToColorMap[o.id]]),
        currentColorMap: _objectSpread(_objectSpread({}, currentColorMap), {}, (0, _defineProperty2.default)({}, o.id, baseDataToColorMap[o.id]))
      };
    }, {
      finalColors: [],
      currentColorMap: {}
    });
  }, [finalData, baseDataToColorMap]),
      finalColors = _useMemo2.finalColors,
      currentColorMap = _useMemo2.currentColorMap;

  var legendOnClick = function legendOnClick(_ref3) {
    var id = _ref3.id;
    setFinalData(function (prevData) {
      var idx = prevData.findIndex(function (o) {
        return o.id === id;
      });

      if (idx < 0) {
        // ====[NOTE] data & colors are matched by index, so add back in to original position
        var ogIdx = nivoData.findIndex(function (o) {
          return o.id === id;
        });
        return [].concat((0, _toConsumableArray2.default)(prevData.slice(0, ogIdx)), [nivoData[ogIdx]], (0, _toConsumableArray2.default)(prevData.slice(ogIdx)));
      }

      return [].concat((0, _toConsumableArray2.default)(prevData.slice(0, idx)), (0, _toConsumableArray2.default)(prevData.slice(idx + 1)));
    });
  };

  var finalXScale = (0, _react.useMemo)(function () {
    return _objectSpread({
      type: 'linear'
    }, xScale);
  }, [xScale]);
  var finalYScale = (0, _react.useMemo)(function () {
    return _objectSpread({
      type: 'linear'
    }, yScale);
  }, [yScale]);
  var axisBottomTickValues = axisBottomLabelValues;

  var _useMemo3 = (0, _react.useMemo)(function () {
    return (0, _utils.getAxisLabelsSeries)({
      data: finalData,
      xScale: finalXScale,
      yScale: finalYScale,
      width: width,
      height: height,
      axisBottomTickValues: axisBottomTickValues,
      axisBottomLabelDisplayFn: axisBottomLabelDisplayFn,
      axisLeftLabelDisplayFn: axisLeftLabelDisplayFn,
      typographyProps: typographyProps
    });
  }, [finalData, finalXScale, finalYScale, width, height, axisBottomTickValues, axisBottomLabelDisplayFn, axisLeftLabelDisplayFn, typographyProps]),
      axisBottomLabelCount = _useMemo3.xLabelCount,
      lastXAxisTickLabelWidth = _useMemo3.lastXLabelWidth,
      maxYAxisTickLabelWidth = _useMemo3.maxYLabelWidth;

  var legendToggle = (0, _hooks.useLegendToggle)(data);
  return /*#__PURE__*/_react.default.createElement(_scatterplot.ScatterPlot, (0, _extends2.default)({}, nivoProps, {
    layers: ['grid', 'axes', 'nodes', 'markers', _customScatterLegend.default],
    height: height,
    width: width,
    data: finalData,
    colors: finalColors,
    xScale: finalXScale,
    yScale: finalYScale,
    nodeSize: _dimensions.SYMBOL_SIZE,
    useMesh: false,
    onMouseEnter: _events.onMouseEnter,
    onMouseLeave: _events.onMouseLeave,
    renderNode: _customNode.default,
    tooltip: function tooltip(_ref4) {
      var node = _ref4.node;
      return /*#__PURE__*/_react.default.createElement(_tooltip.default, {
        label: node.id.split('.')[0],
        color: node.style.color,
        display: [{
          label: axisBottomLegendLabel,
          value: tooltipFormatX(node.data.formattedX)
        }, {
          label: axisLeftLegendLabel,
          value: tooltipFormat(node.data.formattedY)
        }],
        disableTooltipTitle: disableTooltipTitle,
        chartType: "scatter",
        typography: typographyProps
      });
    }
  }, (0, _utils.getCommonProps)({
    useAxis: true,
    keys: nivoData.map(function (o) {
      return o.id;
    }),
    legendOnClick: legendOnClick,
    currentColorMap: currentColorMap,
    height: height,
    width: width,
    axisBottomTrim: axisBottomTrim,
    axisBottomLegendLabel: axisBottomLegendLabel,
    axisBottomLabelDisplayFn: axisBottomLabelDisplayFn,
    axisBottomTickValues: axisBottomTickValues,
    axisBottomLabelCount: axisBottomLabelCount,
    lastXAxisTickLabelWidth: lastXAxisTickLabelWidth,
    axisLeftLegendLabel: axisLeftLegendLabel,
    axisLeftLabelDisplayFn: axisLeftLabelDisplayFn,
    maxYAxisTickLabelWidth: maxYAxisTickLabelWidth,
    maxRowLegendItems: maxRowLegendItems,
    trimLegend: trimLegend,
    disableLegend: disableLegend,
    typographyProps: typographyProps,
    dash: true
  }), legendToggle));
};

ScatterChart.defaultProps = defaultProps;
ScatterChart.propTypes = propTypes;

var _default = (0, _chartWrapper.withWrapper)(ScatterChart);

exports.default = _default;