import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import rewind from '@mapbox/geojson-rewind'

const Choropleth = ({ data, width, height }) => {

  const canvasRef = useRef()

  useEffect(() => {
    if (canvasRef.current && data) {

      const canvas = d3.select(canvasRef.current)
      const ctx = canvas.node().getContext('2d')
      const projection = d3.geoMercator()
        .scale(10000)
        .center([-79.2, 44])
        .translate([width / 2, height / 2])

      const path = d3.geoPath(projection)
      const canvasPath = path.context(ctx)

      ctx.lineWidth = 0.1
      ctx.strokeStyle = 'black'

      const rewindedData = rewind(data.polygon, true)


      rewindedData.features.forEach((feature => {
        ctx.fillStyle = 'rgba(255,0,0,0.5)'
        ctx.beginPath()
        canvasPath(feature)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()

      }))

      const redraw = (transform) => {
        ctx.clearRect(0, 0, width, height)
        ctx.save()
        ctx.translate(transform.x, transform.y)
        ctx.scale(transform.k, transform.k)
        rewindedData.features.forEach((feature => {
          ctx.fillStyle = 'rgba(255,0,0,0.5)'
          ctx.beginPath()
          canvasPath(feature)
          ctx.closePath()
          ctx.stroke()
          ctx.fill()
        }))
        ctx.restore()
      }

      const zoom = d3.zoom()
        .scaleExtent([1, 15])
        .on('zoom', (event) => {
          redraw(event.transform)
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
  }),
  height: PropTypes.number,
  width: PropTypes.number,
}

export default Choropleth
