import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const Bar = ({
  data,
  stacked,
  showTicks,
  showAxisTitles,
  x,
  y,
  orientation,
  textPosition,
  showPercentage,
  formatData,
  tickSuffix,
  tickPrefix,
  ...props
}) => {
  const getAxisTitle = (position) => {
    return {
      text: orientation === position ? x : (y?.length === 1 && y[0]),
      standoff: 20,
    }
  }

  const _data = useTransformedData({
    type: 'bar',
    data,
    x,
    y,
    orientation,
    textPosition,
    formatData,
    ...props,
  })

  const getMaxRange = (data) => {
    const xAxisValues = data.map(v => Math.max(...v.x))
    const roundUpValue = Math.ceil(Math.max(...xAxisValues))
    const arrayOfZero = [...Array(roundUpValue.toString().length - 1).fill('0')]

    let valueUnit = '1'
    arrayOfZero.forEach(v => valueUnit = valueUnit + v)
    
    const maxRange = (Math.ceil(Math.ceil(Math.max(...xAxisValues)) / valueUnit) * valueUnit) * 1.1

    return Number(maxRange.toFixed(0))
  }

  return (
      <CustomPlot
        type='bar'
        data={_data}
        layout={{
          barmode: stacked ? 'stack' : 'group',
          xaxis: {
            range: orientation === 'v' && stacked ? [] : [0, getMaxRange(_data)],
            showticklabels: showTicks,
            ticksuffix: tickSuffix[0] || orientation === 'h' && showPercentage && '%',
            tickprefix: tickPrefix[0],
            automargin: true,
            ...(showAxisTitles && {
              title: getAxisTitle('v'),
            }),
          },
          yaxis: {
            showticklabels: showTicks,
            ticksuffix: tickSuffix[1] || orientation === 'v' && showPercentage && '%',
            tickprefix: tickPrefix[1],
            automargin: true,
            ...(showAxisTitles && {
              title: getAxisTitle('h'),
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
  showAxisTitles: PropTypes.bool,
  showPercentage: PropTypes.bool,
  orientation: PropTypes.oneOf(['v', 'h']),
  textPosition: PropTypes.oneOf(['inside', 'outside', 'auto', 'none']),
  formatData: PropTypes.objectOf(PropTypes.func),
  tickSuffix: PropTypes.arrayOf(PropTypes.string),
  tickPrefix: PropTypes.arrayOf(PropTypes.string),
  ...plotlyPropTypes,
}

Bar.defaultProps = {
  stacked: false,
  showTicks: true,
  showAxisTitles: true,
  showPercentage: false,
  orientation: 'v',
  textPosition: 'outside',
  formatData: {},
  tickSuffix: [],
  tickPrefix: [],
  ...plotlyDefaultProps,
}

export default Bar
