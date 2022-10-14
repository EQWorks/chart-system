import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'


const Line = ({
  data,
  spline,
  showTicks,
  showAxisTitles,
  axisTitles,
  x,
  y,
  formatData,
  tickSuffix,
  tickPrefix,
  hoverInfo,
  hoverText,
  ...props
}) => (
  <CustomPlot
    type='line'
    data={
      useTransformedData({
        type: 'line',
        data,
        x,
        y,
        formatData,
        tickSuffix,
        tickPrefix,
        hoverInfo: hoverInfo || 'x+text+name',
        hoverText,
        extra: {
          line: {
            shape: spline ? 'spline' : 'linear',
          },
        },
        ...props,
      })
    }
    layout={{
      xaxis: {
        showticklabels: showTicks,
        automargin: true,
        ticksuffix: hoverInfo && tickSuffix[0],
        tickprefix: hoverInfo && tickPrefix[0],
        ...(showAxisTitles.x && {
          title: {
            text: axisTitles.x || x,
            standoff: 20,
          },
        }),
      },
      yaxis: {
        showticklabels: showTicks,
        automargin: true,
        ticksuffix: hoverInfo && tickSuffix[1],
        tickprefix: hoverInfo && tickPrefix[1],
        ...(showAxisTitles.y && (axisTitles.y || y?.length === 1) && {
          title: {
            text: axisTitles.y || y[0],
            standoff: 30,
          },
        }),
      },
    }}
    {...props}
  />
)

Line.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  spline: PropTypes.bool,
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
  ...plotlyPropTypes,
}

Line.defaultProps = {
  spline: false,
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
  ...plotlyDefaultProps,
}

export default Line
