import React from 'react'
import PropTypes from 'prop-types'

import { plotlyDefaultProps, plotlyPropTypes } from '../shared/constants'
import CustomPlot from '../shared/custom-plot'
import useTransformedData from '../shared/use-transformed-data'

import { getMaxRange } from '../shared/utils'

const Bar = ({
  data,
  stacked,
  showTicks,
  showAxisTitles,
  axisTitles,
  x,
  y,
  orientation,
  textPosition,
  formatData,
  tickSuffix,
  tickPrefix,
  hoverInfo,
  hoverText,
  onAfterPlot,
  columnNameAliases,
  ...props
}) => {
  const _data = useTransformedData({
    type: 'bar',
    data,
    x,
    y,
    columnNameAliases,
    orientation,
    textPosition,
    formatData,
    tickSuffix,
    tickPrefix,
    hoverInfo: hoverInfo || orientation === 'h' ? 'y+text+name' : 'x+text+name',
    hoverText,
    ...props,
  })

  return (
    <CustomPlot
      type='bar'
      data={_data}
      layout={{
        barmode: stacked ? 'stack' : 'group',
        xaxis: {
          range: orientation === 'h' && [0, getMaxRange(_data, stacked)],
          showticklabels: showTicks,
          ticksuffix: hoverInfo && tickSuffix[0],
          tickprefix: hoverInfo && tickPrefix[0],
          automargin: true,
          ...(showAxisTitles.x && {
            title: {
              text: axisTitles.x || columnNameAliases[x] || x,
              standoff: 20,
            },
          }),
        },
        yaxis: {
          showticklabels: showTicks,
          ticksuffix: hoverInfo && tickSuffix[1],
          tickprefix: hoverInfo && tickPrefix[1],
          automargin: true,
          ...(showAxisTitles.y && {
            title: {
              text: axisTitles.y || columnNameAliases[y[0]] || y[0],
              standoff: 20,
            },
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
      onAfterPlot={onAfterPlot}
      {...props}
    />
  )
}

Bar.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.arrayOf(PropTypes.string).isRequired,
  stacked: PropTypes.bool,
  showTicks: PropTypes.bool,
  showAxisTitles: PropTypes.shape({
    x: PropTypes.bool,
    y: PropTypes.bool,
  }),
  axisTitles: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string,
  }),
  orientation: PropTypes.oneOf(['v', 'h']),
  textPosition: PropTypes.oneOf(['inside', 'outside', 'auto', 'none']),
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

Bar.defaultProps = {
  stacked: false,
  showTicks: true,
  showAxisTitles: {
    x: true,
    y: true,
  },
  axisTitles: {
    x: '',
    y: '',
  },
  orientation: 'v',
  textPosition: 'outside',
  formatData: {},
  tickSuffix: [],
  tickPrefix: [],
  hoverInfo: '',
  hoverText: '',
  onAfterPlot: () => {},
  columnNameAliases: {},
  ...plotlyDefaultProps,
}

export default Bar
