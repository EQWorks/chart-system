import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'

import { getAxisTitle, getMaxRange } from '../shared/utils'

const Bar = ({
  data,
  stacked,
  showTicks,
  showAxisTitles,
  axisTitles,
  x,
  y,
  orientation,
  textPosition,
  showPercentage,
  formatData,
  tickSuffix,
  tickPrefix,
  hoverInfo,
  hoverText,
  ...props
}) => {
  const _data = useTransformedData({
    type: 'bar',
    data,
    x,
    y,
    orientation,
    textPosition,
    formatData,
    hoverInfo,
    hoverText,
    ...props,
  })

  return (
    <CustomPlot
      type='bar'
      data={_data}
      layout={{
        barmode: stacked ? 'stack' : 'group',
        xaxis: {
          range: orientation === 'h' && [0, getMaxRange(_data, stacked)],
          showticklabels: showTicks,
          ticksuffix: tickSuffix[0] || orientation === 'h' && showPercentage && '%',
          tickprefix: tickPrefix[0],
          automargin: true,
          ...(showAxisTitles.x && {
            title: getAxisTitle(orientation, 'v', axisTitles.x || x, axisTitles.y ? [axisTitles.y] : y),
          }),
        },
        yaxis: {
          showticklabels: showTicks,
          ticksuffix: tickSuffix[1] || orientation === 'v' && showPercentage && '%',
          tickprefix: tickPrefix[1],
          automargin: true,
          ...(showAxisTitles.y && {
            title: getAxisTitle(orientation, 'h', axisTitles.x || x, axisTitles.y ? [axisTitles.y] : y),
          }),
        },
        margin: {
          l: 50,
          r: 50,
          b: 100,
          t: 100,
          pad: 4,
        },
      }}
      {...props}
    />
  )
}

Bar.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  stacked: PropTypes.bool,
  showTicks: PropTypes.bool,
  showAxisTitles: PropTypes.objectOf(PropTypes.bool),
  axisTitles: PropTypes.objectOf(PropTypes.string),
  showPercentage: PropTypes.bool,
  orientation: PropTypes.oneOf(['v', 'h']),
  textPosition: PropTypes.oneOf(['inside', 'outside', 'auto', 'none']),
  formatData: PropTypes.objectOf(PropTypes.func),
  tickSuffix: PropTypes.arrayOf(PropTypes.string),
  tickPrefix: PropTypes.arrayOf(PropTypes.string),
  hoverInfo: PropTypes.string,
  hoverText: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  ...plotlyPropTypes,
}

Bar.defaultProps = {
  stacked: false,
  showTicks: true,
  showAxisTitles: {
    x: true,
    y: true,
  },
  axisTitles: {
    x: '',
    y: '',
  },
  showPercentage: false,
  orientation: 'v',
  textPosition: 'outside',
  formatData: {},
  tickSuffix: [],
  tickPrefix: [],
  hoverInfo: '',
  hoverText: [],
  ...plotlyDefaultProps,
}

export default Bar
