import React, { useMemo, useState, useEffect } from 'react'

import { Bar } from '@nivo/bar'

import CustomBoxLegend from './custom-bar-legend'
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
  // ====[NOTE] below 2 must be supplied together
  groupByKey,
  valueKey,
  maxRowLegendItems,
  trimLegend,
  disableLegend,
  tooltipFormat,
  tooltipFormatX,
  disableTooltipTitle,
  typographyProps,
  ...nivoProps
}) => {
  const {
    finalData,
    baseDataToColorMap,
    finalIndexBy,
    baseKeys,
  } = useMemo(() => {
    /* ====[NOTE]
      a single key is required for the X axis scale
      the rest are used as values
      indexBy cannot be present in keys[]
    */
    const { finalKeys, finalIndexBy } = processDataKeys({ data, keys, indexBy, groupByKey })
    // ====[TODO] props for type (sum, max, min, avg)
    const aggregatedData = aggregateData({ data, keys: finalKeys, indexBy: finalIndexBy, groupByKey, valueKey, type: 'sum' })
    const finalData = processAxisOrder({ data: aggregatedData, axisBottomOrder, finalIndexBy })
    const baseColors = colors.length ? colors : processColors(finalKeys.length, colorType, colorParam)
    const baseDataToColorMap = finalKeys.reduce((agg, key, i) => (
      {
        ...agg,
        [key]: typeof baseColors === 'function' ? baseColors(key) : baseColors[i],
      }
    ), {})
    return {
      finalData,
      baseDataToColorMap,
      finalIndexBy,
      baseKeys: finalKeys,
    }
  }, [data, indexBy, axisBottomOrder, colorParam, colorType, colors, groupByKey, keys, valueKey])

  const [finalKeys, setFinalKeys] = useState(baseKeys)
  useEffect(() => {
    setFinalKeys(baseKeys)
  }, [baseKeys])

  const { finalColors, currentColorMap } = useMemo(() => finalKeys.reduce(({ finalColors, currentColorMap }, key) => ({
    finalColors: [...finalColors, baseDataToColorMap[key]],
    currentColorMap: {
      ...currentColorMap,
      [key]: baseDataToColorMap[key],
    },
  }), {
    finalColors: [],
    currentColorMap: {},
  }), [finalKeys, baseDataToColorMap])

  const legendOnClick = ({ id }) => {
    setFinalKeys(prevData => {
      const idx = prevData.findIndex(key => key === id)
      if (idx < 0) {
        // ====[NOTE] data & colors are matched by index, so keep order of keys
        const newKeys = [...prevData, id]
        return baseKeys.filter(key => newKeys.includes(key))
      }
      return [...prevData.slice(0, idx), ...prevData.slice(idx + 1)]
    })
  }

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
      {...nivoProps}
      layers={['grid', 'axes', 'bars', 'markers', CustomBoxLegend]}
      width={width}
      height={height}
      data={finalData}
      // NOTE yScale, xScale, yFormat, xFormat are not exposed in Bar
      indexBy={finalIndexBy}
      keys={finalKeys}
      colors={finalColors}
      enableRadialLabels={false}
      enableGridY={true}
      enableLabel={false}
      tooltip={({ id, value, color, indexValue }) => ( // also ({ data, index, theme })
        <Tooltip
          label={id}
          color={color}
          display={[
            { label: axisBottomLegendLabel, value: tooltipFormatX(indexValue) },
            { label: axisLeftLegendLabel, value: tooltipFormat(value) },
          ]}
          disableTooltipTitle={disableTooltipTitle}
          chartType='bar'
          typography={typographyProps}
        />
      )}
      onMouseEnter={(_data, event) => {
        let dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'))
        let hoverItemIndex = dataPoints.indexOf(event.target)
        dataPoints.splice(hoverItemIndex, 1)
        dataPoints.forEach(point => {
          point.style.opacity = DATA_HOVER_OPACITY
        })
      }}
      onMouseLeave={(_data, event) => {
        let dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'))
        for (let i = 0; i < dataPoints.length; i++) {
          dataPoints[i].style.opacity = 1
        }
      }}
      {...getCommonProps({
        useAxis: true,
        keys: baseKeys,
        legendOnClick,
        currentColorMap,
        height,
        width,
        axisBottomTrim,
        axisBottomLegendLabel,
        axisBottomTickValues,
        axisBottomLabelDisplayFn,
        axisLeftLabelDisplayFn,
        axisBottomLabelCount,
        lastXAxisTickLabelWidth,
        axisLeftLegendLabel,
        maxYAxisTickLabelWidth,
        maxRowLegendItems,
        trimLegend,
        disableLegend,
        typographyProps,
      })}
      {...legendToggle}
    />
  )
}

BarChart.defaultProps = defaultProps
BarChart.propTypes = propTypes

export default withWrapper(BarChart)
