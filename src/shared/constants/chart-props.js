import PropTypes from 'prop-types'


export const chartPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  keys: PropTypes.array, // TODO not used outside of bar
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
  axisLeftLegendLabel: PropTypes.string,
  axisLeftLabelDisplayFn: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
}

export const chartDefaultProps = {
  keys: [],
  indexBy: '',
  colors: [],
  colorType: 'palette',
  colorParam: '70',
  axisBottomLegendLabel: '',
  axisBottomTrim: true,
  axisBottomLabelDisplayFn: d => d,
  axisBottomOrder: [],
  axisLeftLegendLabel: '',
  axisLeftLabelDisplayFn: d => d,
  width: 100,
  height: 100,
}

export const seriesPropTypes = {
  xKey: PropTypes.string,
  yKey: PropTypes.string,
}

export const seriesDefaultProps = {
  xKey: '',
  yKey: '',
}
