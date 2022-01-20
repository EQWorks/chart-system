import PropTypes from 'prop-types'

export const plotlyPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  titles: PropTypes.arrayOf(PropTypes.string),
  groupByValue: PropTypes.bool,
  showLegend: PropTypes.bool,
}

export const plotlyDefaultProps = {
  titles: [],
  groupByValue: false,
  showLegend: true,
}
