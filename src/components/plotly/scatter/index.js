import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import { PlotlyPropDefaults, PlotlyPropTypes } from '../shared/constants'
import ResponsivePlot from '../shared/responsive-plot'

const Scatter = ({
  data,
  showTicks,
  ...props
}) => {

  const configDatum = useCallback((datum) => {
    datum.mode = 'markers'
    return datum
  }, [])

  const finalData = useMemo(() => data.map(d => configDatum(d)), [data, configDatum])

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
      type='scatter'
      layout={layout}
      data={finalData}
      {...props}
    />
  )
}

Scatter.propTypes = {
  showTicks: PropTypes.bool,
  ...PlotlyPropTypes,
}

Scatter.defaultProps = {
  showTicks: true,
  ...PlotlyPropDefaults,
}

export default Scatter
