import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { PlotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'


const Scatter = ({
  data,
  x,
  y,
  showTicks,
  showLines,
  ...props
}) => {
  const finalData = useMemo(() => y.map(k => (
    {
      name: k,
      x: data.map(d => d[x]),
      y: data.map(d => d[k]),
      mode: showLines ? 'lines+markers' : 'markers',
    }
  )), [data, showLines, x, y])

  const layout = useMemo(() => ({
    xaxis: {
      showticklabels: showTicks,
    },
    yaxis: {
      showticklabels: showTicks,
    },
    ...!showTicks && {
      margin: {
        t: 0,
        b: 0,
        l: 0,
        r: 0,
      },
    },
  }), [showTicks])

  return (
    <CustomPlot
      type='scatter'
      layout={layout}
      data={finalData}
      colorsNeeded={y.length}
      {...props}
    />
  )
}

Scatter.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  showTicks: PropTypes.bool,
  ...PlotlyPropTypes,
}

Scatter.defaultProps = {
  showTicks: true,
}

export default Scatter
