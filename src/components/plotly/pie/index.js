import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import withDataFrame from '../shared/with-dataframe'
import ResponsivePlot from '../shared/responsive-plot'

const Pie = ({
  df,
  keys,
  keysAgg,
  indexBy,
  donut,
  showPercentage,
}) => {

  const traceConfig = useCallback((trace) => {
    trace.textinfo = showPercentage ? 'values' : 'none'
    trace.hole = donut ? 0.4 : 0
    return trace
  }, [donut, showPercentage])

  const finalData = useMemo(() => {
    const grouped = indexBy ? df.groupby([indexBy]) : null
    const aggregated = indexBy ? grouped.agg(Object.fromEntries(keys.map((k, i) => [k, keysAgg && keysAgg[i] ? keysAgg[i] : 'sum']))) : null
    return keys.map((k, i) => {
      const op = keysAgg[i]
      let result = {}
      result.labels = aggregated[indexBy].values
      if (op) {
        result.name = `${k} (${op})`
        result.values = aggregated[`${k}_${op}`].values
      }
      return traceConfig(result)
    })
  }, [df, indexBy, keys, keysAgg, traceConfig])

  return (
    <ResponsivePlot
      type='pie'
      data={finalData}
    />
  )
}

Pie.propTypes = {
  df: PropTypes.object.isRequired,
  indexBy: PropTypes.string,
  keys: PropTypes.array.isRequired,
  keysAgg: PropTypes.array,
  donut: PropTypes.bool,
  showPercentage: PropTypes.bool,
}

Pie.defaultProps = {
  keysAgg: {},
  donut: false,
  showPercentage: true,
}

export default withDataFrame(Pie)
