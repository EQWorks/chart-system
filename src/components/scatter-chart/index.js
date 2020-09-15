import React, { useMemo } from 'react'
import { ScatterPlot } from '@nivo/scatterplot'

import { withWrapper } from '../chart-wrapper'
import CustomNode from './custom-node'
import Tooltip from '../tooltip'
import { onMouseEnter, onMouseLeave } from './events'

import { useLegendToggle } from '../hooks'
import {
  getCommonProps,
  processSeriesDataKeys,
  convertDataToNivo,
  processColors,
  processAxisOrderNivo,
  getAxisLabelsSeries,
} from '../../shared/utils'
import {
  chartPropTypes,
  chartDefaultProps,
  seriesPropTypes,
  seriesDefaultProps,
  typographyPropTypes,
  typographyDefaultProps,
} from '../../shared/constants/chart-props'
import { SYMBOL_SIZE } from '../../shared/constants/dimensions'


const propTypes = {
  ...seriesPropTypes,
  ...chartPropTypes,
  ...typographyPropTypes,
}
const defaultProps = {
  ...seriesDefaultProps,
  ...chartDefaultProps,
  ...typographyDefaultProps,
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
  tooltipFormat,
  tooltipFormatX,
  typographyProps,
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
    maxYLabelWidth: maxYAxisTickLabelWidth,
  } = useMemo(
    () => getAxisLabelsSeries({
      data: finalData,
      xScale: finalXScale,
      yScale: finalYScale,
      width,
      height,
      axisBottomTickValues,
      axisBottomLabelDisplayFn,
      axisLeftLabelDisplayFn,
      typographyProps,
    }),
    [
      finalData,
      finalXScale,
      finalYScale,
      width,
      height,
      axisBottomTickValues,
      axisBottomLabelDisplayFn,
      axisLeftLabelDisplayFn,
    ],
  )

  const legendToggle = useLegendToggle(data)
  return (
    <ScatterPlot
      { ...nivoProps }
      height={ height }
      width={ width }
      data={ finalData }
      colors={ finalColors }
      xScale={ finalXScale }
      yScale={ finalYScale }
      nodeSize={ SYMBOL_SIZE }
      useMesh={ false }
      onMouseEnter={ onMouseEnter }
      onMouseLeave={ onMouseLeave }
      renderNode={ CustomNode }
      tooltip={ ({ node }) => (
        <Tooltip
          label={ node.id.split('.')[0] }
          color={ node.style.color }
          display={ [
            { label: axisBottomLegendLabel, value: tooltipFormatX(node.data.formattedX) },
            { label: axisLeftLegendLabel, value: tooltipFormat(node.data.formattedY) },
          ] }
        />
      ) }
      { ...getCommonProps({
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
        trimLegend,
        typographyProps,
      }) }
      { ...legendToggle }
    />
  )
}

ScatterChart.defaultProps = defaultProps
ScatterChart.propTypes = propTypes

export default withWrapper(ScatterChart)
