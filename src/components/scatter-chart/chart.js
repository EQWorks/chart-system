import React from 'react'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import Tooltip from '../tooltip'
import { onMouseEnter, onMouseLeave } from './events'


import { getCommonProps, processColors } from '../../shared/utils'
import { chartPropTypes, chartDefaultProps } from '../../shared/constants/chart-props'


const propTypes = chartPropTypes
const defaultProps = chartDefaultProps

// ScatterChart - creates a scatter chart
const ScatterChart = ({
  data,
  colors,
  colorType,
  colorParam,
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  width,
  height,
  ...nivoProps
}) => (
  <ResponsiveScatterPlot
    {...nivoProps}
    colors={colors.length ? colors : processColors(data.length, colorType, colorParam)}
    xScale={{ type: 'linear' }}
    yScale={{ type: 'linear' }}
    nodeSize={8}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    useMesh={false}
    tooltip={({ node }) => (
      <Tooltip
        label={node.id.split('.')[0]}
        color={node.style.color}
        display={[
          { label: axisBottomLegendLabel, value: node.data.formattedX },
          { label: axisLeftLegendLabel, value: node.data.formattedY },
        ]}
      />
    )}
    {...getCommonProps({
      data,
      height,
      width,
      axisBottomLegendLabel,
      axisLeftLegendLabel,
      dash: true,
      tickValues: data[0].data.length,
    })}
  />
)

ScatterChart.defaultProps = defaultProps
ScatterChart.propTypes = propTypes

export default ScatterChart
