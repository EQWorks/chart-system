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
  ...props
}) => (
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
        automargin: true,
        ...(showAxisTitles && {
          title: {
            text: x,
            standoff: 20,
          },
        }),
      },
      yaxis: {
        showticklabels: showTicks,
        automargin: true,
        ...(showAxisTitles && y?.length === 1 && {
          title: {
            text: y[0],
            standoff: 30,
          },
        }),
      },
    }}
    {...props}
  />
)

Bar.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  stacked: PropTypes.bool,
  showTicks: PropTypes.bool,
  showAxisTitles: PropTypes.bool,
  orientation: PropTypes.oneOf(['v', 'h']),
  textPosition: PropTypes.oneOf(['inside', 'outside', 'auto', 'none']),
  ...plotlyPropTypes,
}

Bar.defaultProps = {
  stacked: false,
  showTicks: true,
  showAxisTitles: true,
  orientation: 'v',
  textPosition: 'outside',
  ...plotlyDefaultProps,
}

export default Bar
