import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const Scatter = ({
  data,
  showTicks,
  showLines,
  showAxisTitles,
  x,
  y,
  ...props
}) => (
  <CustomPlot
    type='scatter'
    data={
      useTransformedData({
        type: 'scatter',
        data,
        x,
        y,
        extra: {
          mode: showLines ? 'lines+markers' : 'markers',
        },
        ...props,
      })
    }
    layout={{
      xaxis: {
        showticklabels: showTicks,
        automargin: true,
        ...(showAxisTitles && {
          title: {
            text: x,
            standoff: 20,
          },
        }),
      },
      yaxis: {
        showticklabels: showTicks,
        automargin: true,
        ...(showAxisTitles && y?.length === 1 && {
          title: {
            text: y[0],
            standoff: 30,
          },
        }),
      },
      ...!showTicks && {
        margin: {
          t: 0,
          b: 0,
          l: 0,
          r: 0,
        },
      },
    }}
    {...props}
  />
)

Scatter.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  showTicks: PropTypes.bool,
  showAxisTitles: PropTypes.bool,
  ...plotlyPropTypes,
}

Scatter.defaultProps = {
  showTicks: true,
  showAxisTitles: true,
  ...plotlyDefaultProps,
}

export default Scatter
