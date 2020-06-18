import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ResponsiveLine } from '@nivo/line'

import Tooltip from '../tooltip'

import { getCommonProps, processColors } from '../../shared/utils'


const Container = styled.div`
  height: 100%;
  width: 100%;
`
// sets common props for Nivo ResponsiveLine component
const setCommonProps = (width, height, data, axisBottomLegendLabel, axisLeftLegendLabel) => ({
  xScale: { type: 'point' },
  yScale: { type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false },
  pointColor: { theme: 'background' },
  pointBorderWidth: 0,
  pointBorderColor: { from: 'serieColor' },
  useMesh: true,
  // enableCrosshair: true,
  // crosshairType: 'bottom',
  ...getCommonProps({
    data,
    height,
    width,
    axisBottomLegendLabel,
    axisLeftLegendLabel,
    dash: true,
    tickValues: data[0].data.length,
  })
})

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  axisBottomLegendLabel: PropTypes.string,
  axisLeftLegendLabel: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

const defaultProps = {
  axisBottomLegendLabel: '',
  axisLeftLegendLabel: '',
  width: 100,
  height: 100,
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
  axisBottomLegendLabel,
  axisLeftLegendLabel,
  width,
  height,
}) => {

  const finalColors = processColors(data.length, 'palette', '70')

  return (
    // NOTE: onMouseLeave and onMouseEnter events not firing correctly
    // https://github.com/plouc/nivo/issues/756
    <Container onMouseOut={mouseOut}>
      <ResponsiveLine
        {...setCommonProps(width, height, data, axisBottomLegendLabel, axisLeftLegendLabel)}
        colors={finalColors}
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
      >
      </ResponsiveLine>
    </Container>
  )
}

ResponsiveLineChart.defaultProps = defaultProps
ResponsiveLineChart.propTypes = propTypes

export default ResponsiveLineChart
