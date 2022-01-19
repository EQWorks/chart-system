import PropTypes from 'prop-types'

export const plotlyPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  titles: PropTypes.arrayOf(PropTypes.string),
  showLegend: PropTypes.bool,
}

export const plotlyDefaultProps = {
  titles: [],
  showLegend: true,
}
