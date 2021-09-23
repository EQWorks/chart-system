import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import { PlotlyPropDefaults, PlotlyPropTypes } from '../shared/constants'
import ResponsivePlot from '../shared/responsive-plot'

const Pie = ({
  data,
  donut,
  showPercentage,
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

  return (
    <ResponsivePlot
      type='pie'
      data={finalData}
    />
  )
}

Pie.propTypes = {
  donut: PropTypes.bool,
  showPercentage: PropTypes.bool,
  ...PlotlyPropTypes,
}

Pie.defaultProps = {
  donut: false,
  showPercentage: true,
  ...PlotlyPropDefaults,
}

export default Pie
