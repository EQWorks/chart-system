import React, { useMemo } from 'react'
import styled from 'styled-components'

import { ResponsiveLine } from '@nivo/line'

import Tooltip from '../tooltip'

import {
  getCommonProps,
  processSeriesDataKeys,
  convertDataToNivo,
  processColors,
  processAxisOrderNivo,
  getAxisLabelsSeries,
} from '../../shared/utils'
import { chartPropTypes, chartDefaultProps, seriesPropTypes, seriesDefaultProps } from '../../shared/constants/chart-props'

import { DATA_HOVER_OPACITY } from '../../shared/constants/dimensions'


const Container = styled.div`
  height: 100%;
  width: 100%;
`
const propTypes = {
  ...seriesPropTypes,
  ...chartPropTypes,
}
const defaultProps = {
  ...seriesDefaultProps,
  ...chartDefaultProps,
}

const mouseOut = (event) => {
  const container = event.target
  // event target changes depending on what the cursor leaves from
  if (container.tagName === 'rect') {
    container.parentNode.parentNode.getElementsByTagName('path').forEach(p => p.style.opacity = 1.0)
  } else if (container.tagName === 'svg') {
    container.children[1].getElementsByTagName('path').forEach(p => p.style.opacity = 1.0)
  }
}

// LineChart - creates a line chart
const ResponsiveLineChart = ({
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
    // NOTE: onMouseLeave and onMouseEnter events not firing correctly
    // https://github.com/plouc/nivo/issues/756
    <Container onMouseOut={mouseOut}>
      <ResponsiveLine
        {...nivoProps}
        data={finalData}
        colors={finalColors}
        xScale={finalXScale}
        yScale={finalYScale}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={0}
        pointBorderColor={{ from: 'serieColor' }}
        useMesh={true}
        enableCrosshair={true}
        crosshairType='bottom'
        onMouseMove={(d, event) => {
          let dataPoints = Array.from(event.target.parentNode.parentNode.getElementsByTagName('path'))
          let hoverItemIndex = finalData.findIndex(o => d.serieId === o.id)
          let hovered = dataPoints.splice(hoverItemIndex, 1)
          hovered[0].style.opacity = 1.0
          dataPoints.forEach(point => {
            point.style.opacity = DATA_HOVER_OPACITY
          })
        }}
        tooltip={({ point }) => (
          <Tooltip
            color={point.borderColor}
            label={point.serieId}
            display={[
              { label: axisBottomLegendLabel, value: point.data.x },
              { label: axisLeftLegendLabel, value: point.data.y },
            ]}
          />
        )}
        {...getCommonProps({
          data,
          useAxis: true,
          yKeys: finalYKeys,
          xKey: finalXKey,
          keys: finalData.map(o => o.id),
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
      >
      </ResponsiveLine>
    </Container>
  )
}

ResponsiveLineChart.defaultProps = defaultProps
ResponsiveLineChart.propTypes = propTypes

export default ResponsiveLineChart
