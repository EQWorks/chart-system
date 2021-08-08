import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'


const Line = ({ data, config }) => {

  const { xKey, yKey, xRange, xDomain, yRange, yDomain, stroke, strokeWidth } = config

  const xScale = d3.scaleTime().domain(xDomain).range(xRange)
  const yScale = d3.scaleLinear().domain(yDomain).range(yRange)
  const lineGenerator = d3.line()
    .x(d => xScale(new Date(`${d[xKey]}T00:00:00`)))
    .y(d => {
      console.log(yScale(d[yKey]))
      return yScale(d[yKey])
    })

  const path = lineGenerator(data)

  return (
    <path stroke={stroke}
      fill='none'
      strokeWidth={strokeWidth}
      d={path}>
    </path>
  )
}

Line.propTypes = {
  config: PropTypes.shape({
    stroke: PropTypes.string,
    strokeWidth: PropTypes.string,
    xDomain: PropTypes.array,
    xKey: PropTypes.string,
    xRange: PropTypes.array,
    yDomain: PropTypes.array,
    yKey: PropTypes.string,
    yRange: PropTypes.array,
  }),
  data: PropTypes.string,
}

export default Line
