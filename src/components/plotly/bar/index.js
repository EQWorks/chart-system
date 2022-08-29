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
  ...props
}) => {
  const getAxisTitle = (position) => {
    return {
      text: orientation === position ? x : (y?.length === 1 && y[0]),
      standoff: 20,
    }
  }

  return (
    <CustomPlot
      type='bar'
      data={
        useTransformedData({
          type: 'bar',
          data,
          x,
          y,
          orientation,
          textPosition,
          ...props,
        })
      }
      layout={{
        barmode: stacked ? 'stack' : 'group',
        xaxis: {
          showticklabels: showTicks,
          ticksuffix: orientation === 'h' && showPercentage && '%',
          automargin: true,
          ...(showAxisTitles && {
            title: getAxisTitle('v'),
          }),
        },
        yaxis: {
          showticklabels: showTicks,
          ticksuffix: orientation === 'v' && showPercentage && '%',
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
  ...plotlyPropTypes,
}

Bar.defaultProps = {
  stacked: false,
  showTicks: true,
  showAxisTitles: true,
  showPercentage: false,
  orientation: 'v',
  textPosition: 'outside',
  ...plotlyDefaultProps,
}

export default Bar
