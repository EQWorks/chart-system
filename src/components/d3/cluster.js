import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'


const graph = {
  nodes: [
    { name: 'alice' },
    { name: 'bob' },
    { name: 'gordon' },
    { name: 'chris' },
    { name: 'james' },
    { name: 'nick' },
  ],
  links: [
    { source: 'alice', target: 'bob' },
    { source: 'bob', target: 'gordon' },
    { source: 'chris', target: 'james' },
    { source: 'nice', target: 'bob' },
  ],
}

const Cluster = () => {



  const svgRef = useRef(null)

  const width = 500
  const height = 500


  useEffect(() => {
    if (svgRef !== null) {

      function ticked() {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
      }

      const simulation = d3.forceSimulation(graph.nodes)
        .force('charge', d3.forceManyBody().strength(-10))
        .force('collide', d3.forceCollide(10).strength(0.7))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', ticked)

      const link = d3.select(svgRef.current)
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graph.links)
        .enter()
        .append('line')
        .attr('stroke-width', 3)
        .attr('stroke', 'orange')

      const node = d3.select(svgRef.current)
        .append('g')
        .attr('class', 'nodes')
        .selectAll('line')
        .data(graph.nodes)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', 'orange')
    }
  }, [svgRef])


  return (
    <svg ref={svgRef} width={width} height={height}>

    </svg>
  )
}

export default Cluster
