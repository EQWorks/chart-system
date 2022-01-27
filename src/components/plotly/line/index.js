import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const Line = ({
  data,
  spline,
  showTicks,
  ...props
}) => (
  <CustomPlot
    type='line'
    data={
      useTransformedData({
        type: 'line',
        data,
        extra: {
          line: {
            shape: spline ? 'spline' : 'linear',
          },
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
    }}
    {...props}
  />
)

Line.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  spline: PropTypes.bool,
  showTicks: PropTypes.bool,
  ...plotlyPropTypes,
}

Line.defaultProps = {
  spline: false,
  showTicks: true,
  ...plotlyDefaultProps,
}

export default Line
