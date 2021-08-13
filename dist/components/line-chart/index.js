"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _goober = require("goober");

var _line = require("@nivo/line");

var _chartWrapper = require("../chart-wrapper");

var _tooltip = _interopRequireDefault(require("../tooltip"));

var _hooks = require("../hooks");

var _utils = require("../../shared/utils");

var _chartProps = require("../../shared/constants/chart-props");

var _dimensions = require("../../shared/constants/dimensions");

var _templateObject;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

(0, _goober.setup)(_react.default.createElement);
var Container = (0, _goober.styled)('div')(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  height: 100%;\n  width: 100%;\n"])));

var propTypes = _objectSpread(_objectSpread(_objectSpread({}, _chartProps.typographyPropTypes), _chartProps.seriesPropTypes), _chartProps.chartPropTypes);

var defaultProps = _objectSpread(_objectSpread(_objectSpread({}, _chartProps.typographyDefaultProps), _chartProps.seriesDefaultProps), _chartProps.chartDefaultProps);

var mouseOut = function mouseOut(event) {
  var container = event.target; // event target changes depending on what the cursor leaves from

  if (container.tagName === 'rect') {
    container.parentNode.parentNode.getElementsByTagName('path').forEach(function (p) {
      return p.style.opacity = 1.0;
    });
  } else if (container.tagName === 'svg') {
    container.children[1].getElementsByTagName('path').forEach(function (p) {
      return p.style.opacity = 1.0;
    });
  }
}; // LineChart - creates a line chart


var ResponsiveLineChart = function ResponsiveLineChart(_ref) {
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
      width = _ref.width,
      height = _ref.height,
      maxRowLegendItems = _ref.maxRowLegendItems,
      trimLegend = _ref.trimLegend,
      disableLegend = _ref.disableLegend,
      tooltipFormat = _ref.tooltipFormat,
      tooltipFormatX = _ref.tooltipFormatX,
      disableTooltipTitle = _ref.disableTooltipTitle,
      typographyProps = _ref.typographyProps,
      nivoProps = (0, _objectWithoutProperties2.default)(_ref, ["data", "indexByValue", "indexBy", "xKey", "yKeys", "colors", "colorType", "colorParam", "axisBottomLegendLabel", "axisBottomTrim", "axisBottomLabelDisplayFn", "axisBottomOrder", "axisBottomLabelValues", "axisLeftLabelDisplayFn", "xScale", "axisLeftLegendLabel", "yScale", "width", "height", "maxRowLegendItems", "trimLegend", "disableLegend", "tooltipFormat", "tooltipFormatX", "disableTooltipTitle", "typographyProps"]);

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
    var baseColors = colors.length ? colors : (0, _utils.processColors)(nivoData.length, colorType, colorParam); // ====[TODO] flexible/repeat nature of colors could screw up { id: color } map
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
  return (
    /*#__PURE__*/
    // NOTE: onMouseLeave and onMouseEnter events not firing correctly
    // https://github.com/plouc/nivo/issues/756
    _react.default.createElement(Container, {
      onMouseOut: mouseOut
    }, /*#__PURE__*/_react.default.createElement(_line.Line, (0, _extends2.default)({}, nivoProps, {
      height: height,
      width: width,
      data: finalData,
      colors: finalColors,
      xScale: finalXScale,
      yScale: finalYScale,
      pointColor: {
        theme: 'background'
      },
      pointBorderWidth: 0,
      pointBorderColor: {
        from: 'serieColor'
      },
      useMesh: true,
      enableCrosshair: true,
      crosshairType: "bottom",
      onMouseMove: function onMouseMove(d, event) {
        var dataPoints = Array.from(event.target.parentNode.parentNode.getElementsByTagName('path'));
        var hoverItemIndex = finalData.findIndex(function (o) {
          return d.serieId === o.id;
        });
        var hovered = dataPoints.splice(hoverItemIndex, 1);
        hovered[0].style.opacity = 1.0;
        dataPoints.forEach(function (point) {
          point.style.opacity = _dimensions.DATA_HOVER_OPACITY;
        });
      },
      tooltip: function tooltip(_ref4) {
        var point = _ref4.point;
        return /*#__PURE__*/_react.default.createElement(_tooltip.default, {
          color: point.borderColor,
          label: point.serieId,
          display: [{
            label: axisBottomLegendLabel,
            value: tooltipFormatX(point.data.x)
          }, {
            label: axisLeftLegendLabel,
            value: tooltipFormat(point.data.y)
          }],
          disableTooltipTitle: disableTooltipTitle,
          chartType: "line",
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
    }), legendToggle)))
  );
};

ResponsiveLineChart.defaultProps = defaultProps;
ResponsiveLineChart.propTypes = propTypes;

var _default = (0, _chartWrapper.withWrapper)(ResponsiveLineChart);

exports.default = _default;