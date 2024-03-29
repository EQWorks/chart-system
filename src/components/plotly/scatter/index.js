import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const Scatter = ({
  data,
  showTicks,
  showLines,
  showAxisTitles,
  axisTitles,
  x,
  y,
  formatData,
  tickSuffix,
  tickPrefix,
  hoverInfo,
  hoverText,
  onAfterPlot,
  columnNameAliases,
  ...props
}) => (
  <CustomPlot
    type='scatter'
    data={
      useTransformedData({
        type: 'scatter',
        data,
        x,
        y,
        columnNameAliases,
        formatData,
        tickSuffix,
        tickPrefix,
        hoverInfo: hoverInfo || 'x+text+name',
        hoverText,
        extra: {
          mode: showLines ? 'lines+markers' : 'markers',
        },
        ...props,
      })
    }
    layout={{
      xaxis: {
        showticklabels: showTicks,
        automargin: true,
        ticksuffix: hoverInfo || tickSuffix[0],
        tickprefix: hoverInfo || tickPrefix[0],
        ...(showAxisTitles.x && {
          title: {
            text: axisTitles.x || columnNameAliases[x] || x,
            standoff: 20,
          },
        }),
      },
      yaxis: {
        showticklabels: showTicks,
        automargin: true,
        ticksuffix: hoverInfo || tickSuffix[1],
        tickprefix: hoverInfo || tickPrefix[1],
        ...(showAxisTitles.y && (axisTitles.y || y?.length === 1) && {
          title: {
            text: axisTitles.y || columnNameAliases[y[0]] || y[0],
            standoff: 30,
          },
        }),
      },
      ...!showTicks && {
        margin: {
          t: 0,
          b: 0,
          l: 0,
          r: 0,
        },
      },
    }}
    onAfterPlot={onAfterPlot}
    {...props}
  />
)

Scatter.propTypes = {
  x: PropTypes.string.isRequired,
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
  formatData: PropTypes.objectOf(PropTypes.func),
  tickSuffix: PropTypes.arrayOf(PropTypes.string),
  tickPrefix: PropTypes.arrayOf(PropTypes.string),
  hoverInfo: PropTypes.string,
  hoverText: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  onAfterPlot: PropTypes.func,
  columnNameAliases: PropTypes.object,
  ...plotlyPropTypes,
}

Scatter.defaultProps = {
  showTicks: true,
  showAxisTitles: {
    x: true,
    y: true,
  },
  axisTitles: {
    x: '',
    y: '',
  },
  formatData: {},
  tickSuffix: [],
  tickPrefix: [],
  hoverInfo: '',
  hoverText: '',
  onAfterPlot: () => {},
  columnNameAliases: {},
  ...plotlyDefaultProps,
}

export default Scatter
