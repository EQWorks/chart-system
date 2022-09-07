import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const BarLine = ({
  data,
  stacked,
  showTicks,
  showAxisTitles,
  x,
  y,
  showCurrency,
  ...props
}) => {
  const bar_data = {
    type: 'bar',
    ...useTransformedData({
      type: 'bar',
      data,
      x,
      y: [y[0]],
      orientation: 'v',
      ...props,
    })[0],
  }

  const scatter_data = {
    type: 'scatter',
    yaxis: 'y2',
    connectgaps: true,
    ...useTransformedData({
      type: 'scatter',
      data,
      x,
      y: [y[1] ? y[1] : y[0]],
      extra: {
        mode: 'lines',
        fill: 'tonexty',
      },
      ...props,
    })[0],
  }

  return (
    <>
      <CustomPlot
        type='barline'
        data={y[1] ? [
          scatter_data,
          bar_data,
        ] : [bar_data]}
        layout={{
          xaxis: {
            showticklabels: showTicks,
            tickmode: 'linear',
            tickformat: '%b %d',
          },
          yaxis: {
            ...(showAxisTitles && y[0] && { 
              title: {
                standoff: 20,
                text: y[0],
              },
            }),
            showticklabels: showTicks,
            tickprefix: showCurrency && '$',
            automargin: true,
            overlaying: 'y2',
          },
          yaxis2: {
            ...(showAxisTitles && y[1] && { 
              title: {
                standoff: 20,
                text: y[1],
              },
            }),
            showticklabels: showTicks,
            automargin: true,
            side: 'right',
          },
        }}
      />
    </>
  )
}

BarLine.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  stacked: PropTypes.bool,
  showTicks: PropTypes.bool,
  showAxisTitles: PropTypes.bool,
  showCurrency: PropTypes.bool,
  ...plotlyPropTypes,
}

BarLine.defaultProps = {
  stacked: false,
  showTicks: true,
  showAxisTitles: true,
  showCurrency: false,
  ...plotlyDefaultProps,
}

export default BarLine
