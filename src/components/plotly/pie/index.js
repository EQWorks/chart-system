import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'


const Pie = ({
  groupByValue,
  data,
  label,
  values,
  groupByValue,
  donut,
  showLegend,
  showPercentage,
  ...props
}) => {
  const finalData = useMemo(() => (
    groupByValue
      ? data.map(d => {
        const _d = { ...d }
        const name = _d[label]
        delete _d[label]
        return {
          name,
          labels: Object.keys(_d),
          values: Object.values(_d),
          textinfo: showPercentage ? 'values' : 'none',
          hole: donut ? 0.4 : 0,
        }
      })
      : values.map(k => (
        {
          name: titles[k],
          labels: data.map(d => d[label]),
          values: data.map(d => d[k]),
          textinfo: showPercentage ? 'values' : 'none',
          hole: donut ? 0.4 : 0,
        }
      ))
  ), [data, donut, groupByValue, label, showPercentage, values, titles])

  const layout = useMemo(() => ({
    showlegend: showLegend,
    legend: {
      x: 1,
      y: 0.5,
    },
  }), [showLegend])

  return (
    <CustomPlot
      type='pie'
      data={finalData}
      layout={layout}
      colorsNeeded={values.length}
      {...props}
    />
  )
}

Pie.propTypes = {
  label: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  donut: PropTypes.bool,
  showPercentage: PropTypes.bool,
  ...plotlyPropTypes,
}

Pie.defaultProps = {
  donut: false,
  showPercentage: true,
  ...plotlyDefaultProps,
}

export default Pie
