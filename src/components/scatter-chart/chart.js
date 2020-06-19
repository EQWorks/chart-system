import React from 'react'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import Tooltip from '../tooltip'
import { onMouseEnter, onMouseLeave } from './events'


import { getCommonProps, processSeriesDataKeys, convertDataToNivo, processColors } from '../../shared/utils'
import { chartPropTypes, chartDefaultProps, seriesPropTypes, seriesDefaultProps } from '../../shared/constants/chart-props'


const propTypes = {
  ...seriesPropTypes,
  ...chartPropTypes,
}
const defaultProps = {
  ...seriesDefaultProps,
  ...chartDefaultProps,
}

// ScatterChart - creates a scatter chart
const ScatterChart = ({
  data,
  indexBy,
  xKey,
  yKey,
  colors,
  colorType,
  colorParam,
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  width,
  height,
  ...nivoProps
}) => {

  const { finalIndexBy, finalXKey, finalYKey } = processSeriesDataKeys({ data, indexBy, xKey, yKey })
  const finalData = convertDataToNivo({ data, indexBy: finalIndexBy, xKey: finalXKey, yKey: finalYKey })
  const finalColors = colors.length ? colors : processColors(finalData.length, colorType, colorParam)

  return (
    <ResponsiveScatterPlot
      {...nivoProps}
      data={finalData}
      colors={finalColors}
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
        keys: finalData.map(o => o.id),
        height,
        width,
        axisBottomLegendLabel,
        axisLeftLegendLabel,
        dash: true,
      })}
    />
  )
}

ScatterChart.defaultProps = defaultProps
ScatterChart.propTypes = propTypes

export default ScatterChart
