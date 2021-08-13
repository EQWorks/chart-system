"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typographyDefaultProps = exports.typographyPropTypes = exports.barChartDefaultProps = exports.barChartPropTypes = exports.seriesDefaultProps = exports.seriesPropTypes = exports.chartDefaultProps = exports.chartPropTypes = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dimensions = require("./dimensions");

var chartPropTypes = {
  data: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
  indexBy: _propTypes.default.string,
  colors: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.func]),
  colorType: _propTypes.default.string,
  // TODO oneOf(['random', 'palette', 'monochromatic'])
  colorParam: _propTypes.default.string,
  // value to configure the colorType, currently the hue (mono) or lightness (palette)
  axisBottomLegendLabel: _propTypes.default.string,
  axisBottomTrim: _propTypes.default.bool,
  axisBottomLabelDisplayFn: _propTypes.default.func,
  axisBottomOrder: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.oneOf(['asc', 'desc'])]),
  axisBottomLabelValues: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.number, _propTypes.default.string, _propTypes.default.object //for time
  ]),
  axisLeftLegendLabel: _propTypes.default.string,
  axisLeftLabelDisplayFn: _propTypes.default.func,
  width: _propTypes.default.number,
  height: _propTypes.default.number,
  maxRowLegendItems: _propTypes.default.number,
  trimLegend: _propTypes.default.bool,
  disableLegend: _propTypes.default.bool,
  tooltipFormat: _propTypes.default.func,
  tooltipFormatX: _propTypes.default.func,
  disableTooltipTitle: _propTypes.default.bool
};
exports.chartPropTypes = chartPropTypes;
var chartDefaultProps = {
  indexBy: '',
  colors: [],
  colorType: 'palette',
  colorParam: '70',
  axisBottomLegendLabel: '',
  axisBottomTrim: true,
  axisBottomLabelDisplayFn: function axisBottomLabelDisplayFn(d) {
    return d;
  },
  axisBottomOrder: [],
  axisBottomLabelValues: undefined,
  axisLeftLegendLabel: '',
  axisLeftLabelDisplayFn: function axisLeftLabelDisplayFn(d) {
    return d;
  },
  width: 100,
  height: 100,
  maxRowLegendItems: _dimensions.MAX_LEGEND_ITEMS_ROW,
  trimLegend: true,
  disableLegend: false,
  tooltipFormat: function tooltipFormat(v) {
    return v;
  },
  tooltipFormatX: function tooltipFormatX(v) {
    return v;
  },
  disableTooltipTitle: false
};
exports.chartDefaultProps = chartDefaultProps;
var seriesPropTypes = {
  indexByValue: _propTypes.default.bool,
  xKey: _propTypes.default.string,
  xScale: _propTypes.default.object,
  yScale: _propTypes.default.object,
  yKeys: _propTypes.default.array
};
exports.seriesPropTypes = seriesPropTypes;
var seriesDefaultProps = {
  indexByValue: true,
  xKey: '',
  xScale: {},
  yScale: {},
  yKeys: []
};
exports.seriesDefaultProps = seriesDefaultProps;
var barChartPropTypes = {
  keys: _propTypes.default.array,
  groupByKey: _propTypes.default.string,
  valueKey: _propTypes.default.string
};
exports.barChartPropTypes = barChartPropTypes;
var barChartDefaultProps = {
  keys: [],
  groupByKey: '',
  valueKey: ''
};
exports.barChartDefaultProps = barChartDefaultProps;
var typographyPropTypes = {
  typographyProps: _propTypes.default.shape({
    fontFamily: _propTypes.default.string.isRequired,
    fontSize: _propTypes.default.number.isRequired,
    textColor: _propTypes.default.string.isRequired
  })
};
exports.typographyPropTypes = typographyPropTypes;
var typographyDefaultProps = {
  typographyProps: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: 12,
    textColor: 'black'
  }
};
exports.typographyDefaultProps = typographyDefaultProps;