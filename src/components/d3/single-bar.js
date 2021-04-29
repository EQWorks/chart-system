import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'


const percentage = 0.25;
const rectHeight = 100;
const padding = 50;
const spacing = 10;
const SingleBar = ({ data, width, height, config }) => {

  const { dataKey, color } = config;

  const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

  const ticks = xScale.nice().ticks(10); //ticks are calculated based on domain range

  const path = d3.line()([[0, 0], [width, 0]])

  const filledAmt = xScale(percentage)

  return (
    <svg width={width + padding * 1.5} height={height + padding}>
      <g transform={`translate(${padding / 2},${padding / 2})`}>
        <rect width={width} height={rectHeight} style={{ fill: '#cdcdcd' }}></rect>
        <rect width={filledAmt} height={rectHeight} style={{ fill: '#0075FF' }}>
          <animate attributeName='width' values={`0; ${filledAmt * 0.2}; ${filledAmt};`} keytimes='0.0;0.5;1.0;' dur='0.3s' repeatCount='1' />
        </rect>
        <g transform={`translate(0 ${rectHeight + spacing})`}>
          {/* <path d={path} stroke='black' /> */}
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
