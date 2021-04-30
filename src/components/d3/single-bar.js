import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'

// const percentage = 0.25;

const padding = 20;
const spacing = 10;

const SingleBar = ({ data, width, height, config }) => {

  const { dataKey, color, backgroundColor } = config;
  const percentage = data[dataKey.x1] / data[dataKey.x2];
  const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

  const ticks = xScale.nice().ticks(10); //ticks are calculated based on domain range
  const path = d3.line()([[0, 0], [width, 0]])
  const filledAmt = xScale(percentage)
  console.log(width)
  const adjustment = padding * 2
  const rectHeight = height * 0.7;
  console.log(filledAmt)
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${adjustment / 2},${adjustment / 2})`}>
        <rect rx={8} width={width - adjustment} height={rectHeight} style={{ fill: backgroundColor }}></rect>
        <rect rx={8} width={filledAmt} height={rectHeight} style={{ fill: color }}>
          <animate attributeName='width' from='0' to={filledAmt} dur='0.3s' repeatCount='1' />
        </rect>
        <g transform={`translate(0 ${rectHeight + spacing})`}>
          {ticks.map(tick =>
            <g>
              <line x1={xScale(tick)} y1={0} x2={xScale(tick)} y2={8} stroke='black' />
              <text style={{ textAnchor: 'middle', fontFamily: 'Open Sans', fontSize: '12px' }} transform={`translate(${xScale(tick)}, ${25})`}>{`${tick * 100}%`}</text>
            </g>
          )}
        </g>
      </g>
    </svg >
  )
}


export default SingleBar
