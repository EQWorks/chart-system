import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'


const Bar = ({
  data,
  x,
  y,
  titles,
  stacked,
  showTicks,
  ...props
}) => {
  const finalData = useMemo(() => y.map(k => (
    {
      name: titles[k],
      x: data.map(d => d[x]),
      y: data.map(d => d[k]),
    }
  )), [titles, data, x, y])

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
    <CustomPlot
      type='bar'
      data={finalData}
      showTicks={showTicks}
      layout={layout}
      colorsNeeded={y.length}
      {...props}
    />
  )
}

Bar.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  stacked: PropTypes.bool,
  showTicks: PropTypes.bool,
  ...plotlyPropTypes,
}

Bar.defaultProps = {
  stacked: false,
  showTicks: true,
  ...plotlyDefaultProps,
}

export default Bar
