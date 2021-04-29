import PropTypes from 'prop-types'
import React from 'react'
import { Pie as VxPie } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleOrdinal } from '@visx/scale'


const margin = { top: 20, right: 20, bottom: 20, left: 20 }

const renderPie = (data, config, pie) => {

  //TODO: add text auto color contrast
  const { dataKey: { item }, colorRange } = config
  const pieColor = scaleOrdinal({
    domain: data.map((d) => d.item),
    range: colorRange,
  })
  console.log(pie);
  return pie.arcs.map((arc, index) => {
    const [centroidX, centroidY] = pie.path.centroid(arc)
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1
    const arcPath = pie.path(arc)
    const arcFill = pieColor(arc.data[item])

    return (
      <g key={`arc-${index}`}>
        <path d={arcPath} fill={arcFill} />
        {hasSpaceForLabel && (
          <text
            x={centroidX}
            y={centroidY}
            dy=".33em"
            fill="#ffffff"
            fontSize={12}
            textAnchor="middle"
            pointerEvents="none"
          >
            {arc.data[item]}
          </text>
        )}
      </g>
    )
  })
}


const Pie = ({ data, width, height, config }) => {

  const { dataKey } = config
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const radius = Math.min(innerWidth, innerHeight) / 2
  const centerY = innerHeight / 2
  const centerX = innerWidth / 2
  const top = centerY + margin.top
  const left = centerX + margin.left

  return (
    <svg width={width} height={height}>
      <Group top={top} left={left}>
        <VxPie
          data={data}
          pieValue={(d) => d[dataKey.value]}
          outerRadius={radius}
        >
          {(pie) => renderPie(data, config, pie)}
        </VxPie>
      </Group>
    </svg>
  )
}

Pie.propTypes = {
  config: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
}

export default Pie
