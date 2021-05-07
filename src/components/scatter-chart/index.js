import React, { useMemo, useState, useEffect } from 'react'
import { ScatterPlot } from '@nivo/scatterplot'

import CustomLegend from './custom-scatter-legend'
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
  disableLegend,
  width,
  height,
  tooltipFormat,
  tooltipFormatX,
  disableTooltipTitle,
  typographyProps,
  ...nivoProps
}) => {
  const {
    nivoData,
    baseDataToColorMap,
  } = useMemo(() => {
    const {
      finalIndexBy,
      finalXKey,
      finalYKeys,
    } = processSeriesDataKeys({ data, indexBy, xKey, yKeys, indexByValue })
    const unsortedData = convertDataToNivo({ data, indexBy: finalIndexBy, xKey: finalXKey, yKeys: finalYKeys, indexByValue })
    const nivoData = processAxisOrderNivo({ unsortedData, axisBottomOrder })
    const baseColors = colors.length ? colors : processColors(nivoData.length, colorType, colorParam)
    // ====[TODO] flexible/repeat nature of colors could screw up { id: color } map
    // =========] would need to include repeat logic here?
    const baseDataToColorMap = nivoData.reduce((agg, o, i) => ({ ...agg, [o.id]: baseColors[i] }), {})
    return {
      nivoData,
      baseDataToColorMap,
    }
  }, [data, indexBy, xKey, yKeys, indexByValue, axisBottomOrder])

  const [finalData, setFinalData] = useState(nivoData)
  useEffect(() => {
    setFinalData(nivoData)
  }, [nivoData])

  const { finalColors, currentColorMap } = useMemo(() => finalData.reduce(({ finalColors, currentColorMap }, o) => ({
    finalColors: [...finalColors, baseDataToColorMap[o.id]],
    currentColorMap: {
      ...currentColorMap,
      [o.id]: baseDataToColorMap[o.id],
    },
  }), {
    finalColors: [],
    currentColorMap : {},
  }), [finalData])

  const legendOnClick = ({ id }) => {
    setFinalData(prevData => {
      const idx = prevData.findIndex(o => o.id === id)
      if (idx < 0) {
        // ====[NOTE] data & colors are matched by index, so add back in to original position
        const ogIdx = nivoData.findIndex(o => o.id === id)
        return [...prevData.slice(0, ogIdx), nivoData[ogIdx], ...prevData.slice(ogIdx)]
      }
      return [...prevData.slice(0, idx), ...prevData.slice(idx + 1)]
    })
  }

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
      typographyProps,
    ],
  )

  const legendToggle = useLegendToggle(data)
  return (
    <ScatterPlot
      { ...nivoProps }
      layers={['grid', 'axes', 'nodes', 'markers', CustomLegend]}
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
          disableTooltipTitle={ disableTooltipTitle }
          typography={ typographyProps }
        />
      ) }
      { ...getCommonProps({
        useAxis: true,
        keys: nivoData.map(o => o.id),
        legendOnClick,
        currentColorMap,
        height,
        width,
        axisBottomTrim,
        axisBottomLegendLabel,
        axisBottomLabelDisplayFn,
        axisBottomTickValues,
        axisBottomLabelCount,
        lastXAxisTickLabelWidth,
        axisLeftLegendLabel,  
        axisLeftLabelDisplayFn,
        maxYAxisTickLabelWidth,
        maxRowLegendItems,
        trimLegend,
        disableLegend,
        typographyProps,
        dash: true,
      }) }
      { ...legendToggle }
    />
  )
}

ScatterChart.defaultProps = defaultProps
ScatterChart.propTypes = propTypes

export default withWrapper(ScatterChart)
