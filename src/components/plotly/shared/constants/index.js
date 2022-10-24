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
    getLegendKeys: data => data[0]['labels'],
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
    getLegendKeys: data => data.map(({ name }) => name),
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
    getLegendKeys: data => data.map(({ name }) => name),
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
    getLegendKeys: data => data.map(({ name }) => name),
  },
  barline: {
    domain: {
      input: 'x',
      output: 'x',
    },
    range: {
      input: 'y',
      output: 'y',
    },
    getLegendKeys: data => data.map(({ name }) => name),
  },
  doubleLine: {
    domain: {
      input: 'x',
      output: 'x',
    },
    range: {
      input: 'y',
      output: 'y',
    },
    getLegendKeys: data => data.map(({ name }) => name),
  },
}

export const PLOTLY_BASE_LAYOUT = {
  showlegend: false,
  autosize: true,
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  modebar: {
    bgcolor: 'transparent',
    color: 'black',
    activecolor: 'black',
  },
  margin: {
    t: 0,
    b: 0,
    l: 0,
    r: 0,
  },
  xaxis: { fixedrange: true },
  yaxis: { fixedrange: true },
}

export const PLOTLY_HOVERINFO_PERCENTAGE = {
  pie: 'label+percent',
  bar: '',
  line: 'x+text+name',
  scatter: 'x+text+name',
}
