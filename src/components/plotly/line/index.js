import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'


const Line = ({
  data,
  x,
  y,
  groupByValue,
  spline,
  showTicks,
  ...props
}) => {
  const finalData = useMemo(() => y.map(k => (
    {
      x: data.map(d => d[x]),
      y: data.map(d => d[k]),
      name: titles[k],
      line: {
        shape: spline ? 'spline' : 'linear',
      },
    }
  )), [data, spline, titles, x, y])

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
      type='line'
      layout={layout}
      data={finalData}
      colorsNeeded={y.length}
      {...props}
    />
  )
}

Line.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  spline: PropTypes.bool,
  showTicks: PropTypes.bool,
  ...plotlyPropTypes,
}

Line.defaultProps = {
  spline: false,
  showTicks: true,
  ...plotlyDefaultProps,
}

export default Line
