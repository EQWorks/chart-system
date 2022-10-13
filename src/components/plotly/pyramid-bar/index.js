import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'
import { onlyNumbers, getRoundToNumberDigit } from '../../../util/numeric'

import { getMaxRange, getSum } from '../shared/utils'

const PyramidBar = ({
  data,
  showTicks,
  showAxisTitles,
  x,
  y,
  showPercentage,
  axisTitles,
  xAxisTick,
  xAxisLabelLength,
  textPosition,
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
    orientation: 'h',
    variant: 'pyramidBar',
    showPercentage,
    sum: getSum(x, data),
    textPosition,
    formatData,
    hoverInfo,
    hoverText,
    ...props,
  })

  const getAxisTicks = (array, maxValue) => {
    let axisTicks = array

    if (!axisTicks.length || !onlyNumbers(axisTicks)) {
      const determineGraphVal = maxValue > 10 ? getRoundToNumberDigit(maxValue) : 10

      axisTicks = [...Array(xAxisLabelLength).keys()].map((val) => (
        Math.round((determineGraphVal / xAxisLabelLength) * (xAxisLabelLength - val))
      ))
    }

    const xValReverse = axisTicks.slice().reverse()
    
    let tickText = [...axisTicks, 0, ...xValReverse]

    if (showPercentage) { 
      const transformPercentage = axisTicks.map(val => `${Math.round((val*100) / getSum(x, data))}%`)
      tickText = [...transformPercentage, '0%', ...transformPercentage.slice().reverse()]
    }

    return { tickText, positive: xValReverse, negative: axisTicks.map(val => -Math.abs(val)) }
  }

  const maxValue = getMaxRange(_data, false, 'pyramid')
  const getXaxisTicks = getAxisTicks(xAxisTick, maxValue)

  return (
    <CustomPlot
      type='bar'
      data={_data}
      layout={{
        barmode: 'relative',
        bargap: 0.1,
        hovermode: false,
        xaxis: {
          showticklabels: showTicks,
          automargin: true,
          type: 'linear', 
          range: [-Math.abs(maxValue * 1.4), maxValue * 1.4], 
          ticktext: getXaxisTicks.tickText, 
          tickvals: [...getXaxisTicks.negative, 0, ...getXaxisTicks.positive],
          ticksuffix: tickSuffix[0],
          tickprefix: tickPrefix[0],
          ...(showAxisTitles.x && {
            title: {
              text: axisTitles.x,
              standoff: 20,
            },
          }),
        },
        yaxis: {
          showticklabels: showTicks,
          automargin: true,
          type: 'category', 
          autorange: true,
          ticksuffix: tickSuffix[1],
          tickprefix: tickPrefix[1],
          ...(showAxisTitles.y && {
            title: {
              text: axisTitles.y || Object.keys(data[0])[0],
              standoff: 30,
            },
          }),
        },
      }}
      {...props}
    />
  )
}

PyramidBar.propTypes = {
  x: PropTypes.arrayOf(PropTypes.string).isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  showTicks: PropTypes.bool,
  showAxisTitles: PropTypes.shape({
    x: PropTypes.bool,
    y: PropTypes.bool,
  }),
  axisTitles: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string,
  }),
  showPercentage: PropTypes.bool,
  xAxisTick: PropTypes.arrayOf(PropTypes.number),
  xAxisLabelLength: PropTypes.number,
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

PyramidBar.defaultProps = {
  showTicks: true,
  showAxisTitles: {
    x: true,
    y: true,
  },
  axisTitles: {
    x: 'count',
    y: '',
  },
  showPercentage: false,
  xAxisTick: [],
  xAxisLabelLength: 5,
  textPosition: 'outside',
  formatData: {},
  tickSuffix: [],
  tickPrefix: [],
  hoverInfo: 'all',
  hoverText: '',
  ...plotlyDefaultProps,
}

export default PyramidBar
