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

var _bar = require("@nivo/bar");

var _customBarLegend = _interopRequireDefault(require("./custom-bar-legend"));

var _chartWrapper = require("../chart-wrapper");

var _tooltip = _interopRequireDefault(require("../tooltip"));

var _hooks = require("../hooks");

var _utils = require("../../shared/utils");

var _chartProps = require("../../shared/constants/chart-props");

var _dimensions = require("../../shared/constants/dimensions");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var propTypes = _objectSpread(_objectSpread(_objectSpread({}, _chartProps.typographyPropTypes), _chartProps.chartPropTypes), _chartProps.barChartPropTypes);

var defaultProps = _objectSpread(_objectSpread(_objectSpread({}, _chartProps.typographyDefaultProps), _chartProps.chartDefaultProps), _chartProps.barChartDefaultProps);

var BarChart = function BarChart(_ref) {
  var keys = _ref.keys,
      indexBy = _ref.indexBy,
      data = _ref.data,
      colors = _ref.colors,
      colorType = _ref.colorType,
      colorParam = _ref.colorParam,
      axisBottomLegendLabel = _ref.axisBottomLegendLabel,
      axisLeftLegendLabel = _ref.axisLeftLegendLabel,
      width = _ref.width,
      height = _ref.height,
      axisBottomTrim = _ref.axisBottomTrim,
      axisBottomLabelDisplayFn = _ref.axisBottomLabelDisplayFn,
      axisBottomOrder = _ref.axisBottomOrder,
      axisBottomLabelValues = _ref.axisBottomLabelValues,
      axisLeftLabelDisplayFn = _ref.axisLeftLabelDisplayFn,
      groupByKey = _ref.groupByKey,
      valueKey = _ref.valueKey,
      maxRowLegendItems = _ref.maxRowLegendItems,
      trimLegend = _ref.trimLegend,
      disableLegend = _ref.disableLegend,
      tooltipFormat = _ref.tooltipFormat,
      tooltipFormatX = _ref.tooltipFormatX,
      disableTooltipTitle = _ref.disableTooltipTitle,
      typographyProps = _ref.typographyProps,
      nivoProps = (0, _objectWithoutProperties2.default)(_ref, ["keys", "indexBy", "data", "colors", "colorType", "colorParam", "axisBottomLegendLabel", "axisLeftLegendLabel", "width", "height", "axisBottomTrim", "axisBottomLabelDisplayFn", "axisBottomOrder", "axisBottomLabelValues", "axisLeftLabelDisplayFn", "groupByKey", "valueKey", "maxRowLegendItems", "trimLegend", "disableLegend", "tooltipFormat", "tooltipFormatX", "disableTooltipTitle", "typographyProps"]);

  var _useMemo = (0, _react.useMemo)(function () {
    /* ====[NOTE]
      a single key is required for the X axis scale
      the rest are used as values
      indexBy cannot be present in keys[]
    */
    var _processDataKeys = (0, _utils.processDataKeys)({
      data: data,
      keys: keys,
      indexBy: indexBy,
      groupByKey: groupByKey
    }),
        finalKeys = _processDataKeys.finalKeys,
        finalIndexBy = _processDataKeys.finalIndexBy; // ====[TODO] props for type (sum, max, min, avg)


    var aggregatedData = (0, _utils.aggregateData)({
      data: data,
      keys: finalKeys,
      indexBy: finalIndexBy,
      groupByKey: groupByKey,
      valueKey: valueKey,
      type: 'sum'
    });
    var finalData = (0, _utils.processAxisOrder)({
      data: aggregatedData,
      axisBottomOrder: axisBottomOrder,
      finalIndexBy: finalIndexBy
    });
    var baseColors = colors.length ? colors : (0, _utils.processColors)(finalKeys.length, colorType, colorParam);
    var baseDataToColorMap = finalKeys.reduce(function (agg, key, i) {
      return _objectSpread(_objectSpread({}, agg), {}, (0, _defineProperty2.default)({}, key, typeof baseColors === 'function' ? baseColors(key) : baseColors[i]));
    }, {});
    return {
      finalData: finalData,
      baseDataToColorMap: baseDataToColorMap,
      finalIndexBy: finalIndexBy,
      baseKeys: finalKeys
    };
  }, [data, indexBy, axisBottomOrder, colorParam, colorType, colors, groupByKey, keys, valueKey]),
      finalData = _useMemo.finalData,
      baseDataToColorMap = _useMemo.baseDataToColorMap,
      finalIndexBy = _useMemo.finalIndexBy,
      baseKeys = _useMemo.baseKeys;

  var _useState = (0, _react.useState)(baseKeys),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      finalKeys = _useState2[0],
      setFinalKeys = _useState2[1];

  (0, _react.useEffect)(function () {
    setFinalKeys(baseKeys);
  }, [baseKeys]);

  var _useMemo2 = (0, _react.useMemo)(function () {
    return finalKeys.reduce(function (_ref2, key) {
      var finalColors = _ref2.finalColors,
          currentColorMap = _ref2.currentColorMap;
      return {
        finalColors: [].concat((0, _toConsumableArray2.default)(finalColors), [baseDataToColorMap[key]]),
        currentColorMap: _objectSpread(_objectSpread({}, currentColorMap), {}, (0, _defineProperty2.default)({}, key, baseDataToColorMap[key]))
      };
    }, {
      finalColors: [],
      currentColorMap: {}
    });
  }, [finalKeys, baseDataToColorMap]),
      finalColors = _useMemo2.finalColors,
      currentColorMap = _useMemo2.currentColorMap;

  var legendOnClick = function legendOnClick(_ref3) {
    var id = _ref3.id;
    setFinalKeys(function (prevData) {
      var idx = prevData.findIndex(function (key) {
        return key === id;
      });

      if (idx < 0) {
        // ====[NOTE] data & colors are matched by index, so keep order of keys
        var newKeys = [].concat((0, _toConsumableArray2.default)(prevData), [id]);
        return baseKeys.filter(function (key) {
          return newKeys.includes(key);
        });
      }

      return [].concat((0, _toConsumableArray2.default)(prevData.slice(0, idx)), (0, _toConsumableArray2.default)(prevData.slice(idx + 1)));
    });
  };

  var axisBottomTickValues = axisBottomLabelValues;

  var _useMemo3 = (0, _react.useMemo)(function () {
    return (0, _utils.getAxisLabelsBar)(_objectSpread({
      width: width,
      height: height,
      data: finalData,
      finalIndexBy: finalIndexBy,
      keys: finalKeys,
      axisBottomLabelValues: axisBottomLabelValues,
      axisBottomLabelDisplayFn: axisBottomLabelDisplayFn,
      axisLeftLabelDisplayFn: axisLeftLabelDisplayFn,
      typographyProps: typographyProps
    }, nivoProps));
  }, [width, height, finalData, finalIndexBy, finalKeys, axisBottomLabelValues, axisBottomLabelDisplayFn, axisLeftLabelDisplayFn, typographyProps, nivoProps]),
      axisBottomLabelCount = _useMemo3.xLabelCount,
      lastXAxisTickLabelWidth = _useMemo3.lastXLabelWidth,
      maxYAxisTickLabelWidth = _useMemo3.maxYLabelWidth;

  var legendToggle = (0, _hooks.useLegendToggle)(data);
  return /*#__PURE__*/_react.default.createElement(_bar.Bar // TODO right now, our props override, but need to see if there are any that should take precedent
  , (0, _extends2.default)({}, nivoProps, {
    layers: ['grid', 'axes', 'bars', 'markers', _customBarLegend.default],
    width: width,
    height: height,
    data: finalData // NOTE yScale, xScale, yFormat, xFormat are not exposed in Bar
    ,
    indexBy: finalIndexBy,
    keys: finalKeys,
    colors: finalColors,
    enableRadialLabels: false,
    enableGridY: true,
    enableLabel: false,
    tooltip: function tooltip(_ref4) {
      var id = _ref4.id,
          value = _ref4.value,
          color = _ref4.color,
          indexValue = _ref4.indexValue;
      return (
        /*#__PURE__*/
        // also ({ data, index, theme })
        _react.default.createElement(_tooltip.default, {
          label: id,
          color: color,
          display: [{
            label: axisBottomLegendLabel,
            value: tooltipFormatX(indexValue)
          }, {
            label: axisLeftLegendLabel,
            value: tooltipFormat(value)
          }],
          disableTooltipTitle: disableTooltipTitle,
          chartType: "bar",
          typography: typographyProps
        })
      );
    },
    onMouseEnter: function onMouseEnter(_data, event) {
      var dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'));
      var hoverItemIndex = dataPoints.indexOf(event.target);
      dataPoints.splice(hoverItemIndex, 1);
      dataPoints.forEach(function (point) {
        point.style.opacity = _dimensions.DATA_HOVER_OPACITY;
      });
    },
    onMouseLeave: function onMouseLeave(_data, event) {
      var dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'));

      for (var i = 0; i < dataPoints.length; i++) {
        dataPoints[i].style.opacity = 1;
      }
    }
  }, (0, _utils.getCommonProps)({
    useAxis: true,
    keys: baseKeys,
    legendOnClick: legendOnClick,
    currentColorMap: currentColorMap,
    height: height,
    width: width,
    axisBottomTrim: axisBottomTrim,
    axisBottomLegendLabel: axisBottomLegendLabel,
    axisBottomTickValues: axisBottomTickValues,
    axisBottomLabelDisplayFn: axisBottomLabelDisplayFn,
    axisLeftLabelDisplayFn: axisLeftLabelDisplayFn,
    axisBottomLabelCount: axisBottomLabelCount,
    lastXAxisTickLabelWidth: lastXAxisTickLabelWidth,
    axisLeftLegendLabel: axisLeftLegendLabel,
    maxYAxisTickLabelWidth: maxYAxisTickLabelWidth,
    maxRowLegendItems: maxRowLegendItems,
    trimLegend: trimLegend,
    disableLegend: disableLegend,
    typographyProps: typographyProps
  }), legendToggle));
};

BarChart.defaultProps = defaultProps;
BarChart.propTypes = propTypes;

var _default = (0, _chartWrapper.withWrapper)(BarChart);

exports.default = _default;