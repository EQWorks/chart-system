import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { PlotlyPropTypes } from '../shared/constants'
import ResponsivePlot from '../shared/responsive-plot'


const Bar = ({
  data,
  x,
  y,
  stacked,
  showTicks,
  ...props
}) => {
  const finalData = useMemo(() => y.map(k => (
    {
      name: k,
      x: data.map(d => d[x]),
      y: data.map(d => d[k]),
    }
  )), [data, x, y])

  const layout = useMemo(() => ({
    barmode: stacked ? 'stack' : 'group',
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
  }), [showTicks, stacked])

  return (
    <ResponsivePlot
      type='bar'
      data={finalData}
      showTicks={showTicks}
      layout={layout}
      {...props}
    />
  )
}

Bar.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  stacked: PropTypes.bool,
  showTicks: PropTypes.bool,
  ...PlotlyPropTypes,
}

Bar.defaultProps = {
  stacked: false,
  showTicks: true,
}

export default Bar
