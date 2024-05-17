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
  axisTitles,
  xAxisType,
  tickMode,
  tickFormat,
  tick0,
  dTick,
  tickSuffix,
  tickPrefix,
  showGrid,
  hoverMode,
  hoverLabel,
  hoverFormat,
  hoverInfo,
  hoverText,
  mode,
  onAfterPlot,
  columnNameAliases,
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
      columnNameAliases,
      formatData,
      tickSuffix,
      tickPrefix,
      hoverInfo,
      hoverText,
      extra: {
        mode: mode,
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
      columnNameAliases,
      formatData,
      tickSuffix,
      tickPrefix,
      hoverInfo,
      hoverText,
      extra: {
        mode: mode,
        fill: 'tonexty',
      },
      ...props,
    })[0],
  }

  return (
    <>
      <CustomPlot
        type='doubleLine'
        data={[
          line_data1,
          line_data2,
        ]}
        layout={{
          xaxis: {
            showticklabels: showTicks,
            type: xAxisType,
            tickmode: tickMode,
            tick0,
            dtick: dTick,
            tickformat: tickFormat,
            showgrid: showGrid.x,
            automargin: true,
            hoverformat: hoverFormat.x,
            ...(showAxisTitles.x && {
              title: {
                standoff: 20,
                text: axisTitles.x ||columnNameAliases[x] || x,
              },
            }),
          },
          yaxis: {
            showticklabels: showTicks,
            tickprefix: tickPrefix[0],
            ticksuffix: tickSuffix[0],
            showgrid: showGrid.y,
            automargin: true,
            overlaying: 'y2',
            ...(showAxisTitles.y && y[0] && { 
              title: {
                standoff: 20,
                text: axisTitles.y || columnNameAliases[y[0]] || y[0],
              },
            }),
          },
          yaxis2: {
            showticklabels: showTicks,
            tickprefix: tickPrefix[1],
            ticksuffix: tickSuffix[1],
            showgrid: showGrid.y2,
            automargin: true,
            side: 'right',
            ...(showAxisTitles.y2 && y[1] && { 
              title: {
                standoff: 20,
                text: axisTitles.y2 || columnNameAliases[y[1]] || y[1],
              },
            }),
          },
          hovermode: hoverMode,
          hoverlabel: hoverLabel,
          margin: {
            pad: 10,
          },
        }}
        onAfterPlot={onAfterPlot}
        {...props}
      />
    </>
  )
}

DoubleLine.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  formatData: PropTypes.objectOf(PropTypes.func),
  showTicks: PropTypes.bool,
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
  tickSuffix: PropTypes.arrayOf(PropTypes.string),
  tickPrefix: PropTypes.arrayOf(PropTypes.string),
  hoverInfo: PropTypes.string,
  hoverText: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  mode: PropTypes.string,
  onAfterPlot: PropTypes.func,
  columnNameAliases: PropTypes.object,
  ...plotlyPropTypes,
}

DoubleLine.defaultProps = {
  formatData: {},
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
  xAxisType: '',
  tickMode: 'linear',
  tickFormat: '%b %d',
  tick0: '',
  dTick: '',
  tickSuffix: [],
  tickPrefix: [],
  showGrid: {
    x: true,
    y: true,
    y2: true,
  },
  hoverMode: 'closest',
  hoverLabel: {},
  hoverFormat: {
    x: '',
  },
  hoverInfo: '',
  hoverText: [],
  mode: 'lines+markers',
  onAfterPlot: () => {},
  columnNameAliases: {},
  ...plotlyDefaultProps,
}

export default DoubleLine
