import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { PlotlyPropTypes } from '../shared/constants'
import ResponsivePlot from '../shared/responsive-plot'


const Pie = ({
  data,
  label,
  values,
  donut,
  showLegend,
  showPercentage,
  ...props
}) => {
  const finalData = useMemo(() => values.map(k => (
    {
      name: k,
      labels: data.map(d => d[label]),
      values: data.map(d => d[k]),
      textinfo: showPercentage ? 'values' : 'none',
      hole: donut ? 0.4 : 0,
    }
  )), [data, donut, label, showPercentage, values])

  const layout = useMemo(() => ({
    showlegend: showLegend,
    legend: {
      x: 1,
      y: 0.5,
    },
  }), [showLegend])

  return (
    <ResponsivePlot
      type='pie'
      data={finalData}
      layout={layout}
      {...props}
    />
  )
}

Pie.propTypes = {
  label: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  donut: PropTypes.bool,
  showPercentage: PropTypes.bool,
  showLegend: PropTypes.bool,
  ...PlotlyPropTypes,
}

Pie.defaultProps = {
  donut: false,
  showPercentage: true,
  showLegend: true,
}

export default Pie
