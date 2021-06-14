import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const Scatter = ({ data }) => {

  const svgRef = useRef(null)

  useEffect(() => {
    
    if (svgRef !== null) {
      const axisRight = d3.axisRight(scaleY)
      const svg = d3.select('#svg')
      svg.append( 'g' )
        .attr( 'transform', `translate(${svg.width},0)` )
        .call( axisRight )
    }

  },[])

  const lineMaker = d3
    .line()
    .x((d) => scaleX(d.x))
    .y((d) => scaleY(d.y1))

  const lineMaker2 = d3
    .line()
    .x((d) => scaleX(d.x))
    .y((d) => scaleY2(d.y2))
  
  const makeScale = (accessor, range) => {
    return d3
      .scaleLinear()
      .domain(d3.extent(data, accessor))
      .range(range)
  }
  
  const drawLine = (accessor, lineType) => {
    
    const lineMaker = d3.line()
      .curve(lineType)
      .x(d => scaleX(d.x))
      .y(accessor)

    return lineMaker(data)
  }

  const scaleX = makeScale(d => d.x, [0, 600])
  const scaleY = makeScale(d => d.y1, [300, 0])
  const scaleY2 = makeScale(d => d.y2, [300, 0])
 
  const axisMaker = d3.axisRight(scaleY)

  const axis = d3.line().x(d => scaleX(d.x)).y(d => 300)

  return (
    <svg ref={svgRef} id="svg" width="100%" height="100vh">
      <g id="ds1">
        {data.map((d, i) => {
          return (
            <circle r={5} fill="green" cx={scaleX(d.x)} cy={scaleY(d.y1)} />
          )
        })}
        <path fill="none" stroke="red" d={drawLine(d=>scaleY(d.y1), d3.curveStep)} />
      </g>
      <g id="ds2">
        {data.map((d, i) => {
          return (
            <circle r={5} fill="blue" cx={scaleX(d.x)} cy={scaleY2(d.y2)} />
          )
        })}
        <path fill="none" stroke="red" d={drawLine(d=>scaleY2(d.y2), d3.curveNatural)} />
      </g>
      <g>
        <path d={axis(data)}/>
        {/* <g>
          <line></line>
          <text></text>
          </g> */}
      </g>
    </svg>
  )
}

export default Scatter
