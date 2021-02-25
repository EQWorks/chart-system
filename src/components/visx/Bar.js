import PropTypes from 'prop-types'
import React from 'react'
import { Bar as VxBar } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'


const calculateMargin = ({ axisX, axisY }) => {
  
  const baseMargin = 24
  const bottomMargin = baseMargin + (axisX.axis ? 24 : 0) + (axisX.label ? 24 : 0)
  const leftMargin = baseMargin + (axisY.axis ? 24 : 0) + (axisY.label ? 24 : 0)

  return {
    top: baseMargin,
    right: baseMargin,
    bottom: bottomMargin,
    left: leftMargin,
  }
}

const Bar = ({ data, width, height, config }) => {
  
  const { color, dataKey, axisX, axisY } = config
  
  const margin = calculateMargin(config)

  const xMax = width - margin.right - margin.left 
  const yMax = height - margin.bottom - margin.top 
  
  const getX = d => d[dataKey.x]
  const getY = d => d[dataKey.y]

  const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: data.map(getX),
    padding: 0.4,
  })

  const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(getY))],
    padding: 0.4,
  })

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {data.map((d, i) => {
                    
          const xPoint = getX(d)
          const barWidth = xScale.bandwidth()
          const barHeight = yMax - (yScale(getY(d)) ?? 0)
          const barX = xScale(xPoint)
          const barY = yMax - barHeight
          
          return (
            <VxBar
              key={i}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={color}
            />
          )
        })
        }
        {axisX.axis && <AxisBottom label={axisX.label ? dataKey.x : null} top={yMax} scale={xScale} />}
        {axisY.axis && <AxisLeft label={axisY.label ? dataKey.y : null} scale={yScale} />}
      </Group>
    </svg>
  )
}

Bar.propTypes = {
  data: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired,
}

export default Bar
