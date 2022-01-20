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

export const plotlyInterfaces = {
  pie: {
    domain: {
      input: 'label',
      output: 'labels',
    },
    range: {
      input: 'values',
      output: 'values',
    },
  },
  bar: {
    domain: {
      input: 'x',
      output: 'x',
    },
    range: {
      input: 'y',
      output: 'y',
    },
  },
  line: {
    domain: {
      input: 'x',
      output: 'x',
    },
    range: {
      input: 'y',
      output: 'y',
    },
  },
  scatter: {
    domain: {
      input: 'x',
      output: 'x',
    },
    range: {
      input: 'y',
      output: 'y',
    },
  },
}
