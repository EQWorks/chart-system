import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'


const URL = 'https://gist.githubusercontent.com/DoParkEQ/0f438074b19eea9c4c81b907065100fd/raw/120edab420fbc8b557d69335ac4c59dfc67fe828/gta.geojson'

const Choropleth = ({ width, height }) => {

  const canvasRef = useRef()
  const [data, setData] = useState()

  useEffect(() => {
    fetch(URL).then(res => res.json()).then(d => setData(d))
  }, [])

  useEffect(() => {
    if (canvasRef.current && data) {

      const canvas = d3.select(canvasRef.current)
      const ctx = canvas.node().getContext('2d')
      const projection = d3.geoMercator()
        .scale(10000)
        .center([-79.2, 44])
        .translate([width / 2, height / 2])

      const path = d3.geoPath(projection).context(ctx)

      ctx.strokeWidth = 1
      ctx.strokeStyle = 'black'

      ctx.beginPath()
      path(data)
      ctx.stroke()

      const redraw = (transform) => {
        ctx.clearRect(0, 0, width, height)
        ctx.save()
        ctx.translate(transform.x, transform.y)
        ctx.scale(transform.k, transform.k)
        ctx.beginPath()
        path(data)
        ctx.stroke()
        ctx.restore()
      }

      const zoom = d3.zoom()
        .scaleExtent([1, 8])
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
  height: PropTypes.number,
  width: PropTypes.number,
}

export default Choropleth
