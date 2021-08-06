import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import rewind from '@mapbox/geojson-rewind'

const ChoroplethSVG = ({ currentDate, threshold, data, width, height }) => {

  const svgRef = useRef()
  const [transform, setTransform] = useState({ x: width / 2, y: height / 2, k: 1 })
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
          if (d.value < threshold) {
            const hsl = d3.hsl(rgb)
            const adjuster = 0.3
            finalCol = `hsl(${hsl.h},${(hsl.s - adjuster) * 100}%,${(hsl.l - adjuster) * 100}%)`
            console.log(finalCol)
          }
          return finalCol
        })
        .attr('transform', transform)
        .on('mouseover', (evt, node) => {
          console.log(node)
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

  return (
    <svg width={width} height={height} ref={svgRef}>
    </svg>
  )
}

ChoroplethSVG.propTypes = {
  currentDate: PropTypes.string,
  data: PropTypes.shape({
    polygon: PropTypes.array,
    properties: PropTypes.shape({
      id: PropTypes.string,
    }),
    time: PropTypes.array,
  }),
  height: PropTypes.number,
  threshold: PropTypes.number,
  width: PropTypes.number,
}

export default ChoroplethSVG
