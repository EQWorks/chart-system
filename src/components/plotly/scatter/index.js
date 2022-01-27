import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const Scatter = ({
  data,
  showTicks,
  showLines,
  ...props
}) => (
  <CustomPlot
    type='scatter'
    data={
      useTransformedData({
        type: 'scatter',
        data,
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
      },
      yaxis: {
        showticklabels: showTicks,
        automargin: true,
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
  ...plotlyPropTypes,
}

Scatter.defaultProps = {
  showTicks: true,
  ...plotlyDefaultProps,
}

export default Scatter
