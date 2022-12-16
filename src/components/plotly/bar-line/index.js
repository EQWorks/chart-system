import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const getDataArray = ({ bar_, line_, sharedYAxis }) => ([
  ...bar_.map(data => ({ type: 'bar', ...data })),
  ...line_.map(data => ({
    type: 'line', 
    yaxis: sharedYAxis ? '' : 'y2', 
    ...data, 
  })),
])

const BarLine = ({
  data,
  x,
  y,
  y2,
  showTicks,
  showAxisTitles,
  axisTitles,
  showGrid,
  formatData,
  tickSuffix,
  tickPrefix,
  hoverInfo,
  hoverText,
  onAfterPlot,
  chartOverlay,
  lineWidth,
  showLineMarkers,
  sharedYAxis,
  lineFill,
  ...props
}) => {
  const bar_ = useTransformedData({
    type: 'bar',
    data,
    x,
    y,
    orientation: 'v',
    textPosition: 'none',
    formatData,
    tickSuffix: tickSuffix[0],
    tickPrefix: tickPrefix[0],
    hoverInfo: hoverInfo || 'x+text+name',
    hoverText,
    ...props,
  })

  const line_ = useTransformedData({
    type: 'line',
    data,
    x,
    y: y2,
    formatData,
    tickSuffix: tickSuffix[1],
    tickPrefix: tickPrefix[1],
    hoverInfo: hoverInfo || 'x+text+name',
    hoverText,
    extra: {
      mode: showLineMarkers ? 'lines+markers' : 'lines',
      line: {
        width: lineWidth,
      },
      fill: lineFill ? 'tonexty' : '',
    },
    ...props,
  })

  return (
    <>
      <CustomPlot
        type='barLine'
        data={getDataArray({ bar_, line_, sharedYAxis })}
        layout={{
          xaxis: {
            showticklabels: showTicks.x,
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
            showticklabels: showTicks.y,
            ticksuffix: tickSuffix[0] || '',
            tickprefix: tickPrefix[0] || '',
            automargin: true,
            showgrid: showGrid.y,
            overlaying: chartOverlay ? 'y2' : '',
            ...(showAxisTitles.y && {
              title: {
                standoff: 20,
                text: axisTitles.y || y[0],
              },
            }),
          },
          yaxis2: {
            showticklabels: showTicks.y2,
            ticksuffix: tickSuffix[1] || '',
            tickprefix: tickPrefix[1] || '',
            automargin: true,
            showgrid: showGrid.y2,
            side: 'right',
            overlaying: chartOverlay ? '' : 'y',
            ...(showAxisTitles.y2 && {
              title: {
                standoff: 20,
                text: axisTitles.y2 || y2[0],
              },
            }),
          },
          margin: {
            pad: 10,
          },
        }}
        onAfterPlot={onAfterPlot}
        multiChartLength={[bar_.length, line_.length]}
        {...props}
      />
    </>
  )
}

BarLine.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  y2: PropTypes.arrayOf(PropTypes.string).isRequired,
  showTicks: PropTypes.shape({
    x: PropTypes.bool,
    y: PropTypes.bool,
    y2: PropTypes.bool,
  }),
  showAxisTitles: PropTypes.shape({
    x: PropTypes.bool,
    y: PropTypes.bool,
    y2: PropTypes.bool,
  }),
  axisTitles: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string,
    y2: PropTypes.string,
  }),
  showGrid: PropTypes.shape({
    y: PropTypes.bool,
    y2: PropTypes.bool,
  }),
  formatData: PropTypes.objectOf(PropTypes.func),
  tickSuffix: PropTypes.arrayOf(PropTypes.string),
  tickPrefix: PropTypes.arrayOf(PropTypes.string),
  hoverInfo: PropTypes.string,
  hoverText: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  onAfterPlot: PropTypes.func,
  isBarOverlay: PropTypes.bool,
  lineWidth: PropTypes.number,
  showLineMarkers: PropTypes.bool,
  sharedYAxis: PropTypes.bool,
  lineFill: PropTypes.bool,
  ...plotlyPropTypes,
}

BarLine.defaultProps = {
  showTicks: {
    x: true,
    y: true,
    y2: true,
  },
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
  showGrid: {
    y: true,
    y2: false,
  },
  formatData: {},
  tickSuffix: [],
  tickPrefix: [],
  hoverInfo: '',
  hoverText: '',
  onAfterPlot: () => {},
  chartOverlay: false,
  lineWidth: 2,
  showLineMarkers: false,
  sharedYAxis: true,
  lineFill: false,
  ...plotlyDefaultProps,
}

export default BarLine
