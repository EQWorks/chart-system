import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import withDataFrame from '../shared/with-dataframe'
import ResponsivePlot from '../shared/responsive-plot'

const Scatter = ({
  df,
  keys,
  keysAgg,
  indexBy,
  x,
  showTicks,
}) => {

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
      return result
    })
  }, [df, indexBy, keys, keysAgg, x])

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
      mode='markers'
      layout={layout}
      data={finalData}
    />
  )
}

Scatter.propTypes = {
  df: PropTypes.object.isRequired,
  indexBy: PropTypes.string,
  x: PropTypes.string.isRequired,
  keys: PropTypes.array.isRequired,
  keysAgg: PropTypes.array,
  showTicks: PropTypes.bool,
}

Scatter.defaultProps = {
  keysAgg: {},
  showTicks: true,
}

export default withDataFrame(Scatter)
