import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import rewind from '@mapbox/geojson-rewind'
import Tooltip from './tooltip'
import Line from './line'
import './choropleth.css'

const ChoroplethSVG = ({ config, data, width, height }) => {

  const svgRef = useRef()
  const [tooltip, setTooltip] = useState({ target: null, status: false })
  const [transform, setTransform] = useState({ x: width / 2, y: height / 2, k: 1 })
  const [lineData, setLineData] = useState(null)
  const [avgLineData, setAvgLineData] = useState(null)
  const [volatility, setVolatility] = useState(null)
  const { projection, threshold, currentTime } = config
  const geoProjection = d3.geoMercator()
    .scale(projection.scale)
    .center(projection.center)
    .translate(projection.translate)
  const path = d3.geoPath(geoProjection)
  // const tickNum = 3;
  // const xDomain = [new Date('2021-07-01'), new Date(currentTime.value)]
  // const xRange = [0, width];
  useEffect(() => {

    if (svgRef.current && data) {
      const rewindedData = rewind(data.polygon, true)
      const timeData = data.time.filter(d => d[currentTime.key] === currentTime.value)
      const svg = d3.select(svgRef.current)
      d3.select('g').remove()
      const g = svg.append('g')
      g
        .selectAll('path')
        .data(rewindedData.features)
        .join('path')
        .attr('d', path)
        .attr('stroke-width', '0.5')
        .attr('stroke', 'white')
        .attr('fill', data => {
          const d = timeData.find(({ fsa }) => fsa === data.properties.id)
          const rgb = d3.interpolateWarm(d?.value)
          let finalCol = rgb
          if (threshold.status && d[threshold.key] < threshold.value) {
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
          // .attr('stroke-width', lineScale(event))
        })

      svg.call(zoom)
    }

  }, [svgRef.current, data])

  useEffect(() => {
    if (data && tooltip.status) {

      const line = data.time.filter(({ fsa }) => fsa === tooltip.target)
      const avgLine = data.time.sort((a, b) => a.date.localeCompare(b.date)).reduce((acc, val) => {
        const len = acc.length
        if (len !== 0) {
          if (val.date !== acc[len - 1].date) {
            acc.push(val)
          } else {
            const avg = (val.value + acc[len - 1].value) / 2
            acc[len - 1].value = avg
          }
          return acc
        }
        acc.push(val)
        return acc
      }, [])
      setAvgLineData(avgLine)
      setLineData(line)
      const values = d3.extent(line, d => d[threshold.key])
      const v = (values[0] - values[1]) * 100
      setVolatility(v.toFixed(2))
    }
  }, [tooltip.status])

  return (<>
    <svg width={width} height={height} ref={svgRef}>
      <rect width="100%" height="100%" fill="#222" />
    </svg>
    {tooltip.status &&
      <Tooltip
        width={180}
        height='auto'
        left={tooltip.event.clientX}
        top={tooltip.event.clientY}>
        {volatility && <div>
          <p style={{ fontWeight: 600 }}>{tooltip.target}</p>
          <p>{`${volatility}% ${volatility > 0 ? 'increased' : 'decreased'}`}</p>
        </div>}
        <svg width={180} height={120}>
          <g>
            {lineData && <Line data={avgLineData} config={{
              xDomain: [new Date('2021-07-01'), new Date(currentTime.value)],
              yDomain: d3.extent(avgLineData, d => d.value),
              xRange: [0, 300],
              yRange: [100, 0],
              xKey: 'date',
              yKey: 'value',
              stroke: '#ccc',
              strokeWidth: 3,
            }} />}
            {avgLineData && <Line data={lineData} config={{
              xDomain: [new Date('2021-07-01'), new Date(currentTime.value)],
              yDomain: d3.extent(lineData, d => d.value),
              xRange: [0, 300],
              yRange: [100, 0],
              xKey: 'date',
              yKey: 'value',
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
              }} transform='translate(0,20)'>{'07-01'}</text>
            </g>
            <g>
              <line x1={90} y1={0} x2={90} y2={8} stroke='black' />
              <text style={{
                textAnchor: 'middle',
                fontFamily: 'Open Sans',
                fontSize: '12px',
                fontWeight: 400,
              }} transform='translate(90,20)'>{'07-01'}</text>
            </g>
            <g>
              <line x1={180} y1={0} x2={180} y2={8} stroke='black' />
              <text style={{
                textAnchor: 'end',
                fontFamily: 'Open Sans',
                fontSize: '12px',
                fontWeight: 400,
              }} transform='translate(180,20)'>{'07-01'}</text>
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
