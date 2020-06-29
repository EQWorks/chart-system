import React, { useMemo } from 'react'
import styled from 'styled-components'

import { ResponsiveLine } from '@nivo/line'

import Tooltip from '../tooltip'

import { getCommonProps, processSeriesDataKeys, convertDataToNivo, processColors, processAxisOrderNivo, getXAxisLabels } from '../../shared/utils'
import { chartPropTypes, chartDefaultProps, seriesPropTypes, seriesDefaultProps } from '../../shared/constants/chart-props'


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
  // TODO: use a similar approach to find out if the last label actually overflows
  const { labelCount: axisBottomLabelCount, lastLabelWidth: lastXAxisTickLabelWidth } = useMemo(
    () => getXAxisLabels({
      data: finalData, xScale: finalXScale, yScale: finalYScale, width, height, axisBottomTickValues, axisBottomLabelDisplayFn
    }),
    [finalData, finalXScale, finalYScale, width, height, axisBottomTickValues, axisBottomLabelDisplayFn],
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
            point.style.opacity = 0.1
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
          yKeys: [finalYKey],
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
        })}
      >
      </ResponsiveLine>
    </Container>
  )
}

ResponsiveLineChart.defaultProps = defaultProps
ResponsiveLineChart.propTypes = propTypes

export default ResponsiveLineChart
