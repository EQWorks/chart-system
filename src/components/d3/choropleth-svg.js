import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import rewind from '@mapbox/geojson-rewind'
import Tooltip from './tooltip'
import Line from './line'

const ChoroplethSVG = ({ currentDate, threshold, data, width, height }) => {

  const svgRef = useRef()
  const [transform, setTransform] = useState({ x: width / 2, y: height / 2, k: 1 })
  const [tooltip, setTooltip] = useState({ target: null, status: false })
  const [lineData, setLineData] = useState(null)
  const [avgLineData, setAvgLineData] = useState(null)

  const projection = d3.geoMercator()
    .scale(10000)
    .center([-79.2, 44])
    .translate([width / 2, height / 2])
  const path = d3.geoPath(projection)

  useEffect(() => {

    if (svgRef.current && data) {
      const rewindedData = rewind(data.polygon, true)
      const timeData = data.time.filter(({ date }) => date === currentDate)
      const svg = d3.select(svgRef.current)
      d3.select('g').remove()
      const g = svg.append('g')
      g
        .selectAll('path')
        .data(rewindedData.features)
        .join('path')
        .attr('d', path)
        .attr('stroke-width', '0.5')
        .attr('stroke', 'white')
        .attr('fill', data => {
          const d = timeData.find(({ fsa }) => fsa === data.properties.id)
          const rgb = d3.interpolateWarm(d?.value)
          let finalCol = rgb
          if (d?.value < threshold) {
            const hsl = d3.hsl(rgb)
            const adjuster = 0.3
            finalCol = `hsl(${hsl.h},${(hsl.s - adjuster) * 100}%,${(hsl.l - adjuster) * 100}%)`
          }
          return finalCol
        })
        .attr('transform', transform)
        .on('mouseover', (evt, node) => {
          setTooltip({ target: node.properties.id, status: true, event: evt })
        })
        .on('mouseout', () => {
          setTooltip({ target: null, status: false, event: null })
        })

      const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {

          g.selectAll('path')
            .attr('transform', () => {
              setTransform(event.transform)
              return event.transform
            })
          // .attr('stroke-width', lineScale(event))
        })

      svg.call(zoom)
    }

  }, [svgRef.current, data])

  const getMinMax = ({ data, key }) => {
    const value = data.reduce((acc, val) => {

      if (!acc.min && !acc.max) {
        acc.min = val[key]
        acc.max = val[key]
        return acc
      }

      return {
        min: acc.min > val[key] ? val[key] : acc.min,
        max: acc.max < val[key] ? val[key] : acc.max,
      }
    }, { min: null, max: null })

    return [value.min, value.max]

  }

  useEffect(() => {
    if (data && tooltip.status) {

      const line = data.time.filter(({ fsa }) => fsa === tooltip.target)
      const avgLine = data.time.sort((a, b) => a.date.localeCompare(b.date)).reduce((acc, val) => {
        const len = acc.length
        if (len !== 0) {
          if (val.date !== acc[len - 1].date) {
            acc.push(val)
          } else {
            const avg = (val.value + acc[len - 1].value) / 2
            acc[len - 1].value = avg
          }
          return acc
        }
        acc.push(val)
        return acc
      }, [])
      setAvgLineData(avgLine)
      setLineData(line)
    }
  }, [tooltip.status])

  return (
    <>
      <svg width={width} height={height} ref={svgRef}>
      </svg>
      {tooltip.status && lineData && avgLineData &&
        <Tooltip
          width={300}
          height='auto'
          left={tooltip.event.clientX}
          top={tooltip.event.clientY}>
          <text>{tooltip.target}</text>
          <svg width={300} height={300}>
            <Line data={avgLineData} config={{
              xDomain: [new Date('2021-07-01'), new Date(currentDate)],
              yDomain: getMinMax({ data: avgLineData, key: 'value' }),
              xRange: [0, 300],
              yRange: [100, 0],
              xKey: 'date',
              yKey: 'value',
              stroke: '#ccc',
              strokeWidth: 1,
            }} />
            <Line data={lineData} config={{
              xDomain: [new Date('2021-07-01'), new Date(currentDate)],
              yDomain: getMinMax({ data: lineData, key: 'value' }),
              xRange: [0, 300],
              yRange: [100, 0],
              xKey: 'date',
              yKey: 'value',
              stroke: '#FF0000',
              strokeWidth: 1,
            }} />
          </svg>
        </Tooltip>}
    </>
  )
}

ChoroplethSVG.propTypes = {
  currentDate: PropTypes.string,
  data: PropTypes.shape({
    polygon: PropTypes.array,
    properties: PropTypes.shape({
      id: PropTypes.string,
    }),
    reduce: PropTypes.func,
    time: PropTypes.array,
  }),
  height: PropTypes.number,
  threshold: PropTypes.number,
  width: PropTypes.number,
}

export default ChoroplethSVG
