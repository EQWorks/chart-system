import React, { useMemo } from 'react'

import { ResponsiveBar } from '@nivo/bar'


import Tooltip from '../tooltip'

import { getCommonProps, processDataKeys, processColors, processAxisOrder, getAxisLabelsBar } from '../../shared/utils'
import { chartPropTypes, chartDefaultProps } from '../../shared/constants/chart-props'


const propTypes = chartPropTypes
const defaultProps = chartDefaultProps

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
  ...nivoProps
}) => {
  // a single key is required for the X axis scale
  // the rest are used as values
  // indexBy cannot be present in keys[]
  const { finalKeys, finalIndexBy } = processDataKeys({ data, keys, indexBy })
  const finalColors = colors.length ? colors : processColors(finalKeys.length, colorType, colorParam)
  const finalData = processAxisOrder({ data, axisBottomOrder, finalIndexBy })

  const axisBottomTickValues = axisBottomLabelValues

  const {
    xLabelCount: axisBottomLabelCount,
    lastXLabelWidth: lastXAxisTickLabelWidth,
    lastYLabelWidth: maxYAxisTickLabelWidth,
  } = getAxisLabelsBar({
    width,
    height,
    data: finalData,
    finalIndexBy,
    keys: finalKeys,
    axisBottomLabelValues,
    axisBottomLabelDisplayFn,
    axisLeftLabelDisplayFn,
    ...nivoProps,
    // minValue,
    // maxValue,
    // padding,
    // reverse,
    // groupMode,
  })

  return (
    <ResponsiveBar
      // TODO right now, our props override, but need to see if there are any that should take precedent
      {...nivoProps}
      data={finalData}
      // NOTE yScale, xScale, yFormat, xFormat are not exposed in Bar
      indexBy={finalIndexBy}
      keys={finalKeys}
      colors={finalColors}
      enableRadialLabels={false}
      enableGridY={true}
      enableLabel={false}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      tooltip={({ id, value, color, indexValue }) => ( // also ({ data, index, theme })
        <Tooltip
          label={id}
          color={color}
          display={[
            { label: axisBottomLegendLabel, value: indexValue },
            { label: axisLeftLegendLabel, value },
          ]}
        />
      )}
      onMouseEnter={(_data, event) => {
        let dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'))
        let hoverItemIndex = dataPoints.indexOf(event.target)
        dataPoints.splice(hoverItemIndex, 1)
        dataPoints.forEach(point => {
          point.style.opacity = 0.1
        })
      }}
      onMouseLeave={(_data, event) => {
        let dataPoints = Array.from(event.target.parentNode.parentElement.getElementsByTagName('rect'))
        for (let i = 0; i < dataPoints.length; i++) {
          dataPoints[i].style.opacity = 1
        }
      }}
      {...getCommonProps({
        data: finalData,
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
      })}
    />
  )
}

BarChart.defaultProps = defaultProps
BarChart.propTypes = propTypes

export default BarChart
