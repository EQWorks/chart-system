import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'

import { getTextInfo } from '../shared/utils'

const Pie = ({
  donut,
  data,
  showPercentage,
  showLabelName,
  textinfo,
  hole,
  formatData,
  hoverInfo,
  hoverText,
  ...props
}) => {
  return (
    <CustomPlot
      type='pie'
      data={useTransformedData({
        type: 'pie',
        data,
        extra: {
          textinfo: textinfo ?? getTextInfo({ showPercentage, showLabelName }),
          hole: hole ?? (donut ? 0.4 : 0),
        },
        formatData,
        hoverInfo,
        hoverText,
        ...props,
      })}
      {...props}
    />
  )}

Pie.propTypes = {
  label: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  donut: PropTypes.bool,
  showPercentage: PropTypes.bool,
  showLabelName: PropTypes.bool,
  textinfo: PropTypes.string,
  hole: PropTypes.number,
  formatData: PropTypes.objectOf(PropTypes.func),
  hoverInfo: PropTypes.string,
  hoverText: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  ...plotlyPropTypes,
}

Pie.defaultProps = {
  donut: false,
  showPercentage: true,
  showLabelName: false,
  textinfo: null,
  hole: null,
  formatData: {},
  hoverInfo: '',
  hoverText: [],
  ...plotlyDefaultProps,
}

export default Pie
