import React, { useMemo } from 'react'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import ChartWrapper from '../chart-wrapper'
import CustomNode from './custom-node'
import Tooltip from '../tooltip'
import { onMouseEnter, onMouseLeave } from './events'

import {
  getCommonProps,
  processSeriesDataKeys,
  convertDataToNivo,
  processColors,
  processAxisOrderNivo,
  getAxisLabelsSeries,
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
  indexByValue,
  indexBy,
  xKey,
  yKeys,
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
  maxRowLegendItems,
  trimLegend,
  width,
  height,
  ...nivoProps
}) => {
  const { finalIndexBy, finalXKey, finalYKeys } = processSeriesDataKeys({ data, indexBy, xKey, yKeys, indexByValue })
  const unsortedData = convertDataToNivo({ data, indexBy: finalIndexBy, xKey: finalXKey, yKeys: finalYKeys, indexByValue })
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
    () => getAxisLabelsSeries({
      data: finalData,
      xScale: finalXScale,
      yScale: finalYScale,
      width,
      height,
      axisBottomTickValues,
      axisBottomLabelDisplayFn,
      axisLeftLabelDisplayFn
    }),
    [finalData, finalXScale, finalYScale, width, height, axisBottomTickValues, axisBottomLabelDisplayFn, axisLeftLabelDisplayFn],
  )
  return (
    <ResponsiveScatterPlot
      {...nivoProps}
      data={finalData}
      colors={finalColors}
      xScale={finalXScale}
      yScale={finalYScale}
      nodeSize={SYMBOL_SIZE}
      useMesh={false}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      renderNode={CustomNode}
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
        useAxis: true,
        keys: finalData.map(o => o.id),
        yKeys: finalYKeys,
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
        maxRowLegendItems,
        trimLegend
      })}
    />
  )
}

ScatterChart.defaultProps = defaultProps
ScatterChart.propTypes = propTypes

export default ChartWrapper(ScatterChart)
