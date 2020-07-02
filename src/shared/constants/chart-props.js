import PropTypes from 'prop-types'


export const chartPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  indexBy: PropTypes.string,
  colors: PropTypes.array,
  colorType: PropTypes.string, // TODO oneOf(['random', 'palette', 'monochromatic'])
  colorParam: PropTypes.string, // value to configure the colorType, currently the hue (mono) or lightness (palette)
  axisBottomLegendLabel: PropTypes.string,
  axisBottomTrim: PropTypes.bool,
  axisBottomLabelDisplayFn: PropTypes.func,
  axisBottomOrder: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.oneOf(['asc', 'desc']),
  ]),
  axisBottomLabelValues: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
  ]),
  axisLeftLegendLabel: PropTypes.string,
  axisLeftLabelDisplayFn: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
}

export const chartDefaultProps = {
  indexBy: '',
  colors: [],
  colorType: 'palette',
  colorParam: '70',
  axisBottomLegendLabel: '',
  axisBottomTrim: true,
  axisBottomLabelDisplayFn: d => d,
  axisBottomOrder: [],
  axisBottomLabelValues: undefined,
  axisLeftLegendLabel: '',
  axisLeftLabelDisplayFn: d => d,
  width: 100,
  height: 100,
}

export const seriesPropTypes = {
  indexByValue: PropTypes.bool,
  xKey: PropTypes.string,
  xScale: PropTypes.object,
  yScale: PropTypes.object,
  yKeys: PropTypes.array,
}

export const seriesDefaultProps = {
  indexByValue: true,
  xKey: '',
  xScale: {},
  yScale: {},
  yKeys: [],
}

export const barChartPropTypes = {
  keys: PropTypes.array,
  groupByKey: PropTypes.string,
  valueKey: PropTypes.string,
}

export const barChartDefaultProps = {
  keys: [],
  groupByKey: '',
  valueKey: '',
}
