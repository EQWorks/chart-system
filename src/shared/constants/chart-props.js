import PropTypes from 'prop-types'


export const chartPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  keys: PropTypes.array,
  indexBy: PropTypes.string,
  colors: PropTypes.array,
  colorType: PropTypes.string, // TODO oneOf(['random', 'palette', 'monochromatic'])
  colorParam: PropTypes.string, // whatever value matches the requirement of colorType, currently the hue (mono) or lightness (palette)
  axisBottomLegendLabel: PropTypes.string,
  axisBottomTrim: PropTypes.bool,
  axisBottomLabelDisplayFn: PropTypes.func,
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
