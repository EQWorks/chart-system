import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import { PlotlyPropDefaults, PlotlyPropTypes } from '../shared/constants'
import ResponsivePlot from '../shared/responsive-plot'

const Line = ({
  data,
  spline,
  showTicks,
  ...props
}) => {

  const configDatum = useCallback((datum) => {
    datum.line = {
      shape: spline ? 'spline' : 'linear',
    }
    return datum
  }, [spline])

  const finalData = useMemo(() => data.map(d => configDatum(d)), [data, configDatum])

  const layout = useMemo(() => ({
    xaxis: {
      showticklabels: showTicks,
    },
    yaxis: {
      showticklabels: showTicks,
    },
    // margin: {
    //   t: 0,
    //   b: 0,
    //   l: 0,
    //   r: 0,
    // },
    // ...!showTicks && {
    //   margin: {
    //     t: 0,
    //     b: 0,
    //     l: 0,
    //     r: 0,
    //   },
    // },
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
