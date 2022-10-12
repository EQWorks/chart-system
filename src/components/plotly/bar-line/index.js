import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const BarLine = ({
  data,
  showTicks,
  showAxisTitles,
  axisTitles,
  x,
  y,
  showCurrency,
  formatData,
  hoverInfo,
  hoverText,
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
      formatData,
      hoverInfo,
      hoverText,
      ...props,
    })[0],
  }

  const line_data = {
    type: 'line',
    yaxis: 'y2',
    connectgaps: true,
    ...useTransformedData({
      type: 'line',
      data,
      x,
      y: [y[1] ? y[1] : y[0]],
      formatData,
      hoverInfo,
      hoverText,
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
          line_data,
          bar_data,
        ] : [bar_data]}
        layout={{
          xaxis: {
            showticklabels: showTicks,
            tickmode: 'linear',
            tickformat: '%b %d',
            automargin: true,
            ...(showAxisTitles.x && {
              title: {
                standoff: 20,
                text: axisTitles.x || x,
              },
            }),
          },
          yaxis: {
            ...(showAxisTitles.y && y[0] && {
              title: {
                standoff: 20,
                text: axisTitles.y || y[0],
              },
            }),
            showticklabels: showTicks,
            tickprefix: showCurrency && '$',
            automargin: true,
            overlaying: 'y2',
          },
          yaxis2: {
            ...(showAxisTitles.y2 && y[1] && {
              title: {
                standoff: 20,
                text: axisTitles.y2 || y[1],
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
  showTicks: PropTypes.bool,
  showAxisTitles: PropTypes.objectOf(PropTypes.bool),
  axisTitles: PropTypes.objectOf(PropTypes.string),
  showCurrency: PropTypes.bool,
  formatData: PropTypes.objectOf(PropTypes.func),
  hoverInfo: PropTypes.string,
  hoverText: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  ...plotlyPropTypes,
}

BarLine.defaultProps = {
  showTicks: true,
  showAxisTitles: {
    x: true,
    y: true,
    y2: true,
  },
  axisTitles: {
    x: '',
    y: '',
    y2: '',
  },
  showCurrency: false,
  formatData: {},
  hoverInfo: '',
  hoverText: [],
  ...plotlyDefaultProps,
}

export default BarLine