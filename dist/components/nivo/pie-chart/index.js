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

var _propTypes = _interopRequireDefault(require("prop-types"));

var _pie = require("@nivo/pie");

var _chartWrapper = require("../chart-wrapper");

var _tooltip = _interopRequireDefault(require("../tooltip"));

var _hooks = require("../hooks");

var _utils = require("../shared/utils");

var _chartProps = require("../shared/constants/chart-props");

var _dimensions = require("../shared/constants/dimensions");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var propTypes = _objectSpread(_objectSpread({
  isDonut: _propTypes.default.bool,
  enableSlicesLabels: _propTypes.default.bool,
  slicesLabelsSkipAngle: _propTypes.default.number,
  dataKey: _propTypes.default.string,
  groupByKey: _propTypes.default.string,
  valueKey: _propTypes.default.string,
  padAngle: _propTypes.default.number,
  cornerRadius: _propTypes.default.number
}, _chartProps.typographyPropTypes), _chartProps.chartPropTypes);

var defaultProps = _objectSpread(_objectSpread({
  isDonut: false,
  enableSlicesLabels: true,
  slicesLabelsSkipAngle: 30,
  dataKey: '',
  groupByKey: '',
  valueKey: '',
  padAngle: 0.7,
  cornerRadius: 3
}, _chartProps.typographyDefaultProps), _chartProps.chartDefaultProps); // PieChart - creates a pie chart


var PieChart = function PieChart(_ref) {
  var isDonut = _ref.isDonut,
      dataKey = _ref.dataKey,
      groupByKey = _ref.groupByKey,
      valueKey = _ref.valueKey,
      indexBy = _ref.indexBy,
      data = _ref.data,
      colors = _ref.colors,
      colorType = _ref.colorType,
      colorParam = _ref.colorParam,
      width = _ref.width,
      height = _ref.height,
      enableSlicesLabels = _ref.enableSlicesLabels,
      slicesLabelsSkipAngle = _ref.slicesLabelsSkipAngle,
      padAngle = _ref.padAngle,
      cornerRadius = _ref.cornerRadius,
      maxRowLegendItems = _ref.maxRowLegendItems,
      trimLegend = _ref.trimLegend,
      disableLegend = _ref.disableLegend,
      tooltipFormat = _ref.tooltipFormat,
      disableTooltipTitle = _ref.disableTooltipTitle,
      typographyProps = _ref.typographyProps,
      nivoProps = (0, _objectWithoutProperties2.default)(_ref, ["isDonut", "dataKey", "groupByKey", "valueKey", "indexBy", "data", "colors", "colorType", "colorParam", "width", "height", "enableSlicesLabels", "slicesLabelsSkipAngle", "padAngle", "cornerRadius", "maxRowLegendItems", "trimLegend", "disableLegend", "tooltipFormat", "disableTooltipTitle", "typographyProps"]);

  var _useState = (0, _react.useState)(padAngle),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      slicePadAngle = _useState2[0],
      setSlicePadAngle = _useState2[1];

  var _useState3 = (0, _react.useState)(cornerRadius),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      sliceCornerRadius = _useState4[0],
      setSliceCornerRadius = _useState4[1];

  var _useMemo = (0, _react.useMemo)(function () {
    // indexBy => id
    // valueKey => value
    var _processPieDataKeys = (0, _utils.processPieDataKeys)({
      data: data,
      indexBy: indexBy,
      dataKey: dataKey
    }),
        finalIndexBy = _processPieDataKeys.finalIndexBy,
        finalDataKey = _processPieDataKeys.finalDataKey;

    var aggregatedData = (0, _utils.aggregateData)({
      data: data,
      keys: [finalDataKey],
      indexBy: finalIndexBy,
      groupByKey: groupByKey,
      valueKey: valueKey,
      type: 'sum'
    });
    var nivoData = (0, _utils.convertPieDataToNivo)({
      data: aggregatedData,
      indexBy: finalIndexBy,
      dataKey: finalDataKey
    });
    var baseColors = colors.length ? colors : (0, _utils.processColors)(data.length, colorType, colorParam);

    if (typeof colors === 'function') {
      baseColors = nivoData.map(colors);
    }

    return {
      nivoData: nivoData,
      baseColors: baseColors
    };
  }, [data, colors, indexBy, colorParam, colorType, dataKey, groupByKey, valueKey]),
      nivoData = _useMemo.nivoData,
      baseColors = _useMemo.baseColors;

  var _useReducer = (0, _react.useReducer)(function (state, _ref2) {
    var type = _ref2.type,
        payload = _ref2.payload;

    if (type === 'reset') {
      return payload;
    }

    if (type === 'toggle') {
      var idx = state.finalData.findIndex(function (o) {
        return o.id === payload;
      });
      var currentSeries = state.finalData[idx];

      var _finalData = [].concat((0, _toConsumableArray2.default)(state.finalData.slice(0, idx)), [// ====[NOTE] return original OR set value to 0 (hack to hide the slice)
      currentSeries.hide ? nivoData[idx] : _objectSpread(_objectSpread({}, state.finalData[idx]), {}, {
        value: 0,
        hide: true
      })], (0, _toConsumableArray2.default)(state.finalData.slice(idx + 1)));

      var visibleSlices = _finalData.filter(function (d) {
        return !d.hide;
      }); // don't use corner radius and padAngle on the last 100% slice


      if (visibleSlices.length === 1) {
        setSlicePadAngle(0);
        setSliceCornerRadius(0);
      } else {
        setSlicePadAngle(padAngle);
        setSliceCornerRadius(cornerRadius);
      }

      var total = _finalData.reduce(function (sum, row) {
        return sum + row.value;
      }, 0);

      return {
        finalData: _finalData.map(function (o) {
          return _objectSpread(_objectSpread({}, o), {}, {
            percent: "".concat((o.value * 100 / total).toFixed(1), "%")
          });
        }),
        finalColors: [].concat((0, _toConsumableArray2.default)(state.finalColors.slice(0, idx)), [// ====[NOTE] return original OR set color to grey (hack to change legend)
        currentSeries.hide ? baseColors[idx] : 'rgba(150, 150, 150, 0.5)'], (0, _toConsumableArray2.default)(state.finalColors.slice(idx + 1)))
      };
    }

    return state;
  }, {
    finalData: nivoData,
    finalColors: baseColors
  }),
      _useReducer2 = (0, _slicedToArray2.default)(_useReducer, 2),
      _useReducer2$ = _useReducer2[0],
      finalData = _useReducer2$.finalData,
      finalColors = _useReducer2$.finalColors,
      dispatch = _useReducer2[1];

  (0, _react.useEffect)(function () {
    dispatch({
      type: 'reset',
      payload: {
        finalData: nivoData,
        finalColors: baseColors
      }
    });
  }, [nivoData, baseColors]);

  var legendOnClick = function legendOnClick(_ref3) {
    var id = _ref3.id;
    return dispatch({
      type: 'toggle',
      payload: id
    });
  };

  var mouseLeaveHandler = function mouseLeaveHandler(_data, event) {
    var arc = event.target;
    Array.from(arc.parentNode.children).filter(function (ele) {
      return ele.tagName === 'path' && ele !== arc;
    }) // reset all other slices
    .forEach(function (tag) {
      tag.style.opacity = 1;
    });
  };

  var mouseOverHandler = function mouseOverHandler(_data, event) {
    var arc = event.target;
    Array.from(arc.parentNode.children).filter(function (ele) {
      return ele.tagName === 'path' && ele !== arc;
    }) // lighten all other slices
    .forEach(function (tag) {
      tag.style.opacity = _dimensions.DATA_HOVER_OPACITY;
    });
  }; // we don't show slice labels unless chart width and chart height are large enough


  var showLabels = false; // case for the charts without axes / pie chart

  if (width >= _dimensions.WIDTH_BREAKPOINT_2 && height >= _dimensions.HEIGHT_BREAKPOINT_2) {
    showLabels = true;
  }

  var legendToggle = (0, _hooks.useLegendToggle)(data);
  return /*#__PURE__*/_react.default.createElement(_pie.Pie, (0, _extends2.default)({}, nivoProps, {
    height: height,
    width: width,
    data: finalData,
    colors: finalColors,
    padAngle: slicePadAngle,
    cornerRadius: sliceCornerRadius,
    enableRadialLabels: false,
    fit: true,
    enableSlicesLabels: enableSlicesLabels,
    sliceLabel: showLabels ? 'percent' : '',
    slicesLabelsSkipAngle: slicesLabelsSkipAngle,
    slicesLabelsTextColor: "#fff",
    innerRadius: isDonut ? 0.6 : 0,
    tooltip: function tooltip(_ref4) {
      var id = _ref4.id,
          value = _ref4.value,
          percent = _ref4.percent,
          color = _ref4.color;
      return /*#__PURE__*/_react.default.createElement(_tooltip.default, {
        label: id,
        color: color,
        display: [{
          label: 'Value',
          value: tooltipFormat(value)
        }, {
          label: 'Share',
          value: percent
        }],
        disableTooltipTitle: disableTooltipTitle,
        chartType: "pie",
        typography: typographyProps
      });
    },
    onMouseEnter: mouseOverHandler,
    onMouseLeave: mouseLeaveHandler
  }, (0, _utils.getCommonProps)({
    useAxis: false,
    keys: finalData.map(function (o) {
      return o.id;
    }),
    legendOnClick: legendOnClick,
    height: height,
    width: width,
    maxRowLegendItems: maxRowLegendItems,
    trimLegend: trimLegend,
    disableLegend: disableLegend,
    typographyProps: typographyProps,
    dash: true
  }), legendToggle));
};

PieChart.defaultProps = defaultProps;
PieChart.propTypes = propTypes;

var _default = (0, _chartWrapper.withWrapper)(PieChart);

exports.default = _default;