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
  tickSuffix,
  tickPrefix,
  hoverInfo,
  hoverText,
  onAfterPlot,
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
      formatData,
      tickSuffix,
      tickPrefix,
      hoverInfo: hoverInfo || 'label+percent+text',
      hoverText,
      ...props,
    })}
    onAfterPlot={onAfterPlot}
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
  formatData: PropTypes.objectOf(PropTypes.func),
  hoverInfo: PropTypes.string,
  hoverText: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  onAfterPlot: PropTypes.func,
  ...plotlyPropTypes,
}

Pie.defaultProps = {
  donut: false,
  showPercentage: true,
  showLabelName: false,
  textinfo: null,
  hole: null,
  formatData: {},
  tickSuffix: [],
  tickPrefix: [],
  hoverInfo: '',
  hoverText: '',
  onAfterPlot: () => {},
  ...plotlyDefaultProps,
}

export default Pie
