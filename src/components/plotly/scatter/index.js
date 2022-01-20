import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'


const Scatter = ({
  data,
  x,
  y,
  groupByValue,
  showTicks,
  showLines,
  ...props
}) => {
  const finalData = useMemo(() => y.map(k => (
    {
      name: titles[k],
      x: data.map(d => d[x]),
      y: data.map(d => d[k]),
      mode: showLines ? 'lines+markers' : 'markers',
    }
  )), [data, showLines, titles, x, y])

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
  ...plotlyPropTypes,
}

Scatter.defaultProps = {
  showTicks: true,
  ...plotlyDefaultProps,
}

export default Scatter
