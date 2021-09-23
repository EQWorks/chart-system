import PropTypes from 'prop-types'

export const PlotlyPropTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    x: PropTypes.array.isRequired,
    y: PropTypes.array.isRequired,
  })).isRequired,
}

export const PlotlyPropDefaults = {
  data: [],
}
