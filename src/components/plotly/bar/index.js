import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import withDataFrame from '../shared/with-dataframe'
import ResponsivePlot from '../shared/responsive-plot'

const Bar = ({
  df,
  keys,
  keysAgg,
  indexBy,
  stacked,
  showTicks,
}) => {

  const finalData = useMemo(() => {
    const grouped = df.groupby([indexBy])
    const aggregated = grouped.agg(Object.fromEntries(keys.map((k, i) => [k, keysAgg && keysAgg[i] ? keysAgg[i] : 'sum'])))
    return keys.map((k, i) => {
      const op = keysAgg && keysAgg[i] ? keysAgg[i] : 'sum'
      return {
        name: `${k} (${op})`,
        x: aggregated[indexBy].values,
        y: aggregated[`${k}_${op}`].values,
      }
    })
  }, [keysAgg, df, indexBy, keys])

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
      data={finalData}
      layout={layout}
    />
  )
}

Bar.propTypes = {
  df: PropTypes.object.isRequired,
  indexBy: PropTypes.string.isRequired,
  keys: PropTypes.array.isRequired,
  keysAgg: PropTypes.array,
  stacked: PropTypes.bool,
  showTicks: PropTypes.bool,
}

Bar.defaultProps = {
  stacked: false,
  showTicks: true,
}

export default withDataFrame(Bar)
