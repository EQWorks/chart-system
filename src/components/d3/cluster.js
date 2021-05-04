import PropTypes from 'prop-types'
import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'


// const graph = {
//   nodes: [
//     { name: 'alice' },
//     { name: 'bob' },
//     { name: 'gordon' },
//     { name: 'chris' },
//     { name: 'james' },
//     { name: 'nick' },
//   ],
//   links: [
//     { source: 'alice', target: 'bob' },
//     { source: 'bob', target: 'gordon' },
//     { source: 'chris', target: 'james' },
//     { source: 'nice', target: 'bob' },
//   ],
// }


const Cluster = ({ width, height, data, config }) => {


  // const nodeList = data.map(el => el['GeoCohortListID'])
  // console.log(data)
  const [groupNum, setGroupNum] = useState(1)
  const { dataKey, color } = config
  const svgRef = useRef(null)
  const nodeList = data.map(el => Math.random() > 0.5 ? [1] : [2])

  useEffect(() => {
    if (svgRef !== null) {

      const ticked = () => {
        // link
        //   .attr('x1', d => d.source.x)
        //   .attr('y1', d => d.source.y)
        //   .attr('x2', d => d.target.x)
        //   .attr('y2', d => d.target.y)
        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)

        hull1
          .attr('d', d => {
            // console.log(d)
            const points = d[0].map(({ x, y }) => [x, y])
            // console.log(points)
            return 'M' + d3.polygonHull(points).join('L') + 'Z'
          })
          // .attr("transform", `translate(${width / 2} ${height / 2})`)
          .attr('class', 'hull')
      }

      const svg = d3.select(svgRef.current)

      svg.selectAll('.nodes').remove()
      svg.selectAll('.hull').remove()
      const xCenter = [width / 4 * 1, width / 4 * 3]

      d3.forceSimulation(nodeList)
        .force('charge', d3.forceManyBody().strength(-10))
        .force('collide', d3.forceCollide(10).strength(.7))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX().x(d => xCenter[d - 1]))
        .force('y', d3.forceY().y(height / 2))
        .on('tick', ticked)

      // const link = d3.select(svgRef.current)
      //   .append('g')
      //   .attr('class', 'links')
      //   .selectAll('line')
      //   .data(graph.links)
      //   .enter()
      //   .append('line')
      //   .attr('stroke-width', 3)
      //   .attr('stroke', 'orange')

      const node = svg
        .append('g')
        .attr('class', 'nodes')
        .selectAll('line')
        .data(nodeList)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', d => d.includes(groupNum) ? color[groupNum - 1] : 'grey')

      const hull1 = svg.append('path')
        .datum([nodeList])


    }
  }, [svgRef, groupNum])


  return (
    <>
      <button onClick={() => setGroupNum(1)}>group 1</button>
      <button onClick={() => setGroupNum(2)}>group 2</button>
      <svg ref={svgRef} width={width} height={height}></svg>
    </>
  )
}

Cluster.propTypes = {
  config: PropTypes.shape({
    color: PropTypes.string,
    dataKey: PropTypes.shape({
      nodes: PropTypes.string,
      groups: PropTypes.string,
    }),
  }),
  data: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
}

Cluster.defaultProps = {
  color: d3.schemeCategory10,
}


export default Cluster
