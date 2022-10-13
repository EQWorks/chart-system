import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const DoubleLine = ({
  data,
  x,
  y,
  formatData,
  showTicks,
  showAxisTitles,
  tickSuffix,
  tickPrefix,
  hoverInfo,
  hoverText,
  ...props
}) => {
  const line_data1 = {
    type: 'line',
    connectgaps: true,
    ...useTransformedData({
      type: 'line',
      data,
      x,
      y: [y[0]],
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

  const line_data2 = {
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
        type='doubleLine'
        data={y[1] ? [
          line_data1,
          line_data2,
        ] : [line_data1]}
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
            tickprefix: tickPrefix[0],
            ticksuffix: tickSuffix[0],
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
            tickprefix: tickPrefix[1],
            ticksuffix: tickSuffix[1],
            automargin: true,
            side: 'right',
          },
          margin: {
            pad: 10,
          },
        }}
      />
    </>
  )
}

DoubleLine.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  formatData: PropTypes.objectOf(PropTypes.func),
  showTicks: PropTypes.bool,
  showAxisTitles: PropTypes.bool,
  tickSuffix: PropTypes.arrayOf(PropTypes.string),
  tickPrefix: PropTypes.arrayOf(PropTypes.string),
  hoverInfo: PropTypes.string,
  hoverText: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  ...plotlyPropTypes,
}

DoubleLine.defaultProps = {
  formatData: {},
  showTicks: true,
  showAxisTitles: true,
  tickSuffix: [],
  tickPrefix: [],
  hoverInfo: '',
  hoverText: [],
  ...plotlyDefaultProps,
}

export default DoubleLine
