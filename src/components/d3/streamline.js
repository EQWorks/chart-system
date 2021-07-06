import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { getAverage } from './utils'
import './streamline.css'


const mouseConfig = {
  position: { ix: 0, iy: 0, x: 0, y: 0, w: 0, h: 0 },
  isDragged: false,
}

const ThresholdLine = ({ type, key, content, path }) => {
  const dy = type === 'max' ? '-10' : '20'
  return (
    <g>
      <path id={`${type}-${key}`} strokeDasharray="10,10" stroke='#222' fill='none' strokeWidth='1' d={path} />
      <text dy={dy} style={{
        fontSize: '12px',
        fill: '#000',
      }}>
        <textPath xlinkHref={`#${type}-${key}`}>{content}</textPath>
      </text>
    </g>
  )
}

ThresholdLine.propTypes = {
  content: PropTypes.string,
  key: PropTypes.string,
  path: PropTypes.string,
  type: PropTypes.string,
}


const Streamline = ({ data, width, height, config }) => {

  const { key, xAxisRange, yAxisRange, style, threshold, isInspected, inspectionMode } = config
  const { color, strokeWidth } = style
  const { max, min, unit } = threshold
  const [mousePos, setMousePos] = useState(mouseConfig)
  const [tooltip, setTooltip] = useState({ isOpen: false, values: null })

  const svgRef = useRef()

  const handleMouseDown = (e) => {
    setMousePos({ isDragged: true, position: { ix: e.offsetX, iy: e.offsetY, x: 0, y: 0, w: 0, h: 0 } })
  }
  const handleMouseUp = () => {
    setMousePos(prev => {
      if (!tooltip.isOpen) {
        const inspectedData = getInspectedData(prev.position).map(d => d[key])
        const tooltipValues = inspectedData.length > 0
          ? {
            min: Math.min(...inspectedData) ?? 0,
            max: Math.max(...inspectedData) ?? 0,
            avg: getAverage(inspectedData) ?? 0,
            volume: (inspectedData.length / data.length * 100) ?? 0,
          } : null
        setTooltip({ values: tooltipValues, position: prev.position, isOpen: true })
      }
      return { isDragged: false, position: { ix: 0, iy: 0, x: 0, y: 0, w: 0, h: 0 } }
    })
  }

  const tooltipOnClose = () => {
    setTooltip({ values: null, isOpen: false })
  }

  const handleMouseMove = (e) => {
    if (mousePos.isDragged) {
      setMousePos(prev => {
        const currentX = e.offsetX
        const currentY = e.offsetY
        const finalMousePos = { x: 0, y: 0, w: 0, h: 0 }
        if (currentX < prev.position.ix) {
          const fx = prev.position.ix - currentX
          finalMousePos.w = fx
          finalMousePos.x = currentX
        }
        if (currentX > prev.position.ix) {
          finalMousePos.x = prev.position.ix
          finalMousePos.w = currentX - prev.position.x
        }
        if (currentY < prev.position.iy) {
          const fy = prev.position.iy - currentY
          finalMousePos.y = currentY
          finalMousePos.h = fy
        }
        if (currentY > prev.position.iy) {
          finalMousePos.y = prev.position.iy
          finalMousePos.h = currentY - prev.position.y
        }

        return { ...prev, position: { ...prev.position, ...finalMousePos } }
      })
    }
  }

  useEffect(() => {
    if (svgRef.current && inspectionMode && isInspected) {
      svgRef.current.addEventListener('mousedown', handleMouseDown)
      svgRef.current.addEventListener('mouseup', handleMouseUp)
      svgRef.current.addEventListener('mousemove', handleMouseMove)
    }
    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener('mousedown', handleMouseDown)
        svgRef.current.removeEventListener('mouseup', handleMouseUp)
        svgRef.current.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [svgRef.current, mousePos.isDragged, isInspected])

  const xScale = d3.scaleLinear()
    .domain(Array.isArray(xAxisRange) ? xAxisRange : [0, data.length - 1])
    .range([0, width])

  const yScale = d3.scaleLinear()
    .domain(yAxisRange)
    .range([height, 0])

  const lineGenerator = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d[key]))
    .curve(d3.curveMonotoneX)

  const path = lineGenerator(data)

  const getLine = (val) => d3.line()([[0, yScale(val)], [width, yScale(val)]])

  const thresholdLines = {
    min: !isNaN(min) ? getLine(min) : null,
    max: !isNaN(max) ? getLine(max) : null,
  }

  const getInspectedData = (pos) => {
    const startX = xScale.invert(pos.x)
    const startY = yScale.invert(pos.y)
    const endX = xScale.invert(pos.x + pos.w)
    const endY = yScale.invert(pos.y + pos.h)
    return data.filter((d, i) => d[key] < startY && d[key] > endY && i > startX && i < endX)

  }

  return (
    <div className='tooltip-container'>
      {tooltip.isOpen && inspectionMode && <div className='tooltip' style={{ position: 'absolute', left: tooltip.position.x, top: tooltip.position.y }}>
        {tooltip.values !== null ? <>
          <p>Inspected data</p>
          <p>{`Max: ${tooltip.values.max.toFixed(2)} ${unit}`}</p>
          <p>{`Min: ${tooltip.values.min.toFixed(2)} ${unit}`}</p>
          <p>{`Average: ${tooltip.values.avg.toFixed(2)} ${unit}`}</p>
          <p>{`Volume: ${tooltip.values.volume.toFixed(2)} %`}</p>
        </>
          : <p>Data not available</p>}
        <button className='btn__tooltip--close' onClick={tooltipOnClose}>Close</button>
      </div>}
      <svg ref={svgRef} width={width} height={height}>
        <defs>
          <linearGradient id={`gradient-${key}`} gradientTransform="rotate(90)">
            <stop offset='5%' stopColor={`${color}40`} />
            <stop offset='90%' stopColor={`${color}00`} />
          </linearGradient>
        </defs>
        <rect x={mousePos.position.x} stroke={color} fill='rgba(0,0,0,0)' strokeDasharray='5 1' y={mousePos.position.y} width={mousePos.position.w} height={mousePos.position.h} />
        <rect x={mousePos.position.x} fill={color} opacity='0.1' y={mousePos.position.y} width={mousePos.position.w} height={mousePos.position.h} />
        {!isInspected && thresholdLines.max && <ThresholdLine path={thresholdLines.max} type='max' key={key} content={`maximum ${max}${unit}`} />}
        {!isInspected && thresholdLines.min && <ThresholdLine path={thresholdLines.min} type='min' key={key} content={`minimum ${min}${unit}`} />}
        <path stroke='rbga(255,255,255,0)' fill={`url(#gradient-${key})`} d={`M0,${height} ` + path + ` V${height} L0,${height}`} />
        <path stroke={color} fill='none' strokeWidth={strokeWidth} d={path} />
        {isInspected && inspectionMode && data.map((d, i) => <circle key={i} cx={xScale(i)} cy={yScale(d[key])} r={strokeWidth} fill='#fff' stroke={color} />)}
      </svg>
    </div>
  )
}

Streamline.propTypes = {
  config: PropTypes.shape({
    inspectionMode: PropTypes.bool,
    isInspected: PropTypes.bool,
    key: PropTypes.string,
    style: PropTypes.shape({
      color: PropTypes.string,
      strokeWidth: PropTypes.number,
    }),
    threshold: PropTypes.shape({
      max: PropTypes.number,
      min: PropTypes.number,
      unit: PropTypes.string,
    }),
    xAxisRange: PropTypes.array,
    yAxisRange: PropTypes.array,
  }),
  data: PropTypes.array,
  height: PropTypes.number,
  width: PropTypes.number,
}

export default Streamline
