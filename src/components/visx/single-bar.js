import PropTypes from 'prop-types'
import React from 'react'
import * as d3 from 'd3'

const calculateMargin = ({ axisX, axisY }) => {

  const baseMargin = 24
  const bottomMargin = baseMargin + (axisX.axis ? 24 : 0) + (axisX.label ? 24 : 0)
  const leftMargin = baseMargin + (axisY.axis ? 24 : 0) + (axisY.label ? 24 : 0)

  return {
    top: baseMargin,
    right: baseMargin,
    bottom: bottomMargin,
    left: leftMargin,
  }
}
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


  return (
    <svg width={width + padding * 1.5} height={height + padding}>
      <g transform={`translate(${padding / 2},${padding / 2})`}>
        <rect width={width} height={rectHeight} style={{ fill: '#cdcdcd' }}></rect>
        <rect width={xScale(percentage)} height={rectHeight} style={{ fill: '#0075FF' }}></rect>
        <g transform={`translate(0 ${rectHeight + spacing})`}>
          {/* <path d={path} stroke='black' /> */}
          {ticks.map(tick =>
            <g>
              <line x1={xScale(tick)} y1={0} x2={xScale(tick)} y2={8} stroke='black' />
              <text style={{ textAnchor: 'middle' }} transform={`translate(${xScale(tick)}, ${25})`}>{`${tick * 100}%`}</text>
            </g>
          )}
        </g>
      </g>
    </svg >
  )
}


export default SingleBar
