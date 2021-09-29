import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import { PlotlyPropDefaults, PlotlyPropTypes } from '../shared/constants'
import ResponsivePlot from '../shared/responsive-plot'

const Pie = ({
  data,
  donut,
  showLegend,
  showPercentage,
  ...props
}) => {

  const formatDatum = ({ x, y, ...rest }) => ({
    labels: x,
    values: y,
    ...rest,
  })

  const configDatum = useCallback((datum) => {
    datum.textinfo = showPercentage ? 'values' : 'none'
    datum.hole = donut ? 0.4 : 0
    return datum
  }, [donut, showPercentage])

  const finalData = useMemo(() => data.map(d => configDatum(formatDatum(d))), [data, configDatum])

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
  donut: PropTypes.bool,
  showPercentage: PropTypes.bool,
  showLegend: PropTypes.bool,
  ...PlotlyPropTypes,
}

Pie.defaultProps = {
  donut: false,
  showPercentage: true,
  showLegend: true,
  ...PlotlyPropDefaults,
}

export default Pie
