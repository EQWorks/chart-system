import PropTypes from 'prop-types'


export const chartPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  colors: PropTypes.array,
  colorType: PropTypes.string, // TODO oneOf(['random', 'palette', 'monochromatic'])
  colorParam: PropTypes.string, // whatever value matches the requirement of colorType, currently the hue (mono) or lightness (palette)
  axisBottomLegendLabel: PropTypes.string,
  axisLeftLegendLabel: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export const chartDefaultProps = {
  colors: [],
  colorType: 'palette',
  colorParam: '70',
  axisBottomLegendLabel: '',
  axisLeftLegendLabel: '',
  width: 100,
  height: 100,
}
