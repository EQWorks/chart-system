import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import withDataFrame from '../shared/with-dataframe'
import ResponsivePlot from '../shared/responsive-plot'

const Line = ({
  df,
  keys,
  keysAgg,
  indexBy,
  x,
  spline,
  showTicks,
}) => {

  const lineConfig = useCallback((trace) => {
    trace.line = {
      shape: spline ? 'spline' : 'linear',
    }
    return trace
  }, [spline])

  const finalData = useMemo(() => {
    const grouped = indexBy ? df.groupby([indexBy]) : null
    const aggregated = indexBy ? grouped.agg(Object.fromEntries(keys.map((k, i) => [k, keysAgg && keysAgg[i] ? keysAgg[i] : 'sum']))) : null
    return keys.map((k, i) => {
      const op = keysAgg[i]
      let result = {}
      if (indexBy) {
        result.x = aggregated[indexBy].values
        if (op) {
          result.name = `${k} (${op})`
          result.y = aggregated[`${k}_${op}`].values
        }
      }
      else {
        df.sort_values({ by: x, inplace: true })
        result.name = k
        result.x = df[x].values
        result.y = df[k].values
      }
      return lineConfig(result)
    })
  }, [df, indexBy, keys, keysAgg, lineConfig, x])

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
    />
  )
}

Line.propTypes = {
  df: PropTypes.object.isRequired,
  indexBy: PropTypes.string,
  x: PropTypes.string.isRequired,
  keys: PropTypes.array.isRequired,
  keysAgg: PropTypes.array,
  spline: PropTypes.bool,
  showTicks: PropTypes.bool,
}

Line.defaultProps = {
  keysAgg: {},
  spline: false,
  showTicks: true,
}

export default withDataFrame(Line)
