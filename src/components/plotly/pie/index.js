import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'

import { getTextInfo } from '../shared/utils'
import { isPieTooSmallCalc } from '../../../util/numeric'


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
  size,
  columnNameAliases,
  ...props
}) => {
  const { values } = props
  let _hoverInfo = hoverInfo
  if (!hoverInfo) {
    if (values.length === 1) {
      _hoverInfo = 'label+percent+text'
    } else {
      _hoverInfo = 'label+percent+text+name'
    }
  }
  const transformedData = useTransformedData({
    type: 'pie',
    data,
    columnNameAliases,
    extra: {
      textinfo: textinfo ?? getTextInfo({ showPercentage, showLabelName }),
      hole: hole ?? (donut ? 0.4 : 0),
    },
    formatData,
    tickSuffix,
    tickPrefix,
    hoverInfo: _hoverInfo,
    hoverText,
    ...props,
  })

  const isPieTooSmall = useMemo(() => (
    isPieTooSmallCalc(transformedData)
  ), [transformedData])

  return (
    <CustomPlot
      type='pie'
      data={transformedData}
      onAfterPlot={onAfterPlot}
      size={size}
      isPieTooSmall={isPieTooSmall}
      {...props}
    />
  )
}

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
  size: PropTypes.number,
  columnNameAliases: PropTypes.object,
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
  size: 0.8,
  columnNameAliases: {},
  ...plotlyDefaultProps,
}

export default Pie
