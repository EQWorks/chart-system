import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import rewind from '@mapbox/geojson-rewind'
import Tooltip from './tooltip'
import Line from './line'
import './choropleth.css'
import avgIdfaData from '../../../stories/data/others/IDFA/average'

const ChoroplethSVG = ({ config, data, width, height }) => {

  const svgRef = useRef()
  const [tooltip, setTooltip] = useState({ target: null, status: false })
  const [transform, setTransform] = useState({ x: width / 2, y: height / 2, k: 1 })
  const [lineData, setLineData] = useState(null)
  const [volatility, setVolatility] = useState(null)
  const { projection, threshold, currentTime, tooltipStyle } = config
  const geoProjection = d3.geoMercator()
    .scale(projection.scale)
    .center(projection.center)
    .translate(projection.translate)
  const path = d3.geoPath(geoProjection)

  useEffect(() => {

    if (svgRef.current && data) {
      const tScale = d3.scaleLinear().domain(d3.extent(data.time, d => d.deviceCount)).range([0, 1])
      const rewindedData = rewind(data.polygon, true)
      console.log(data.polygon)
      const timeData = data.time.filter(d => d[currentTime.key] === currentTime.value)
      const svg = d3.select(svgRef.current)

      d3.select('#map').remove()

      const g = svg.append('g').attr('id', 'map')
      g
        .selectAll('path')
        .data(rewindedData.features)
        .join('path')
        .attr('d', path)
        .attr('stroke-width', '0.5')
        .attr('stroke', 'white')
        .attr('fill', data => {
          const d = timeData.find(({ fsa }) => fsa === data.properties.id)
          const rgb = d3.interpolateWarm(tScale(d?.deviceCount))
          let finalCol = rgb
          if (threshold.status && tScale(d?.deviceCount) < threshold.value) {
            const hsl = d3.hsl(rgb)
            const adjuster = 0.3
            finalCol = `hsl(${hsl.h},${(hsl.s - adjuster) * 100}%,${(hsl.l - adjuster) * 100}%)`
          }
          return finalCol
        })
        .attr('transform', transform)
        .on('mouseover', (evt, node) => {
          setTooltip({ target: node.properties.id, status: true, event: evt })
        })
        .on('mouseout', () => {
          setTooltip({ target: null, status: false, event: null })
        })

      const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {

          g.selectAll('path')
            .attr('transform', () => {
              setTransform(event.transform)
              return event.transform
            })
        })

      svg.call(zoom)
    }

  }, [svgRef.current, data])

  useEffect(() => {
    if (data && tooltip.status) {

      const line = data.time.filter(({ fsa }) => fsa === tooltip.target)
      setLineData(line)
      const l = [...line]
      const firstValue = l.shift()
      const lastValue = l.pop()
      const v = (lastValue[threshold.key] / firstValue[threshold.key]) * 100
      setVolatility(v.toFixed(2))
    }
  }, [tooltip.status])

  const axisScale = d3.scaleLinear()
    .domain(d3.extent(data.time, d => d.deviceCount))
    .range([0, 150])
  const tickNum = 6
  const ticks = axisScale.nice().ticks(tickNum)

  return (<>
    <svg width={width} height={height} ref={svgRef}>
      <defs>
        <linearGradient id="gradient">
          <stop offset="0%" stopColor={`${d3.interpolateWarm(0)}`} />
          <stop offset="100%" stopColor={`${d3.interpolateWarm(1)}`} />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#222" />
      <rect width='150' height='20' transform={`translate(8, ${height - 100})`} fill='url(#gradient)'></rect>
      <g transform={`translate(13, ${height - 80})`}>
        {ticks.map((tick, idx) =>
          <g key={idx}>
            <line x1={axisScale(tick)} y1={0} x2={axisScale(tick)} y2={4} stroke='white' />
            <text style={{
              textAnchor: 'middle',
              fontFamily: 'Open Sans',
              fontSize: '12px',
              fontWeight: 400,
              fill: '#fff',
            }}
            transform={`translate(${axisScale(tick)}, ${25})`}>{`${parseInt(axisScale.invert(tick))}`}</text>
          </g>,
        )}
      </g>
    </svg>
    {tooltip.status &&
      <Tooltip
        width={tooltipStyle.width}
        height='auto'
        left={tooltip.event.clientX}
        top={tooltip.event.clientY}>
        {volatility && <div>
          <p style={{ fontWeight: 600 }}>{tooltip.target}</p>
          <p>{`${volatility > 100 ? volatility - 100 : volatility}% ${volatility > 100 ? 'increased' : 'decreased'}`}</p>
        </div>}
        <svg width={tooltipStyle.width} height={tooltipStyle.height}>
          <g>
            {avgIdfaData && <Line data={avgIdfaData} config={{
              xDomain: [new Date('2021-05-03'), new Date(currentTime.value)],
              yDomain: d3.extent(avgIdfaData, d => d.movingAverage),
              xRange: [0, tooltipStyle.width],
              yRange: [100, 0],
              xKey: 'date',
              yKey: 'movingAverage',
              stroke: '#ccc',
              strokeWidth: 3,
            }} />}
            {lineData && <Line data={lineData} config={{
              xDomain: [new Date('2021-05-03'), new Date(currentTime.value)],
              yDomain: d3.extent(lineData, d => d[threshold.key]),
              xRange: [0, tooltipStyle.width],
              yRange: [100, 0],
              xKey: 'date',
              yKey: 'deviceCount',
              stroke: '#FF0000',
              strokeWidth: 3,
            }} />}
          </g>
          <g transform='translate(0,100)'>
            <g>
              <line x1={0} y1={0} x2={0} y2={8} stroke='black' />
              <text style={{
                textAnchor: 'start',
                fontFamily: 'Open Sans',
                fontSize: '12px',
                fontWeight: 400,
              }} transform='translate(0,20)'>{'05-03'}</text>
            </g>
            <g>
              <line x1={90} y1={0} x2={90} y2={8} stroke='black' />
              <text style={{
                textAnchor: 'middle',
                fontFamily: 'Open Sans',
                fontSize: '12px',
                fontWeight: 400,
              }} transform='translate(90,20)'>{'05-09'}</text>
            </g>
            <g>
              <line x1={180} y1={0} x2={180} y2={8} stroke='black' />
              <text style={{
                textAnchor: 'end',
                fontFamily: 'Open Sans',
                fontSize: '12px',
                fontWeight: 400,
              }} transform='translate(180,20)'>{'05-15'}</text>
            </g>
          </g>
        </svg>
      </Tooltip>}
  </>
  )

}

ChoroplethSVG.propTypes = {
  config: PropTypes.shape({
    currentTime: PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.object,
    }),
    projection: PropTypes.shape({
      center: PropTypes.array,
      scale: PropTypes.number,
      translate: PropTypes.array,
    }),
    threshold: PropTypes.shape({
      key: PropTypes.string,
      status: PropTypes.bool,
      value: PropTypes.number,
    }),
    tooltipStyle: PropTypes.shape({
      height: PropTypes.number,
      width: PropTypes.number,
    }),
  }),
  currentDate: PropTypes.string,
  data: PropTypes.shape({
    polygon: PropTypes.array,
    properties: PropTypes.shape({
      id: PropTypes.string,
    }),
    reduce: PropTypes.func,
    time: PropTypes.array,
  }),
  height: PropTypes.number,
  threshold: PropTypes.number,
  width: PropTypes.number,
}

export default ChoroplethSVG
