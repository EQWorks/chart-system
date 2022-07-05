import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const PyramidBar = ({
  data,
  showTicks,
  showAxisTitles,
  x,
  y,
  showPercentage,
  axisLabel,
  textPosition,
  ...props
}) => {
  const getSum = () => {
    let total = 0
    y.forEach(k => {
      const sum = data.map(d => d[k]).reduce((acc, val) => acc + val, 0)
      total += sum
    })

    return total
  }

  const _data = useTransformedData({
    type: 'bar',
    data,
    y,
    orientation: 'h',
    variant: 'pyramidBar',
    showPercentage,
    sum: getSum(),
    textPosition,
    ...props,
  })

  const xValReverse = x.slice().reverse()
  const maxVal = Math.max(...x)

  const getTickText = () => {
    let tickText = [...x, 0, ...xValReverse]

    if (showPercentage) { 
      const transformPercentage = x.map(val => `${Math.round((val*100) / getSum())}%`)
      tickText = [...transformPercentage, '0%', ...transformPercentage.slice().reverse()]
    }

    return tickText
  }

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
          range: [-Math.abs(maxVal * 1.2), maxVal * 1.2], 
          ticktext: getTickText(), 
          tickvals: [...x.map(val => -Math.abs(val)), 0, ...xValReverse],
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
  x: PropTypes.arrayOf(PropTypes.number).isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  showTicks: PropTypes.bool,
  showAxisTitles: PropTypes.bool,
  showPercentage: PropTypes.bool,
  axisLabel: PropTypes.arrayOf(PropTypes.string),
  textPosition: PropTypes.oneOf(['inside', 'outside', 'auto', 'none']),
  ...plotlyPropTypes,
}

PyramidBar.defaultProps = {
  showTicks: true,
  showAxisTitles: true,
  showPercentage: false,
  axisLabel: ['count'],
  textPosition: 'outside',
  ...plotlyDefaultProps,
}

export default PyramidBar
