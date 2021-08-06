import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import rewind from '@mapbox/geojson-rewind'

const Choropleth = ({ currentDate, threshold, data, width, height }) => {

  const canvasRef = useRef()
  const [transform, setTransform] = useState({ x: width / 2, y: height / 2, k: 1 })

  useEffect(() => {
    if (canvasRef.current && data) {
      const canvas = d3.select(canvasRef.current)
      const ctx = canvas.node().getContext('2d')
      const projection = d3.geoMercator()
        .scale(10000)
        .center([-79.2, 44])
        .translate([width / 2, height / 2])

      const path = d3.geoPath(projection).context(ctx)

      ctx.lineWidth = 1.0
      ctx.strokeStyle = 'white'
      const rewindedData = rewind(data.polygon, true)
      const timeData = data.time.filter(({ date }) => date === currentDate)

      const draw = (evt) => {
        ctx.fillStyle = '#222'
        // ctx.clearRect(0, 0, width, height)
        ctx.fillRect(0, 0, width, height)
        ctx.save()
        ctx.translate(evt.x, evt.y)
        ctx.scale(evt.k, evt.k)
        setTransform({ x: evt.x, y: evt.y, k: evt.k })
        rewindedData.features.forEach((feature => {
          const d = timeData.find(({ fsa }) => fsa === feature.properties.id)
          ctx.fillStyle = d3.interpolateWarm(d?.value)
          ctx.beginPath()
          path(feature)
          ctx.closePath()
          ctx.stroke()
          ctx.fill()
          if (d.value < threshold) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)'
            ctx.beginPath()
            path(feature)
            ctx.closePath()
            ctx.fill()
          }
        }))
        ctx.restore()
      }

      draw(transform)

      const zoom = d3.zoom()
        .scaleExtent([1, 15])
        .on('zoom', (event) => {
          draw(event.transform)
        })

      canvas.call(zoom)
    }
  }, [canvasRef.current, data])

  return (
    <canvas width={width} height={height} ref={canvasRef}>
    </canvas>
  )
}

Choropleth.propTypes = {
  data: PropTypes.shape({
    polygon: PropTypes.array,
    time: PropTypes.array,
  }),
  height: PropTypes.number,
  width: PropTypes.number,
  currentDate: PropTypes.string,
  threshold: PropTypes.number,
}

export default Choropleth
