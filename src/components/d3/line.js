import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'


const Line = ({ data, config }) => {

  const { xKey, yKey, xRange, xDomain, yRange, yDomain, stroke, strokeWidth } = config
  console.log(yDomain)
  const xScale = d3.scaleTime().domain(xDomain).range(xRange)
  const yScale = d3.scaleLinear().domain(yDomain).range(yRange)
  const lineGenerator = d3.line()
    .x(d => xScale(new Date(`${d[xKey]}T00:00:00`)))
    .y(d => yScale(d[yKey]))
    .curve(d3.curveBundle.beta(0.5))

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
