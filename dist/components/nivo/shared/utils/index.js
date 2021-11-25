"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processAxisOrderNivo = exports.processAxisOrder = exports.processColors = exports.convertDataToNivo = exports.convertPieDataToNivo = exports.processPieDataKeys = exports.processSeriesDataKeys = exports.processDataKeys = exports.aggregateData = exports.getCommonProps = exports.trimLegendLabel = exports.isAspectRatio = exports.aspectRatios = exports.getAxisLabelsSeries = exports.getAxisLabelsBar = exports.getTextSize = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _scales = require("@nivo/scales");

var _nivo = require("./nivo");

var _dimensions = require("../constants/dimensions");

var _designSystemColors = _interopRequireWildcard(require("../../../../constants/design-system-colors"));

var _legendSymbol = _interopRequireDefault(require("../../legend-symbol"));

var _lodash = _interopRequireDefault(require("lodash.omit"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// "vendored" from https://github.com/mdevils/html-entities/blob/68a1a96/src/xml-entities.ts
var decodeXML = function decodeXML(str) {
  var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
  };

  if (!str || !str.length) {
    return '';
  }

  return str.replace(/&#?[0-9a-zA-Z]+;?/g, function (s) {
    if (s.charAt(1) === '#') {
      var code = s.charAt(2).toLowerCase() === 'x' ? parseInt(s.substr(3), 16) : parseInt(s.substr(2));

      if (isNaN(code) || code < -32768 || code > 65535) {
        return '';
      }

      return String.fromCharCode(code);
    }

    return ALPHA_INDEX[s] || s;
  });
};
/**
 * https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/50813259#50813259
 * getTextSize - calculates a rendered text width and height in pixels
 * @param { string } text - a text string
 * @param { object } typographyProps - an object with font size, font family, and text color for the chart
 * @returns { object } - the width and height of the rendered text in pixels
 */


var getTextSize = function getTextSize(text, typographyProps) {
  var font = "".concat(typographyProps.fontSize, "px ").concat(typographyProps.fontFamily);
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = font;
  var metrics = typeof text === 'number' ? context.measureText(text) : context.measureText(decodeXML(text));
  return {
    width: Math.ceil(metrics.width),
    height: Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent)
  };
};
/**
 * Given a font size, we want to calculate the dimensions of the chart
 * The margin is the amount of space that the left axis ticks/legend, right legend or
 * bottom axis ticks/legend AND legend have
 * The margins should be the size of these elements + spacing
 */

/**
 * setChartMargin - sets the values of the chart margins
 * @param { number } width - width of the chart conatiner (ChartInner)
 * @param { number } heigth - height of the chart conatiner (ChartInner)
 * @param { boolean } useAxis - to decide on margin logic for charts with axis
 * @param { number } maxLegendLabelWidth - maximum length of a label/key text in the legend
 * @param { number } legendItemCount - number of items in the legend
 * @param { number } maxYAxisTickLabelWidth - the length of the maximum y-axis label value
 * @param { number } lastXAxisTickLabelWidth - the length of the highest x-axis label value
 * @param { number } maxRowLegendItems - number of legend items to display on the bottom chart legend
 * @param { boolean } trimLegend - to trim or not the legend items
 * @param { boolean } disableLegend - to display or not chartLegend
 * @param { number } text_height - chart text height in pixels
 * @param { number } legend_height - chart legend text height in pixels
 * @returns { object } - top, right, bottom, left margin values
 */


exports.getTextSize = getTextSize;

var setChartMargin = function setChartMargin(width, height, useAxis, maxLegendLabelWidth, legendItemCount, maxYAxisTickLabelWidth, lastXAxisTickLabelWidth, maxRowLegendItems, trimLegend, disableLegend, text_height, legend_height) {
  // default values

  /**
   * The top margin has to fit at least the half height of possible symbols sitting on the border
   * of the chart
   * Same with the right margin, when no other elements are present to the right of the chart
   */
  var _ref = useAxis ? [_dimensions.SYMBOL_SIZE / 2 + 1, _dimensions.SYMBOL_SIZE / 2 + 1, _dimensions.AXIS_TICK_WIDTH, _dimensions.AXIS_TICK_WIDTH] : new Array(4).fill(_dimensions.BUFFER),
      _ref2 = (0, _slicedToArray2.default)(_ref, 4),
      top = _ref2[0],
      right = _ref2[1],
      bottom = _ref2[2],
      left = _ref2[3];

  var LEGEND_TRANSLATE_Y = legend_height + 3 * _dimensions.BUFFER; // we only show x-axis tick labels and legend when chart width is large enough

  var showBottomAxisLegendLabel = false;
  var showBottomAxisTicks = false; // we only show y-axis tick labels and legend when chart height is large enough

  var showLeftAxisLegendLabel = false;
  var showLeftAxisTicks = false;
  var bottomAxisLegendOffset = text_height / 2 + _dimensions.AXIS_TICK_WIDTH + _dimensions.BUFFER;
  var leftAxisLegendOffset = -(text_height / 2 + _dimensions.AXIS_TICK_WIDTH + _dimensions.BUFFER); // variable to set chart Legend offset

  var legendTranslate = LEGEND_TRANSLATE_Y; // useAxis is the case when we have axis in a chart, for ex: bar, line, scatter charts

  if (useAxis) {
    // at HEIGHT_BREAKPOINT_2 we have both axis tick labels and x-axis legend visible
    if (height >= _dimensions.HEIGHT_BREAKPOINT_2) {
      /**
       * at HEIGHT_BREAKPOINT_2 the x-axis ticks appear in the chart, therefore, the right margin
       * has to adjust to include just over half of the last x-axis tick lable width
       */
      right = Math.max(right, lastXAxisTickLabelWidth * 0.6);
      showBottomAxisLegendLabel = true;
      showBottomAxisTicks = true;
      bottomAxisLegendOffset = bottomAxisLegendOffset + text_height + 1.5 * _dimensions.BUFFER;
      bottom += 4 * _dimensions.BUFFER + 2 * text_height; // at HEIGHT_BREAKPOINT_1 we show only x-axis legend
    } else if (height >= _dimensions.HEIGHT_BREAKPOINT_1) {
      showBottomAxisLegendLabel = true;
      bottom += 3 * _dimensions.BUFFER + text_height;
    } // when chart width >= WIDTH_BREAKPOINT_2 we show both y-axis tick and legend labels


    if (width >= _dimensions.WIDTH_BREAKPOINT_2) {
      showLeftAxisLegendLabel = true;
      showLeftAxisTicks = true;
      left += text_height + 3.5 * _dimensions.BUFFER + maxYAxisTickLabelWidth;
      top = Math.max(top, text_height / 2 + 1);
      leftAxisLegendOffset = leftAxisLegendOffset - 2 * _dimensions.BUFFER - maxYAxisTickLabelWidth; // when chart width >= WIDTH_BREAKPOINT_1 we only show y-axis legend label
    } else if (width >= _dimensions.WIDTH_BREAKPOINT_1) {
      showLeftAxisLegendLabel = true; // text_height = axis legend height here

      left += text_height + 3 * _dimensions.BUFFER;
    }

    legendTranslate = bottomAxisLegendOffset + 5 * _dimensions.BUFFER;
  } // show right column legend when in landscape mode and number of legend items surpass maxRowLegendItems


  var rightHandLegend = isAspectRatio(width, height, aspectRatios.LANDSCAPE) || legendItemCount > maxRowLegendItems; // calculate height of column legend to hide it if it is larger than chart height

  var columnLegendHeight = legendItemCount * (legend_height + _dimensions.BUFFER);
  /**
   * we hide legend when disableLegend===true, chart width is below WIDTH_BREAKPOINT_3,
   * and legend height is greater than the chart height and bottom margin
   */

  var showLegend = !disableLegend && width >= _dimensions.WIDTH_BREAKPOINT_3 && columnLegendHeight <= height - 2 * _dimensions.BUFFER;
  var rightHandLegendAnchor = columnLegendHeight <= height - top - bottom ? 'right' : 'top-right';

  if (!rightHandLegend && !disableLegend) {
    // row/bottom legend appears only if !disableLegend and after chart height >= HEIGHT_BREAKPOINT_3
    showLegend = height >= _dimensions.HEIGHT_BREAKPOINT_3;
  }

  var legendLabelContainerWidth;
  var legendItemWidth;

  if (showLegend) {
    // adjust right or bottom margin accordingly
    if (rightHandLegend) {
      // default is difference between current and required space
      // enforce a minimum
      // increase the right margin until it fits the longest label
      legendTranslate = _dimensions.LEGEND_TRANSLATE_X;
      var expandingLabelContainer = width - _dimensions.WIDTH_BREAKPOINT_3 - _dimensions.LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH - legendTranslate;
      legendLabelContainerWidth = Math.max(expandingLabelContainer, _dimensions.TRIMMED_LEGEND_WIDTH);

      if (expandingLabelContainer >= maxLegendLabelWidth || !trimLegend) {
        legendLabelContainerWidth = maxLegendLabelWidth;
      }

      right = legendLabelContainerWidth + legendTranslate + _dimensions.LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH;
      legendItemWidth = legendLabelContainerWidth + _dimensions.LEGEND_COLUMN_FIXED_ELEMENTS_WIDTH;
    } else {
      legendItemWidth = (width - right - left) / legendItemCount;
      legendLabelContainerWidth = trimLegend ? legendItemWidth - _dimensions.LEGEND_ROW_FIXED_ELEMENTS_WIDTH : maxLegendLabelWidth; // adjust bottom to include legend and a buffer

      bottom += legend_height + 2 * _dimensions.BUFFER;
    }
  }

  return {
    top: top,
    right: right,
    bottom: bottom,
    left: left,
    showLegend: showLegend,
    rightHandLegend: rightHandLegend,
    rightHandLegendAnchor: rightHandLegendAnchor,
    legendItemWidth: legendItemWidth,
    legendLabelContainerWidth: legendLabelContainerWidth,
    showBottomAxisLegendLabel: showBottomAxisLegendLabel,
    showLeftAxisLegendLabel: showLeftAxisLegendLabel,
    showBottomAxisTicks: showBottomAxisTicks,
    showLeftAxisTicks: showLeftAxisTicks,
    bottomAxisLegendOffset: bottomAxisLegendOffset,
    leftAxisLegendOffset: leftAxisLegendOffset,
    legendTranslate: legendTranslate
  };
}; // NOTE: the below two functions implement axis scale calculations pulled from nivo (./nivo)
// in order to get the exact final axis labels, after d3 processing


var getAxisLabelsBar = function getAxisLabelsBar(_ref3) {
  var axisLeftLabelDisplayFn = _ref3.axisLeftLabelDisplayFn,
      axisBottomLabelDisplayFn = _ref3.axisBottomLabelDisplayFn,
      axisBottomLabelValues = _ref3.axisBottomLabelValues,
      typographyProps = _ref3.typographyProps,
      options = (0, _objectWithoutProperties2.default)(_ref3, ["axisLeftLabelDisplayFn", "axisBottomLabelDisplayFn", "axisBottomLabelValues", "typographyProps"]);

  var _getBarChartScales = (0, _nivo.getBarChartScales)(options),
      xScale = _getBarChartScales.xScale,
      yScale = _getBarChartScales.yScale;

  var xLabels = (0, _nivo.getScaleTicks)(xScale, axisBottomLabelValues);
  var yLabels = (0, _nivo.getScaleTicks)(yScale);
  return {
    xLabelCount: xLabels.length,
    lastXLabelWidth: xLabels.length ? getTextSize(axisBottomLabelDisplayFn(xLabels[xLabels.length - 1]), typographyProps).width : 0,
    yLabelCount: yLabels.length,
    maxYLabelWidth: getLabelMaxWidth(yLabels, typographyProps, axisLeftLabelDisplayFn)
  };
};

exports.getAxisLabelsBar = getAxisLabelsBar;

var getAxisLabelsSeries = function getAxisLabelsSeries(_ref4) {
  var data = _ref4.data,
      xScaleSpec = _ref4.xScale,
      yScaleSpec = _ref4.yScale,
      width = _ref4.width,
      height = _ref4.height,
      axisBottomTickValues = _ref4.axisBottomTickValues,
      axisBottomLabelDisplayFn = _ref4.axisBottomLabelDisplayFn,
      axisLeftLabelDisplayFn = _ref4.axisLeftLabelDisplayFn,
      typographyProps = _ref4.typographyProps;

  var _computeXYScalesForSe = (0, _scales.computeXYScalesForSeries)(data, xScaleSpec, yScaleSpec, width, height),
      xScale = _computeXYScalesForSe.xScale,
      yScale = _computeXYScalesForSe.yScale;

  var xLabels = (0, _nivo.getScaleTicks)(xScale, axisBottomTickValues);
  var yLabels = (0, _nivo.getScaleTicks)(yScale);
  return {
    xLabelCount: xLabels.length,
    lastXLabelWidth: xLabels.length ? getTextSize(axisBottomLabelDisplayFn(xLabels[xLabels.length - 1]), typographyProps).width : 0,
    yLabelCount: yLabels.length,
    maxYLabelWidth: getLabelMaxWidth(yLabels, typographyProps, axisLeftLabelDisplayFn)
  };
};
/**
 * getLabelMaxWidth - calculates the width of the longest label text in the legend
 * @param { array } keys - array of keys that will be in the legend
 * @param { object } typographyProps - an object with font size, font family, and text color for the chart
 * @param { function } displayFn - function to apply on keys
 * @returns { number } - the width of the longest label text in the legend
 */


exports.getAxisLabelsSeries = getAxisLabelsSeries;

var getLabelMaxWidth = function getLabelMaxWidth(keys, typographyProps, displayFn) {
  return keys.reduce(function (max, key) {
    return Math.max(max, getTextSize(displayFn(key), typographyProps).width);
  }, 0);
};
/**
 * trimText - trims a text and adds '..' at the end
 * @param { string } text - a text string
 * @param { number } containerWidth - width of the text container in pixels
 * @param { object } typographyProps - an object with font size, font family, and text color for the chart
 * @param { number } count - used to add or not a suffix
 * @returns { string } - a trimmed text with '...' added at the end
 */


var TRIM = '...';

var trimText = function trimText(text, containerWidth, typographyProps) {
  var count = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  if (text === '') return text;
  var n = text.length;
  var suffix = count ? TRIM : '';
  var textWidth = getTextSize(text.substr(0, n) + suffix, typographyProps).width;

  if (textWidth <= containerWidth) {
    return text.substr(0, n) + suffix;
  } else {
    return trimText(text.substr(0, n - 1), containerWidth, typographyProps, count + 1);
  }
};

var aspectRatios = {
  LANDSCAPE: 0,
  PORTRAIT: 1,
  ANY: 2
};
exports.aspectRatios = aspectRatios;

var getAspectRatio = function getAspectRatio(width, height) {
  return width / height > 1 ? aspectRatios.LANDSCAPE : aspectRatios.PORTRAIT;
};

var isAspectRatio = function isAspectRatio(width, height, aspectRatio) {
  return getAspectRatio(width, height) === aspectRatio;
};
/**
 * trimLegendLabel - trims the labels of the legend
 * @param { number } legendLabelContainerWidth - the width that the label needs to fit in
 * @param { object } typographyProps - an object with font size, font family, and text color for the chart
 * @param { html } node - Legend html node
 */


exports.isAspectRatio = isAspectRatio;

var trimLegendLabel = function trimLegendLabel(legendLabelContainerWidth, typographyProps) {
  return function (node) {
    if (node !== null) {
      var text = Array.from(node.parentNode.children).find(function (tag) {
        return tag.tagName === 'text';
      });

      if (text) {
        // set its original value as attribute, so that we don't keep repeating
        if (!text.getAttribute('og-key')) {
          text.setAttribute('og-key', text.innerHTML);
        }

        var original = text.getAttribute('og-key') || text.innerHTML;
        var label = original;

        if (legendLabelContainerWidth) {
          label = trimText(original, legendLabelContainerWidth, typographyProps);
        }

        text.innerHTML = label;
      }
    }
  };
}; // not object params to re-use in x/y axis


exports.trimLegendLabel = trimLegendLabel;

var getCommonAxisProps = function getCommonAxisProps(showAxisLegend, showAxisTicks, axisLegendLabel, legendOffset) {
  var displayFn = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function (d) {
    return d;
  };
  return {
    tickSize: _dimensions.AXIS_TICK_WIDTH,
    tickPadding: _dimensions.AXIS_TICK_PADDING,
    legendPosition: 'middle',
    legend: showAxisLegend ? axisLegendLabel : '',
    // TODO calculate a max width for each tick and trim
    // e.g. number of width / number of ticks
    format: function format(d) {
      return showAxisTicks ? displayFn(d) : null;
    },
    // legendOffset to position around the axis
    legendOffset: legendOffset
  };
};

var getCommonProps = function getCommonProps(_ref5) {
  var useAxis = _ref5.useAxis,
      keys = _ref5.keys,
      legendOnClick = _ref5.legendOnClick,
      _ref5$currentColorMap = _ref5.currentColorMap,
      currentColorMap = _ref5$currentColorMap === void 0 ? {} : _ref5$currentColorMap,
      height = _ref5.height,
      width = _ref5.width,
      _ref5$axisBottomTrim = _ref5.axisBottomTrim,
      axisBottomTrim = _ref5$axisBottomTrim === void 0 ? true : _ref5$axisBottomTrim,
      axisBottomLegendLabel = _ref5.axisBottomLegendLabel,
      _ref5$axisBottomLabel = _ref5.axisBottomLabelDisplayFn,
      axisBottomLabelDisplayFn = _ref5$axisBottomLabel === void 0 ? function (d) {
    return d;
  } : _ref5$axisBottomLabel,
      axisBottomTickValues = _ref5.axisBottomTickValues,
      axisBottomLabelCount = _ref5.axisBottomLabelCount,
      lastXAxisTickLabelWidth = _ref5.lastXAxisTickLabelWidth,
      axisLeftLegendLabel = _ref5.axisLeftLegendLabel,
      _ref5$axisLeftLabelDi = _ref5.axisLeftLabelDisplayFn,
      axisLeftLabelDisplayFn = _ref5$axisLeftLabelDi === void 0 ? function (d) {
    return d;
  } : _ref5$axisLeftLabelDi,
      _ref5$maxYAxisTickLab = _ref5.maxYAxisTickLabelWidth,
      maxYAxisTickLabelWidth = _ref5$maxYAxisTickLab === void 0 ? 0 : _ref5$maxYAxisTickLab,
      _ref5$legendProps = _ref5.legendProps,
      legendProps = _ref5$legendProps === void 0 ? {} : _ref5$legendProps,
      maxRowLegendItems = _ref5.maxRowLegendItems,
      trimLegend = _ref5.trimLegend,
      disableLegend = _ref5.disableLegend,
      typographyProps = _ref5.typographyProps,
      dash = _ref5.dash;
  var text_height = isNaN(typographyProps.fontSize) ? getTextSize('Typography', typographyProps) : typographyProps.fontSize; // we keep legend_height in case we want to separate the font size for chart and chart legend

  var legend_height = text_height;
  var maxLegendLabelWidth = getLabelMaxWidth(keys, typographyProps, function (x) {
    return x;
  });
  var legendItemCount = keys.length;

  var _setChartMargin = setChartMargin(width, height, useAxis, maxLegendLabelWidth, legendItemCount, maxYAxisTickLabelWidth, lastXAxisTickLabelWidth, maxRowLegendItems, trimLegend, disableLegend, text_height, legend_height),
      showLegend = _setChartMargin.showLegend,
      rightHandLegend = _setChartMargin.rightHandLegend,
      rightHandLegendAnchor = _setChartMargin.rightHandLegendAnchor,
      legendItemWidth = _setChartMargin.legendItemWidth,
      legendLabelContainerWidth = _setChartMargin.legendLabelContainerWidth,
      showBottomAxisLegendLabel = _setChartMargin.showBottomAxisLegendLabel,
      showLeftAxisLegendLabel = _setChartMargin.showLeftAxisLegendLabel,
      showBottomAxisTicks = _setChartMargin.showBottomAxisTicks,
      showLeftAxisTicks = _setChartMargin.showLeftAxisTicks,
      bottomAxisLegendOffset = _setChartMargin.bottomAxisLegendOffset,
      leftAxisLegendOffset = _setChartMargin.leftAxisLegendOffset,
      legendTranslate = _setChartMargin.legendTranslate,
      margin = (0, _objectWithoutProperties2.default)(_setChartMargin, ["showLegend", "rightHandLegend", "rightHandLegendAnchor", "legendItemWidth", "legendLabelContainerWidth", "showBottomAxisLegendLabel", "showLeftAxisLegendLabel", "showBottomAxisTicks", "showLeftAxisTicks", "bottomAxisLegendOffset", "leftAxisLegendOffset", "legendTranslate"]);

  var chartWidth = width - margin.right - margin.left;
  var aspectRatioProps = rightHandLegend ? {
    anchor: rightHandLegendAnchor,
    direction: 'column',
    // NOTE: itemWidth affects wrapper of legend, which gets the onClick listener
    itemWidth: legendItemWidth,
    translateX: legendTranslate + legendItemWidth,
    translateY: 0
  } : {
    anchor: 'bottom-left',
    direction: 'row',
    itemWidth: legendItemWidth,
    translateX: 0,
    translateY: legendTranslate
  };

  var symbolShape = function symbolShape(nivoProps) {
    return /*#__PURE__*/_react.default.createElement(_legendSymbol.default, (0, _extends2.default)({}, nivoProps, {
      trimLegendLabel: trimLegendLabel(legendLabelContainerWidth, typographyProps)
    }));
  };

  var legend = _objectSpread(_objectSpread(_objectSpread({
    id: 1,
    itemHeight: legend_height + _dimensions.BUFFER,
    symbolSize: _dimensions.SYMBOL_SIZE,
    symbolSpacing: _dimensions.SYMBOL_SPACING,
    symbolShape: symbolShape
  }, aspectRatioProps), legendProps), {}, {
    effects: [{
      on: 'hover',
      style: {
        itemTextColor: '#000',
        itemBackground: '#eee'
      }
    }],

    /* ====[NOTE]
      legend.data prop is overriden in Bar for BoxLegendSvg
      https://github.com/plouc/nivo/blob/259e037f52b0b4134dd2fa0abec221bcb9f939c1/packages/bar/src/Bar.js#L291
       and Scatter
      https://github.com/plouc/nivo/blob/259e037f52b0b4134dd2fa0abec221bcb9f939c1/packages/scatterplot/src/ScatterPlot.js#L82
       and Pie (but no layers[] override possible)
      https://github.com/plouc/nivo/blob/259e037f52b0b4134dd2fa0abec221bcb9f939c1/packages/pie/src/PieLegends.js#L15
    */
    onClick: legendOnClick,
    data: keys.map(function (key) {
      return {
        label: key,
        id: key,
        // ====[TODO] "off" value as a prop
        // ====[TODO] grey out text as well or just more obvious off state
        color: currentColorMap[key] || 'rgba(150, 150, 150, 0.5)'
      };
    })
  });

  return {
    margin: margin,
    axisBottom: _objectSpread({
      tickValues: axisBottomTickValues
    }, getCommonAxisProps(showBottomAxisLegendLabel, showBottomAxisTicks, axisBottomLegendLabel, bottomAxisLegendOffset, function (d) {
      return axisBottomTrim ? trimText(axisBottomLabelDisplayFn(d) + '', chartWidth / axisBottomLabelCount, typographyProps) : axisBottomLabelDisplayFn(d);
    })),
    axisLeft: _objectSpread({
      orient: 'left'
    }, getCommonAxisProps(showLeftAxisLegendLabel, showLeftAxisTicks, axisLeftLegendLabel, leftAxisLegendOffset, axisLeftLabelDisplayFn)),
    legends: showLegend ? [legend] : [],
    animate: true,
    motionStiffness: 90,
    motionDamping: 15,
    theme: {
      fontFamily: typographyProps.fontFamily,
      fontSize: typographyProps.fontSize,
      textColor: typographyProps.textColor,
      // axis definition needed to display on top of the grid lines
      axis: {
        domain: {
          line: {
            stroke: 'black'
          }
        }
      },
      grid: {
        line: {
          stroke: '#dbdbdb',
          strokeWidth: 1,
          strokeDasharray: dash ? '5 5' : '' // only for line

        }
      }
    }
  };
};

exports.getCommonProps = getCommonProps;
var AGGREGATE_FN = {
  sum: function sum(curr, val) {
    return (curr || 0) + val;
  },
  avg: function avg(curr, val) {
    return {
      sum: (curr ? curr.sum : 0) + val,
      count: (curr ? curr.count : 0) + 1
    };
  },
  max: function max(curr, val) {
    return Math.max(curr === undefined ? val : curr, val);
  },
  min: function min(curr, val) {
    return Math.min(curr === undefined ? val : curr, val);
  }
};

var aggregateReducer = function aggregateReducer(_ref6) {
  var indexBy = _ref6.indexBy,
      genIndexKeys = _ref6.genIndexKeys,
      genValueKey = _ref6.genValueKey,
      type = _ref6.type;
  return function (agg, ele) {
    return _objectSpread(_objectSpread({}, agg), {}, (0, _defineProperty2.default)({}, ele[indexBy], _objectSpread(_objectSpread((0, _defineProperty2.default)({}, indexBy, ele[indexBy]), agg[ele[indexBy]] || {}), genIndexKeys(ele).reduce(function (ret, key) {
      var curr = agg[ele[indexBy]] || {};
      ret[key] = AGGREGATE_FN[type](curr[key], ele[genValueKey(key)]);
      return ret;
    }, {}))));
  };
};

var avgMap = function avgMap(indexBy) {
  return function (ele) {
    return _objectSpread(_objectSpread({}, ele), Object.keys((0, _lodash.default)(ele, indexBy)).reduce(function (ret, key) {
      ret[key] = ele[key].sum / ele[key].count;
      return ret;
    }, {}));
  };
}; // aggregate data based on unique value of indexBy and [keys]
// or, use groupByKey to map data into { [ele[groupByKey]]: valueKey }


var aggregateData = function aggregateData(_ref7) {
  var indexBy = _ref7.indexBy,
      data = _ref7.data,
      keys = _ref7.keys,
      valueKey = _ref7.valueKey,
      _ref7$groupByKey = _ref7.groupByKey,
      groupByKey = _ref7$groupByKey === void 0 ? '' : _ref7$groupByKey,
      type = _ref7.type;

  var genIndexKeys = function genIndexKeys() {
    return keys;
  };

  var genValueKey = function genValueKey(key) {
    return key;
  };

  if (groupByKey.length) {
    genIndexKeys = function genIndexKeys(ele) {
      return [ele[groupByKey]];
    };

    genValueKey = function genValueKey() {
      return valueKey;
    };
  }

  var aggregation = Object.values(data.reduce(aggregateReducer({
    indexBy: indexBy,
    genIndexKeys: genIndexKeys,
    genValueKey: genValueKey,
    type: type
  }), {}));

  if (type === 'avg') {
    // { [indexBy]: id, [key]: { sum, count } }
    return aggregation.map(avgMap(indexBy));
  }

  return aggregation;
};

exports.aggregateData = aggregateData;

var processDataKeys = function processDataKeys(_ref8) {
  var _ref8$indexBy = _ref8.indexBy,
      indexBy = _ref8$indexBy === void 0 ? '' : _ref8$indexBy,
      _ref8$keys = _ref8.keys,
      keys = _ref8$keys === void 0 ? [] : _ref8$keys,
      _ref8$groupByKey = _ref8.groupByKey,
      groupByKey = _ref8$groupByKey === void 0 ? '' : _ref8$groupByKey,
      data = _ref8.data;
  var finalIndexBy;
  var finalKeys;
  finalIndexBy = indexBy.length ? indexBy : Object.keys(data[0])[0];

  if (!groupByKey.length) {
    // remove indexBy from keys
    finalKeys = keys.length ? keys : Object.keys((0, _lodash.default)(data[0], finalIndexBy));
  } else {
    // unique values of groupByKey
    finalKeys = Object.keys(data.reduce(function (agg, ele) {
      agg[ele[groupByKey]] = true;
      return agg;
    }, {}));
  }

  return {
    finalKeys: finalKeys,
    finalIndexBy: finalIndexBy
  };
}; // TODO: enforce validity of key combinations, e.g. providing no xKey and setting indexBy to keys[1]


exports.processDataKeys = processDataKeys;

var processSeriesDataKeys = function processSeriesDataKeys(_ref9) {
  var _ref9$indexBy = _ref9.indexBy,
      indexBy = _ref9$indexBy === void 0 ? '' : _ref9$indexBy,
      _ref9$xKey = _ref9.xKey,
      xKey = _ref9$xKey === void 0 ? '' : _ref9$xKey,
      _ref9$yKeys = _ref9.yKeys,
      yKeys = _ref9$yKeys === void 0 ? [] : _ref9$yKeys,
      data = _ref9.data,
      indexByValue = _ref9.indexByValue;
  var finalIndexBy;
  var finalXKey;
  var finalYKeys;
  var keys = Object.keys(data[0]);

  if (indexByValue) {
    // requries an indexBy and only 1 yKey
    finalIndexBy = indexBy.length ? indexBy : keys[0];
    finalXKey = xKey.length ? xKey : keys[1];
    finalYKeys = yKeys.length ? yKeys : [keys[2]];
  } else {
    // one xKey and use the rest as yKeys
    finalXKey = xKey.length ? xKey : keys[0];
    finalYKeys = yKeys.length ? yKeys : keys.slice(1);
  }

  return {
    finalIndexBy: finalIndexBy,
    finalXKey: finalXKey,
    finalYKeys: finalYKeys
  };
};

exports.processSeriesDataKeys = processSeriesDataKeys;

var processPieDataKeys = function processPieDataKeys(_ref10) {
  var data = _ref10.data,
      indexBy = _ref10.indexBy,
      dataKey = _ref10.dataKey;
  var keys = Object.keys(data[0]);
  var finalIndexBy = indexBy.length ? indexBy : keys[0];
  var finalDataKey = dataKey.length ? dataKey : keys[1];
  return {
    finalIndexBy: finalIndexBy,
    finalDataKey: finalDataKey
  };
};

exports.processPieDataKeys = processPieDataKeys;

var convertPieDataToNivo = function convertPieDataToNivo(_ref11) {
  var data = _ref11.data,
      indexBy = _ref11.indexBy,
      dataKey = _ref11.dataKey;
  var total = data.reduce(function (sum, row) {
    return sum + row[dataKey];
  }, 0);
  var finalData = data.map(function (o) {
    return {
      id: o[indexBy],
      label: o[indexBy],
      value: o[dataKey],
      percent: "".concat((o[dataKey] * 100 / total).toFixed(1), "%")
    };
  });
  return finalData;
}; // TODO: function for summing together values e.g. duplicate x/y combinations
// export const processUniqueData
// convert flat array { indexBy: 'value', ...rest }
// to grouped by unique indexBy value
// i.e. [{ id: 'value1', data: [{ ...rest }] }]


exports.convertPieDataToNivo = convertPieDataToNivo;

var convertDataToNivoByValue = function convertDataToNivoByValue(_ref12) {
  var data = _ref12.data,
      xKey = _ref12.xKey,
      yKey = _ref12.yKey,
      indexBy = _ref12.indexBy;
  return Object.values(data.reduce(function (ret, ele) {
    var id = ele[indexBy];

    if (!ret[id]) {
      ret[id] = {
        id: id,
        data: []
      };
    }

    ret[id].data.push({
      x: ele[xKey],
      y: ele[yKey]
    });
    return ret;
  }, {}));
}; // convert flat array { yKey1: value, yKey2: value, ...rest }
// to grouped by unique yKeys
// i.e. [{ id: yKey1, data: [] }, { id: yKey2, data: [] }]


var convertDataToNivoByKeys = function convertDataToNivoByKeys(_ref13) {
  var data = _ref13.data,
      xKey = _ref13.xKey,
      yKeys = _ref13.yKeys;
  return Object.values(data.reduce(function (ret, ele) {
    // generate an entry for each yKey
    yKeys.forEach(function (yKey) {
      var id = yKey;

      if (!ret[id]) {
        ret[id] = {
          id: id,
          data: []
        };
      }

      ret[id].data.push({
        x: ele[xKey],
        y: ele[yKey]
      });
    });
    return ret;
  }, {}));
};

var convertDataToNivo = function convertDataToNivo(_ref14) {
  var data = _ref14.data,
      xKey = _ref14.xKey,
      yKeys = _ref14.yKeys,
      indexBy = _ref14.indexBy,
      indexByValue = _ref14.indexByValue;
  if (indexByValue) return convertDataToNivoByValue({
    data: data,
    xKey: xKey,
    yKey: yKeys[0],
    indexBy: indexBy
  });
  return convertDataToNivoByKeys({
    data: data,
    xKey: xKey,
    yKeys: yKeys
  });
};

exports.convertDataToNivo = convertDataToNivo;
var COLOR_METHODS = {
  'random': function random(num) {
    var colors = Object.values(_designSystemColors.default);
    return new Array(num).fill(0).map(function () {
      return colors[Math.floor(Math.random() * colors.length)];
    });
  },
  'monochromatic': function monochromatic(num) {
    var hue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'blue';
    // return all values for keys that have `${hue}xx`
    // repeat if necessary
    var finalHue = _designSystemColors.hues.includes(hue) ? hue : 'blue';
    var colors = Object.keys(_designSystemColors.default).filter(function (o) {
      return o.indexOf(finalHue) >= 0;
    });
    return new Array(num).fill(0).map(function (_, i) {
      return _designSystemColors.default[colors[i % colors.length]];
    });
  },
  'palette': function palette(num) {
    var lightness = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
    // return all values for keys that have `hue${lightness}`
    // repeat if necessary
    var finalLightness = _designSystemColors.lightnesses.includes(parseInt(lightness)) ? lightness : 30;
    var colors = Object.keys(_designSystemColors.default).filter(function (o) {
      return o.indexOf(finalLightness) >= 0;
    });
    return new Array(num).fill(0).map(function (_, i) {
      return _designSystemColors.default[colors[i % colors.length]];
    });
  }
};

var processColors = function processColors(numberOfColors, type, param) {
  var finalType = type;

  if (!COLOR_METHODS[type]) {
    finalType = 'palette';
  }

  return COLOR_METHODS[finalType](numberOfColors, param);
}; // enforce and order for string axis (Bar or xScale.type === 'point')
// Nivo uses the order of keys in data, so we have to sort


exports.processColors = processColors;

var processAxisOrder = function processAxisOrder(_ref15) {
  var data = _ref15.data,
      axisBottomOrder = _ref15.axisBottomOrder,
      finalIndexBy = _ref15.finalIndexBy,
      valueKey = _ref15.valueKey;
  if (!axisBottomOrder.length) return data;

  if (Array.isArray(axisBottomOrder)) {
    return axisBottomOrder.map(function (label) {
      return data.find(function (row) {
        return row[valueKey || finalIndexBy] === label;
      });
    });
  }

  var dir = axisBottomOrder === 'asc' ? 1 : -1;
  return (0, _toConsumableArray2.default)(data).sort(function (a, b) {
    if (a[valueKey || finalIndexBy] < b[valueKey || finalIndexBy]) {
      return -1 * dir;
    } else if (a[valueKey || finalIndexBy] > b[valueKey || finalIndexBy]) {
      return 1 * dir;
    }

    return 0;
  });
}; // data structure of "Nivo" { id, data } requires different sorting


exports.processAxisOrder = processAxisOrder;

var processAxisOrderNivo = function processAxisOrderNivo(_ref16) {
  var unsortedData = _ref16.unsortedData,
      axisBottomOrder = _ref16.axisBottomOrder;
  return unsortedData.map(function (_ref17) {
    var data = _ref17.data,
        id = _ref17.id;
    return {
      id: id,
      data: processAxisOrder({
        data: data,
        axisBottomOrder: axisBottomOrder,
        valueKey: 'x'
      })
    };
  });
};

exports.processAxisOrderNivo = processAxisOrderNivo;