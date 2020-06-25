import React from 'react'
import styled from 'styled-components'

import { ResponsiveLine } from '@nivo/line'

import Tooltip from '../tooltip'

import { getCommonProps, processSeriesDataKeys, convertDataToNivo, processColors } from '../../shared/utils'
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
  axisLeftLegendLabel,
  width,
  height,
  ...nivoProps
}) => {

  const { finalIndexBy, finalXKey, finalYKey } = processSeriesDataKeys({ data, indexBy, xKey, yKey })
  const finalData = convertDataToNivo({ data, indexBy: finalIndexBy, xKey: finalXKey, yKey: finalYKey })
  const finalColors = colors.length ? colors : processColors(finalData.length, colorType, colorParam)

  return (
    // NOTE: onMouseLeave and onMouseEnter events not firing correctly
    // https://github.com/plouc/nivo/issues/756
    <Container onMouseOut={mouseOut}>
      <ResponsiveLine
        {...nivoProps}
        data={finalData}
        colors={finalColors}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={0}
        pointBorderColor={{ from: 'serieColor' }}
        useMesh={true}
        enableCrosshair={true}
        crosshairType='bottom'
        onMouseMove={(d, event) => {
          let dataPoints = Array.from(event.target.parentNode.parentNode.getElementsByTagName('path'))
          let hoverItemIndex = data.findIndex(o => d.serieId === o.id)
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
          keys: finalData.map(o => o.id),
          height,
          width,
          axisBottomLegendLabel,
          axisLeftLegendLabel,
          dash: true,
        })}
      >
      </ResponsiveLine>
    </Container>
  )
}

ResponsiveLineChart.defaultProps = defaultProps
ResponsiveLineChart.propTypes = propTypes

export default ResponsiveLineChart
