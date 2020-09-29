import React, { useMemo } from 'react'

import { Bar } from '@nivo/bar'

import { withWrapper } from '../chart-wrapper'
import Tooltip from '../tooltip'

import { useLegendToggle } from '../hooks'
import {
  getCommonProps,
  processDataKeys,
  processColors,
  processAxisOrder,
  getAxisLabelsBar,
  aggregateData,
} from '../../shared/utils'
import {
  chartPropTypes,
  chartDefaultProps,
  barChartPropTypes,
  barChartDefaultProps,
  typographyPropTypes,
  typographyDefaultProps,
} from '../../shared/constants/chart-props'

import { DATA_HOVER_OPACITY } from '../../shared/constants/dimensions'


const propTypes = {
  ...typographyPropTypes,
  ...chartPropTypes,
  ...barChartPropTypes,
}

const defaultProps = {
  ...typographyDefaultProps,
  ...chartDefaultProps,
  ...barChartDefaultProps,
}

const BarChart = ({
  keys,
  indexBy,
  data,
  colors,
  colorType,
  colorParam,
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  width,
  height,
  axisBottomTrim,
  axisBottomLabelDisplayFn,
  axisBottomOrder,
  axisBottomLabelValues,
  axisLeftLabelDisplayFn,
  // must be supplied together
  groupByKey,
  valueKey,
  maxRowLegendItems,
  trimLegend,
  disableLegend,
  tooltipFormat,
  tooltipFormatX,
  typographyProps,
  ...nivoProps
}) => {
  // a single key is required for the X axis scale
  // the rest are used as values
  // indexBy cannot be present in keys[]
  const { finalKeys, finalIndexBy } = processDataKeys({ data, keys, indexBy, groupByKey })
  // TODO: props for type (sum, max, min, avg)
  const aggregatedData = aggregateData({ data, keys: finalKeys, indexBy: finalIndexBy, groupByKey, valueKey, type: 'sum' })
  const finalColors = colors.length ? colors : processColors(finalKeys.length, colorType, colorParam)
  const finalData = processAxisOrder({ data: aggregatedData, axisBottomOrder, finalIndexBy })

  const axisBottomTickValues = axisBottomLabelValues

  const {
    xLabelCount: axisBottomLabelCount,
    lastXLabelWidth: lastXAxisTickLabelWidth,
    maxYLabelWidth: maxYAxisTickLabelWidth,
  } = useMemo(() => getAxisLabelsBar({
    width,
    height,
    data: finalData,
    finalIndexBy,
    keys: finalKeys,
    axisBottomLabelValues,
    axisBottomLabelDisplayFn,
    axisLeftLabelDisplayFn,
    typographyProps,
    ...nivoProps, // relies on: minValue, maxValue, padding, reverse, groupMode
  }), [
    width,
    height,
    finalData,
    finalIndexBy,
    finalKeys,
    axisBottomLabelValues,
    axisBottomLabelDisplayFn,
    axisLeftLabelDisplayFn,
    typographyProps,
    nivoProps,
  ])

  const legendToggle = useLegendToggle(data)

  return (
    <Bar
      // TODO right now, our props override, but need to see if there are any that should take precedent
      { ...nivoProps }
      width={ width }
      height={ height }
      data={ finalData }
      // NOTE yScale, xScale, yFormat, xFormat are not exposed in Bar
      indexBy={ finalIndexBy }
      keys={ finalKeys }
      colors={ finalColors }
      enableRadialLabels={ false }
      enableGridY={ true }
      enableLabel={ false }
      tooltip={ ({ id, value, color, indexValue }) => ( // also ({ data, index, theme })
        <Tooltip
          label={ id }
          color={ color }
          display={ [
            { label: axisBottomLegendLabel, value: tooltipFormatX(indexValue) },
            { label: axisLeftLegendLabel, value: tooltipFormat(value) },
          ] }
          typography={ typographyProps }
        />
      ) }
      onMouseEnter={ (_data, event) => {
        let dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'))
        let hoverItemIndex = dataPoints.indexOf(event.target)
        dataPoints.splice(hoverItemIndex, 1)
        dataPoints.forEach(point => {
          point.style.opacity = DATA_HOVER_OPACITY
        })
      } }
      onMouseLeave={ (_data, event) => {
        let dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'))
        for (let i = 0; i < dataPoints.length; i++) {
          dataPoints[i].style.opacity = 1
        }
      } }
      { ...getCommonProps({
        data: finalData,
        useAxis: true,
        keys: finalKeys,
        yKeys: [finalKeys],
        xKey: finalIndexBy,
        height,
        width,
        axisBottomLegendLabel,
        axisLeftLegendLabel,
        legendProps: { dataFrom: 'keys' },
        axisBottomTickValues,
        axisBottomTrim,
        axisBottomLabelDisplayFn,
        axisLeftLabelDisplayFn,
        axisBottomLabelCount,
        lastXAxisTickLabelWidth,
        maxYAxisTickLabelWidth,
        maxRowLegendItems,
        trimLegend,
        disableLegend,
        typographyProps,
      }) }
      { ...legendToggle }
    />
  )
}

BarChart.defaultProps = defaultProps
BarChart.propTypes = propTypes

export default withWrapper(BarChart)
