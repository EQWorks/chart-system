import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'

const getTextInfo = ({ showPercentage, showLabelName }) => {
  if (showPercentage) {
    return showLabelName ? 'label+percent' : 'percent'
  }
  return 'none'
}

const Pie = ({
  donut,
  data,
  showPercentage,
  showLabelName,
  textinfo,
  hole,
  ...props
}) => (
  <CustomPlot
    type='pie'
    data={useTransformedData({
      type: 'pie',
      data,
      extra: {
        textinfo: textinfo ?? getTextInfo({ showPercentage, showLabelName }),
        hole: hole ?? (donut ? 0.4 : 0),
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
  showLabelName: PropTypes.bool,
  textinfo: PropTypes.string,
  hole: PropTypes.number,
  ...plotlyPropTypes,
}

Pie.defaultProps = {
  donut: false,
  showPercentage: true,
  showLabelName: false,
  textinfo: null,
  hole: null,
  ...plotlyDefaultProps,
}

export default Pie
