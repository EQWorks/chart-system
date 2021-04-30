import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'

// const percentage = 0.25;

const padding = 10
const spacing = 10
const scale = 0.9
const minWidth = 300

const GaugeBar = ({ data, width, height, config }) => {

  const { dataKey, color, backgroundColor } = config
  const percentage = data[dataKey.x1] / data[dataKey.x2]
  const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width])

  const tickNum = width < minWidth ? 5 : 10
  const ticks = xScale.nice().ticks(tickNum) //ticks are calculated based on domain range
  const filledAmt = xScale(percentage)
  const rectHeight = width * 0.3

  return (
    <svg preserveAspectRatio="xMidYMid meet" width={width} height={height}>
      <g transform={`translate(${padding},${padding})`}>
        <rect rx={0} width={width * scale} height={rectHeight} style={{ fill: backgroundColor }}></rect>
        <rect rx={0} width={filledAmt * scale} height={rectHeight} style={{ fill: color }}>
          <animate attributeName='width' from='0' to={filledAmt} dur='0.3s' repeatCount='1' />
        </rect>
        <g transform={`translate(0 ${rectHeight + spacing})`}>
          {ticks.map((tick, idx) =>
            <g key={idx}>
              <line x1={xScale(tick) * scale} y1={0} x2={xScale(tick) * scale} y2={8} stroke='black' />
              <text style={{
                textAnchor: 'middle',
                fontFamily: 'Open Sans',
                fontSize: '12px',
              }}
              transform={`translate(${xScale(tick) * scale}, ${25})`}>{`${tick * 100}%`}</text>
            </g>,
          )}
        </g>
      </g>
    </svg >
  )
}


GaugeBar.propTypes = {
  config: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    dataKey: PropTypes.shape({
      x1: PropTypes.string,
      x2: PropTypes.string,
    }),
  }).isRequired,
  data: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
}

GaugeBar.defaultProps = {
  color: '#0075FF',
  backgroundColor: '#cdcdcd',
}


export default GaugeBar
