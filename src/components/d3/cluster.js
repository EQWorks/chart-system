import PropTypes from 'prop-types'
import React, { useRef, useEffect, useMemo } from 'react'
import * as d3 from 'd3'


const radiusMin = 5
const radiusMax = 15
const start = 0

const Cluster = ({ width, height, data, config }) => {

  const { dataKey, color, currentGroup, tooltip, clusterMaxLength } = config
  const end = clusterMaxLength > 0 ? clusterMaxLength : data.length
  const clusters = useMemo(() => data.sort((a, b) => d3.descending(a[dataKey.radius], b[dataKey.radius])).slice(start, end), [data, dataKey.radius])
  const selected = clusters.map(d => d[dataKey.radius])

  const rScale = d3.scaleLinear()
    .domain(d3.extent(selected))
    .range([radiusMin, radiusMax])

  const svgRef = useRef(null)

  useEffect(() => {
    if (svgRef.current !== null && width > 0 && height > 0) {
      const nodeList = clusters.map(el => {
        const ids = el[dataKey.node]
        return ids.includes(currentGroup) ? [1] : [2]
      })

      const ticked = () => {
        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)

        hull1
          .attr('class', 'hull')
          .style('stroke-width', 40)
          .style('stroke', color)
          .style('fill', color)
          .style('opacity', 0.2)
          .style('stroke-linejoin', 'round')
      }

      const svg = d3.select(svgRef.current)

      svg.selectAll('.nodes').remove()
      svg.selectAll('.hull').remove()
      const xCenter = [width / 5 * 2, width / 5 * 4]
      d3.forceSimulation(nodeList)
        .force('charge', d3.forceManyBody().strength(-10))
        .force('collide', d3.forceCollide().radius((_, i) => rScale(selected[i]) + 2.5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX().x(d => xCenter[d - 1]))
        .force('y', d3.forceY().y(height / 2))
        .on('tick', ticked)

      const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(nodeList)
        .enter()
        .append('circle')
        .attr('r', (_, i) => rScale(selected[i]))
        .attr('fill', d => d.includes(1) ? color : 'grey')

      const hull1 = svg.append('path')
        .datum([nodeList])
        .attr('pointer-events', 'none')

      const tooltipLayer = d3.selectAll('.tooltip')

      node.on('mouseover', (evt, node) => {

        tooltipLayer.style('visibility', 'visible')
          .html(`
          <p><b>${data[node.index][tooltip.dataKey]}</b></p>
          <p>${dataKey.radius}: ${selected[node.index]}</p>
          `)
          .style('left', (evt.offsetX + 50) + 'px')
          .style('top', (evt.offsetY + 50) + 'px')
      })
        .on('mouseout', () => {
          tooltipLayer.style('visibility', 'hidden')
            .selectAll('p')
            .remove()
        })
    }
  }, [svgRef.current, clusters, currentGroup, tooltip])

  return (
    <>
      <svg ref={svgRef} width={width} height={height}></svg>
      <div className='tooltip' style={tooltip.style}></div>
    </>
  )
}

Cluster.propTypes = {
  clusterMaxLength: PropTypes.number,
  config: PropTypes.shape({
    clusterMaxLength: PropTypes.number,
    color: PropTypes.string,
    currentGroup: PropTypes.number,
    dataKey: PropTypes.shape({
      node: PropTypes.string,
      radius: PropTypes.string,
    }),
    tooltip: PropTypes.shape({
      dataKey: PropTypes.any,
      style: PropTypes.any,
    }),
  }),
  data: PropTypes.array,
  height: PropTypes.number,
  width: PropTypes.number,
}

Cluster.defaultProps = {
  clusterMaxLength: 0,
}

export default React.memo(Cluster)
