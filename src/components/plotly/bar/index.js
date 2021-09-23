import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { PlotlyPropDefaults, PlotlyPropTypes } from '../shared/constants'
import ResponsivePlot from '../shared/responsive-plot'

const Bar = ({
  data,
  stacked,
  showTicks,
}) => {

  const layout = useMemo(() => ({
    barmode: stacked ? 'stacked' : 'group',
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
      showTicks={showTicks}
      data={data}
      layout={layout}
    />
  )
}

Bar.propTypes = {
  stacked: PropTypes.bool,
  showTicks: PropTypes.bool,
  ...PlotlyPropTypes,
}

Bar.defaultProps = {
  stacked: false,
  showTicks: true,
  ...PlotlyPropDefaults,
}

export default Bar
