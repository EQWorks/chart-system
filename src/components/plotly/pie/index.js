import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'

const Pie = ({
  donut,
  data,
  showPercentage,
  ...props
}) => (
  <CustomPlot
    type='pie'
    data={useTransformedData({
      type: 'pie',
      data,
      extra: {
        textinfo: showPercentage ? 'percent' : 'none',
        hole: donut ? 0.4 : 0,
      },
      ...props,
    })}
    {...props}
  />
)

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
