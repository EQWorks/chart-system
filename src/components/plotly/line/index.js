import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { PlotlyPropDefaults, PlotlyPropTypes } from '../shared/constants'
import ResponsivePlot from '../shared/responsive-plot'

const Line = ({
  data,
  x,
  y,
  spline,
  showTicks,
  ...props
}) => {

  const finalData = useMemo(() => y.map(k => (
    {
      name: k,
      x: data.map(d => d[x]),
      y: data.map(d => d[k]),
      line: {
        shape: spline ? 'spline' : 'linear',
      },
    }
  )), [data, spline, x, y])

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
    <ResponsivePlot
      type='line'
      layout={layout}
      data={finalData}
      {...props}
    />
  )
}

Line.propTypes = {
  spline: PropTypes.bool,
  showTicks: PropTypes.bool,
  ...PlotlyPropTypes,
}

Line.defaultProps = {
  spline: false,
  showTicks: true,
  ...PlotlyPropDefaults,
}

export default Line