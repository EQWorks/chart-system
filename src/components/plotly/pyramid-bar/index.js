import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'
import { onlyNumbers, getRoundToNumberDigit } from '../../../util/numeric'


const PyramidBar = ({
  data,
  showTicks,
  showAxisTitles,
  x,
  y,
  showPercentage,
  axisLabel,
  xAxisTick,
  xAxisLabelLength,
  textPosition,
  formatData,
  tickSuffix,
  tickPrefix,
  ...props
}) => {
  const getSum = () => {
    let total = 0
    x.forEach(k => {
      const sum = data.map(d => d[k]).reduce((acc, val) => acc + val, 0)
      total += sum
    })

    return total
  }

  const _data = useTransformedData({
    type: 'bar',
    data,
    x,
    y,
    orientation: 'h',
    variant: 'pyramidBar',
    showPercentage,
    sum: getSum(),
    textPosition,
    formatData,
    ...props,
  })

  const getMaxRange = (data) => {
    const xAxisValues = data.map(v => {
      const values = v.x.map(num => Math.abs(num))
      return Math.max(...values)
    })

    const roundUpValue = Math.ceil(Math.max(...xAxisValues))
    const arrayOfZero = [...Array(roundUpValue.toString().length - 1).fill('0')]

    let valueUnit = '1'
    arrayOfZero.forEach(v => valueUnit = valueUnit + v)
    
    const maxRange = (Math.ceil(roundUpValue / valueUnit) * valueUnit)

    return maxRange
  }

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
      const transformPercentage = axisTicks.map(val => `${Math.round((val*100) / getSum())}%`)
      tickText = [...transformPercentage, '0%', ...transformPercentage.slice().reverse()]
    }

    return { tickText, positive: xValReverse, negative: axisTicks.map(val => -Math.abs(val)) }

  }

  const maxValue = getMaxRange(_data)
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
          ...(showAxisTitles && {
            title: {
              text: axisLabel[0],
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
          ...(showAxisTitles && {
            title: {
              text: axisLabel[1] || Object.keys(data[0])[0],
              standoff: 20,
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
  showAxisTitles: PropTypes.bool,
  showPercentage: PropTypes.bool,
  axisLabel: PropTypes.arrayOf(PropTypes.string),
  xAxisTick: PropTypes.arrayOf(PropTypes.number),
  xAxisLabelLength: PropTypes.number,
  textPosition: PropTypes.oneOf(['inside', 'outside', 'auto', 'none']),
  formatData: PropTypes.objectOf(PropTypes.func),
  tickSuffix: PropTypes.arrayOf(PropTypes.string),
  tickPrefix: PropTypes.arrayOf(PropTypes.string),
  ...plotlyPropTypes,
}

PyramidBar.defaultProps = {
  showTicks: true,
  showAxisTitles: true,
  showPercentage: false,
  axisLabel: ['count'],
  xAxisTick: [],
  xAxisLabelLength: 5,
  textPosition: 'outside',
  formatData: {},
  tickSuffix: [],
  tickPrefix: [],
  ...plotlyDefaultProps,
}

export default PyramidBar
