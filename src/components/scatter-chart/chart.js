import React, { useMemo } from 'react'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import Tooltip from '../tooltip'
import { onMouseEnter, onMouseLeave } from './events'

import {
  getCommonProps,
  processSeriesDataKeys,
  convertDataToNivo,
  processColors,
  processAxisOrderNivo,
  getAxisLabels,
} from '../../shared/utils'
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
  axisBottomOrder,
  axisBottomLabelValues,
  axisLeftLabelDisplayFn,
  xScale,
  axisLeftLegendLabel,
  yScale,
  width,
  height,
  ...nivoProps
}) => {

  const { finalIndexBy, finalXKey, finalYKey } = processSeriesDataKeys({ data, indexBy, xKey, yKey })
  const unsortedData = convertDataToNivo({ data, indexBy: finalIndexBy, xKey: finalXKey, yKey: finalYKey })
  const finalData = processAxisOrderNivo({ unsortedData, axisBottomOrder })
  const finalColors = colors.length ? colors : processColors(finalData.length, colorType, colorParam)

  const finalXScale = { type: 'linear', ...xScale }
  const finalYScale = { type: 'linear', ...yScale }

  const axisBottomTickValues = axisBottomLabelValues
  const {
    xLabelCount: axisBottomLabelCount,
    lastXLabelWidth: lastXAxisTickLabelWidth,
    lastYLabelWidth: maxYAxisTickLabelWidth,
  } = useMemo(
    () => getAxisLabels({
      data: finalData, xScale: finalXScale, yScale: finalYScale, width, height, axisBottomTickValues, axisBottomLabelDisplayFn
    }),
    [finalData, finalXScale, finalYScale, width, height, axisBottomTickValues, axisBottomLabelDisplayFn],
  )
  return (
    <ResponsiveScatterPlot
      {...nivoProps}
      data={finalData}
      colors={finalColors}
      xScale={finalXScale}
      yScale={finalYScale}
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
        height,
        width,
        axisBottomLegendLabel,
        axisLeftLegendLabel,
        dash: true,
        axisBottomTrim,
        axisBottomLabelDisplayFn,
        axisBottomTickValues,
        axisBottomLabelCount,
        lastXAxisTickLabelWidth,
        axisLeftLabelDisplayFn,
        maxYAxisTickLabelWidth,
      })}
    />
  )
}

ScatterChart.defaultProps = defaultProps
ScatterChart.propTypes = propTypes

export default ScatterChart
