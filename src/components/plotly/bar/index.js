import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const Bar = ({
  data,
  stacked,
  showTicks,
  ...props
}) => (
  <CustomPlot
    type='bar'
    data={
      useTransformedData({
        type: 'bar',
        data,
        ...props,
      })
    }
    layout={{
      barmode: stacked ? 'stack' : 'group',
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

Bar.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  stacked: PropTypes.bool,
  showTicks: PropTypes.bool,
  ...plotlyPropTypes,
}

Bar.defaultProps = {
  stacked: false,
  showTicks: true,
  ...plotlyDefaultProps,
}

export default Bar
