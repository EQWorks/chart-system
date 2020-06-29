import React from 'react'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import Tooltip from '../tooltip'
import { onMouseEnter, onMouseLeave } from './events'


import { getCommonProps, processSeriesDataKeys, convertDataToNivo, processColors } from '../../shared/utils'
import { chartPropTypes, chartDefaultProps, seriesPropTypes, seriesDefaultProps } from '../../shared/constants/chart-props'
import { SYMBOL_SIZE } from '../../shared/constants/dimensions'


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
  axisBottomTrim,
  axisBottomLabelDisplayFn,
  axisLeftLabelDisplayFn,
  xScale,
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
      xScale={{ type: 'point', ...xScale }}
      yScale={{ type: 'linear' }}
      nodeSize={SYMBOL_SIZE}
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
        keys: finalData.map(o => o.id),
        yKeys: [finalYKey],
        xKey: finalXKey,
        isNumeric: true,
        height,
        width,
        axisBottomLegendLabel,
        axisLeftLegendLabel,
        dash: true,
        axisBottomTrim,
        axisBottomLabelDisplayFn,
        axisLeftLabelDisplayFn,
      })}
    />
  )
}

ScatterChart.defaultProps = defaultProps
ScatterChart.propTypes = propTypes

export default ScatterChart
